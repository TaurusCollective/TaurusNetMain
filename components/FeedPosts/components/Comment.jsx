import { useEffect, useState } from "react";
import { useMoralisCloudFunction, useMoralisQuery } from "react-moralis";
import { Avatar } from "antd";
import Blockie from "../../Blockie";
import Moment from 'react-moment';

function Comment({comment}) {

  

    const { data: ContetntDataURIComment } = useMoralisQuery("Contents", (query) => query.equalTo("contentId", comment.attributes.contentId));
    const [commentContent, setCommentContent] = useState();

    const [commentOwnerUsername, setCommentOwnerUsername] = useState("");
    const [commentOwnerAvatar, setCommentOwnerAvatar] = useState("");
    const postOwner = comment.attributes.postOwner;
    const postUpdatedAt = comment.attributes.updatedAt;


    async function getCommentOwner() {
        const { data, error, isLoading } = await useMoralisCloudFunction("PostOwnerUser", {
            postOwner,
        });


        if(data){
            setCommentOwnerUsername(data.username)
            setCommentOwnerAvatar(data.avatar)
        }
    }

      getCommentOwner();



    useEffect(() => {
        function extractUri(ContetntDataURIComment) {
          const fetchedContent = JSON.parse(JSON.stringify(ContetntDataURIComment, ["contentUri"]));
          const contentUri = fetchedContent[0]["contentUri"];
          return contentUri;
        }
        async function fetchIPFSDoc(ipfsHash) {
          const url = ipfsHash;
          const response = await fetch(url);
          return await response.json();
        }
        async function processContent() {
          const content = await fetchIPFSDoc(extractUri(ContetntDataURIComment));
          setCommentContent(content);
        }
        if (ContetntDataURIComment.length > 0) {
          processContent();
        }
      }, [ContetntDataURIComment]);


    return (
        <div>
        {commentContent && (
            <div> 
                <div className="flex items-center space-x-2 mb-3">
                    {commentOwnerAvatar ? (
                      <img className="h-7 rounded-full" src={commentOwnerAvatar} alt="" />
                    ) : ( 
                      <Avatar className="mr-3 rounded-full" style={{overflow: "hidden"}} shape="circle" src={<Blockie address={postOwner} scale={4} />}></Avatar>
                    )}
                    <p className="text-sm flex-1">
                        <span className="font-bold">
                          @{commentOwnerUsername}
                        </span>{" "}
                        {commentContent}
                    </p>
                    <Moment fromNow className="pr-5 text-xs">
                        {postUpdatedAt}
                    </Moment>
                </div>
            </div>
        )}
        </div>
    )
}

export default Comment
