import {useMoralisDapp} from "../../../providers/MoralisDappProvider/MoralisDappProvider";
import {useMoralisFile} from "react-moralis";
import {useWeb3ExecuteFunction} from "react-moralis";
import {useState, useRef} from "react";
import {message} from "antd";
import { CameraIcon } from "@heroicons/react/outline";

const AddPost = () => {
    const {contractABI, contractAddress, selectedCategory} = useMoralisDapp();
    const contractABIJson = JSON.parse(contractABI);
    const ipfsProcessor = useMoralisFile();
    const contractProcessor = useWeb3ExecuteFunction();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null)
    const filePickerRef = useRef(null);
    const [photoFile, setPhotoFile] = useState();
    const [parentId, setParentId] = useState("0x91")
    
    async function addPost(post) {
        const contentUri = await processContent(post); 
        const categoryId = selectedCategory["categoryId"];
        const options = {
            contractAddress: contractAddress,
            functionName: "createPost",
            abi: contractABIJson,
            params: {
                _parentId: parentId,
                _contentUri: contentUri,
                _categoryId: categoryId
            },
            }
        await contractProcessor.fetch({params:options,
            onSuccess: () => message.success("success"),
            onError: (error) => message.error(error),
        });
    }

    async function myFunctionThatCatches(data) {
        try {
            return await ipfsProcessor.saveFile(
                data.name,
                data,
                { saveIPFS: true}
            ) // <-- Notice we added here the "await" keyword.
        } catch (e) {
            console.error("ERROR : ",e);
        } finally {
            console.log('We do cleanup here');
        }
        return;
    }


    const processContent = async (content) => {
        // Save file input to IPFS
        const data = content.photoFile;
       console.log(data);
       console.log('photoFile : ', photoFile);
       console.log('ipfsProcessor : ', ipfsProcessor);

        const ipfsImage = await myFunctionThatCatches(data);

        if(!ipfsImage){
            console.error("ipfsImage data is : ", ipfsImage);
            return;
        }

        console.log("ipfsImage : ", ipfsImage);
        console.log("ipfsImage._ipfs : ", ipfsImage._ipfs)

        content.photoFile = ipfsImage._ipfs;

        const ipfsResult = await ipfsProcessor.saveFile(
            "post.json",
            { base64: btoa(JSON.stringify(content)) },
            { saveIPFS: true}
        )
        console.log(ipfsResult._ipfs)
        return ipfsResult._ipfs;
    }

    const validateForm = () => {
        let result = !title || !content ? false: true;
        return result
    }

   const clearForm = () =>{
        setTitle('');
        setContent('');
    }
    
    function onSubmit(e){
        e.preventDefault();
        if(!validateForm()){
            return message.error("Remember to add the title and the content of your post")
        }
        addPost({title, content, photoFile})
        clearForm();
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
    
    

    return (
        <form onSubmit={onSubmit}>
        <div className ="row">
            <div className="form-group">
                <input
                type="text"
                className="mb-2 mt-2 form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />

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
                            <input ref={filePickerRef} type="file" hidden onChange={addImageToPost}/>
                        </div>
                    </div>
                </div>


                <textarea
                type='text'
                className="mb-2 form-control"
                placeholder="Post away"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-dark ">Submit</button>
        </div>
    </form>
    )
}

export default AddPost
