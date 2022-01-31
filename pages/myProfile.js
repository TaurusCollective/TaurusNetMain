import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMoralis, useMoralisCloudFunction, useMoralisFile, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import Error from '../components/Error/Error';
import Header from "../components/Header"
import { useMoralisDapp } from '../providers/MoralisDappProvider/MoralisDappProvider';
import { CameraIcon } from "@heroicons/react/outline";
import MyPosts from '../components/Profile/MyPosts';
import {message} from "antd";
import MyPostsAvax from '../components/Profile/MyPostsAvax';
import { Modal, Button } from 'antd';
import {PencilIcon} from '@heroicons/react/solid'
import { useRouter } from "next/dist/client/router";

function myProfile() {
    const { authenticate, isAuthenticated, logout, user, setUserData, userError, isUserUpdating } = useMoralis();
    const {contractUserABI, contractUserAddress, chainId} = useMoralisDapp();
    const contractUserABIJson = JSON.parse(contractUserABI);
    const ipfsProcessor = useMoralisFile();
    const contractProcessor = useWeb3ExecuteFunction();

    const [myUsername, setMyUsername] = useState('');
    const [myEmail, setMyEmail] = useState('');
    const [myBio, setMyBio] = useState('');
    const [selectedFile, setSelectedFile] = useState(null)
    const filePickerRef = useRef(null);
    const [photoFile, setPhotoFile] = useState();
    const [userPostsList, setUserPostsList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();


    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    const [limit, setLimit] = useState(3);
    // const queryUser = useMoralisQuery(
    //     "User"
    // );

    const { data, error, isLoading } = useMoralisQuery(
        "User",
        query =>
          query
            .limit(limit),
        [limit],
    );

        
    const [isAvax, setIsAvax] = useState(true);
    useEffect(() => {
        if(chainId == 0xa869){ // Avalanche testnet
            console.log("Tu pravi da je avax")
            setIsAvax(true);
        }else if(chainId == 0x61){      // BSC testnet
            console.log("Tu pravi da je bsc")
            setIsAvax(false)
        }
    }, [chainId]);



    //const postsList = JSON.parse(JSON.stringify(data, ["postList"])).reverse();

    useEffect(() => {
        const postsList = JSON.parse(JSON.stringify(data, ["postList"])).reverse();
        console.log("mydata : ",data)
        postsList.forEach(postInList => {
            const { postList } = postInList;
            console.log("TUUU0 :",postInList)
            console.log("TUUU1 :",postList)
            setUserPostsList(postList);
            // postList.forEach(element => {
            //     console.log(element)
            // });
        });
    }, [data])

    useEffect(() => {
        if(user){
            console.log("USER: ", user);
            setMyUsername(user.attributes.username);
            if(user.attributes.email){
                setMyEmail(user.attributes.email);
            }else{
                setMyEmail('');
            }
            if(user.attributes.userBio){
                setMyBio(user.attributes.userBio);
            }else{
                setMyBio('');
            }
            setSelectedFile(user.attributes.avatar);
        }
        else{
            setMyUsername("SIGN IN");
            setMyEmail("");
            setSelectedFile("");
            setMyBio("");
        }
    }, [user])

    const handleSaveProfile = () => {
        setUserData({
            username: myUsername,
            email: myEmail,
            avatar: selectedFile,
            userBio: myBio
            //password: password == "" ? undefined : password   //  just wrote this as an example. If you send undefined it will skip that value, not save it.
        })
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

    //console.log("userPostsList : ", userPostsList);

    async function addUser(userData) {
        console.log("userData : ",userData);
        const contentUri = await processContent(userData); 
        console.log("contentUri ",contentUri);
        const options = {
            contractAddress: contractUserAddress,
            functionName: "createUser",
            abi: contractUserABIJson,
            params: {
                _contentUri: contentUri
            },
        }
        await contractProcessor.fetch({params:options,
            onSuccess: () => message.success("success"),
            onError: (error) => message.error(error),
        });
    }

    const processContent = async (content) => {
        const ipfsResult = await ipfsProcessor.saveFile(
            "post.json",
            { base64: btoa(JSON.stringify(content)) },
            { saveIPFS: true}
        )
        return ipfsResult._ipfs;
    }


    const handleSaveProfileToChain = () => {
        addUser({myUsername, selectedFile, userPostsList});
    }


   // console.log("userPostsList : ", userPostsList)
    return (
        <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
          <Head>
            <title>MyProfile</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
    
    
    
          <Header />

          <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:mx-w-6xl mx-auto">
            
            <section className="col-span-3">

                <div className="bg-white my-7 border  p-5 rounded roundedBorder">
                    <div className='profileImageDiv'>
                    {selectedFile ? (
                        <img src={selectedFile} className="cursor-pointer    rounded-full h-20 w-20 object-contain border p-1 mr-3 profilePageProfileImage" onClick={() => setSelectedFile(null)} alt="selected image" />
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
                    </div>
                    {/* <div>
                        <div className="mt-3 text-center sm:mt-5">
                            <div
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900"
                            >
                            </div>
                            <div>
                                <input ref={filePickerRef} type="file" hidden onChange={addImageToPost}/>
                            </div>
                        </div>
                    </div> */}


                    {/* <Button type="primary" onClick={showModal}>
                    Open Modal 
                    </Button> */}
                

                    {/* <p>My Username: </p>
                    <input style={{width: "250px"}} value={myUsername} onChange={(e) => setMyUsername(e.currentTarget.value)}/> */}
                    {/* <p>My Email: </p>
                    <input style={{width: "250px"}} value={myEmail} onChange={(e) => setMyEmail(e.currentTarget.value)}/> */}
                    <div className='basicUserInfoDiv'>
                        <p className='userName'><b>@{myUsername} </b></p>
                        <PencilIcon className="btn postButtons" onClick={showModal}/>
                        <p>{myEmail} </p>
                    </div>
         
                    <p className='userBioP'>{myBio} </p>
                    <Button className='myNftsButton' shape="round" onClick={() => router.push('/myNFTs')} >
                        MyNFTs
                    </Button>



                    {/* {selectedFile ? (
                        <img src={selectedFile} className="w-12 object-contain cursor-pointer" onClick={() => setSelectedFile(null)} alt="selected image" />
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
                            </div>
                            <div>
                                <input ref={filePickerRef} type="file" hidden onChange={addImageToPost}/>
                            </div>
                        </div>
                    </div> */}


                    {/* <button onClick={handleSaveProfile} isLoading={isUserUpdating}>Save</button> */}
                    {/* <button onClick={handleSaveProfile} >Save</button>

                    <div>
                        <button onClick={handleSaveProfileToChain} >Save To Chain</button>
                    </div> */}

                    {/* {userError &&
                        <Error title="User change Failed" message={userError.message} />
                    } */}



                </div>





            {/* My Posts: */}
            {userPostsList &&
                isAvax ? (
                    <MyPostsAvax myPostsList={userPostsList}/>
                  ) : (
                    <MyPosts myPostsList={userPostsList}/>
                  )
                  //<MyPosts myPostsList={userPostsList}/>
            }

        </section>

        </main>

        <>
     
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {selectedFile ? (
                        <img src={selectedFile} className="w-12 object-contain cursor-pointer" onClick={() => setSelectedFile(null)} alt="selected image" />
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
                            </div>
                            <div>
                                <input ref={filePickerRef} type="file" hidden onChange={addImageToPost}/>
                            </div>
                        </div>
                    </div>

                    
                    <p><b>My Username:</b></p>
                    <input style={{width: "250px"}} value={myUsername} onChange={(e) => setMyUsername(e.currentTarget.value)}/>
                    <p><b>My Email:</b></p>
                    <input style={{width: "250px"}} value={myEmail} onChange={(e) => setMyEmail(e.currentTarget.value)}/>
                    <p><b>My Bio:</b></p>
                    <input style={{width: "250px"}} value={myBio} onChange={(e) => setMyBio(e.currentTarget.value)}/>

                    <div className='saveDivOnEdit'>
                        <Button type="primary" onClick={handleSaveProfile} >Save</Button>
                    </div>

                    <div className='saveDivOnEdit'>
                        <Button type="primary"onClick={handleSaveProfileToChain} >Save To Chain</Button>
                    </div>

                    {userError &&
                        <Error title="User change Failed" message={userError.message} />
                    }



        </Modal>
      </>

        </div>
      )
}

export default myProfile
