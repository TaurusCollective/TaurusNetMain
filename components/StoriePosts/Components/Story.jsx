import { useRef, useState } from "react";
import { Button, Card, Modal } from "antd";
import { Image } from 'antd';
import { CameraIcon } from "@heroicons/react/outline";
import { useMoralis, useMoralisCloudFunction, useNewMoralisObject } from "react-moralis";
import { Alert } from 'antd';

function Story({profileImg, img, userAddres}) {
    const [isModalVisibleUploadStory, setIsModalVisibleUploadStory] = useState(false);
    const [visible, setVisible] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null)
    const filePickerRef = useRef(null);
    const [photoFile, setPhotoFile] = useState();

    const { isSaving, error, save } = useNewMoralisObject('Stories');
    const { user} = useMoralis();

    //const [username, setUsername] = useState("")
    const [storyOwnerUsername, setStoryOwnerUsername] = useState("");
    const [storyOwnerAvatar, setStoryOwnerAvatar] = useState("");

    //console.log("userAddres : ", userAddres)


    async function getStoryOwner() {
        const { data, error, isLoading } = await useMoralisCloudFunction("StoryOwnerUser", {
            userAddres,
        });

        //console.log("datadata : ", data);

        if(data){
            setStoryOwnerUsername(data.username)
            setStoryOwnerAvatar(data.avatar)
        }
    }

    if(userAddres){
        getStoryOwner();
    }




    const addImageToPost = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
            setPhotoFile(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        }
    }

    const handleSaveProfile = () => {
        save({storyImg: selectedFile, user: user.attributes.ethAddress})
    }


    return (
        <div>
            {/* <img className="h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out" src={img} alt="" /> */}
            
            {profileImg ? (
                <img onClick={() => setIsModalVisibleUploadStory(true)} className="h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out" src={profileImg} alt="" />
            ):(
                // <Image className="h-14 w-14 rounded-full p-[1.5px] border-solid border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out inline-block" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" alt="" />
                <Image
       
                preview={{ visible: false }}
                className="ImgStorProfheight h-14 w-14 rounded-full p-[1.5px] border-solid border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out inline-block"
                src={storyOwnerAvatar}
                // mask={false}
                // maskClassName="myAntImageMaskNone"
                onClick={() => setVisible(true)}
              />
            )}
            
            {/* <img className="h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out" src="https://image.shutterstock.com/image-photo/profile-picture-smiling-millennial-asian-260nw-1836020740.jpg" alt="" /> */}
            <p className="text-xs w-14 truncate text-center">{storyOwnerUsername}</p>

            <div style={{ display: 'none' }}>
                <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                {/* <Image className="imagePopup" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" /> */}
                <Image className="imagePopup" src={img} />
                </Image.PreviewGroup>
            </div>


            <Modal
                visible={isModalVisibleUploadStory}
                footer={null}
                onCancel={() => setIsModalVisibleUploadStory(false)}
                bodyStyle={{
                padding: "15px",
                fontSize: "17px",
                fontWeight: "500",
                }}
                style={{ fontSize: "16px", fontWeight: "500"}}
                width="400px"
            >
                Share Your Story
                <Card
                style={{
                    marginTop: "10px",
                    borderRadius: "1rem",
                }}
                bodyStyle={{ padding: "15px" }}
                >

                    {error && <div>{error}</div>}
 
                    {selectedFile ? (
                        <img src={selectedFile} className="w-full object-contain cursor-pointer" onClick={() => setSelectedFile(null)} alt="selected image" />
                    ) : (
                        <div
                            onClick={() => filePickerRef.current.click()}
                            className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                        >
                            <CameraIcon 
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                            />
                        </div>
                     )}
                    <div>
                        <div className="mt-3 text-center sm:mt-5">
                            <div
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900"
                            >
                                Upload a photo
                            </div>
                            <div>
                                <input ref={filePickerRef} type="file" hidden onChange={addImageToPost} disabled={isSaving}/>
                            </div>
                        </div>
                    </div>


                </Card>
                <Button
                size="large"
                type="primary"
                style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "0.5rem",
                    fontSize: "16px",
                    fontWeight: "500",
                }}
                onClick={() => {
                    handleSaveProfile();
                    setIsModalVisibleUploadStory(false);
                }}
                >
                Post Story
                </Button>
            </Modal>




        </div>
    )
}

export default Story
