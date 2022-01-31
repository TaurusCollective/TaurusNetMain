import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis, useMoralisCloudFunction, useMoralisFile, useMoralisQuery, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState, createElement } from "react";
import { Comment, Tooltip, Avatar, message, Divider } from "antd";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Blockie from "../../Blockie";
import glStyles from "../../gstyles";
import Votes from "./Votes"
import { HeartIcon, PaperAirplaneIcon, DotsHorizontalIcon, ChatIcon, BookmarkIcon, EmojiHappyIcon, } from '@heroicons/react/outline'
import {HeartIcon as HeartIconFilled} from '@heroicons/react/solid'
import Comments from "./Comments";

const Post = ({post}) => {



    const { contentId, postId, postOwner,  updatedAt, commentList } = post;
    const [postContent, setPosContent] = useState({ title: "default", content: "default" });
    const { data } = useMoralisQuery("Contents", (query) => query.equalTo("contentId", contentId));
    //const [voteStatus, setVoteStatus] = useState();
    const { data: votes } = useMoralisQuery("Votes", (query) => query.equalTo("postId", postId), [], {
        live: true,
    });

    
    const { walletAddress, contractABI, contractAddress, selectedCategory} = useMoralisDapp();
    const contractABIJson = JSON.parse(contractABI);
    const contractProcessor = useWeb3ExecuteFunction();

    const [postOwnerAvatar, setPostOwnerAvatar] = useState("");
    const [postOwnerUsername, setPostOwnerUsername] = useState("");
    const ipfsProcessor = useMoralisFile();
    const {isAuthenticated} = useMoralis();
    const [comment, setComment] = useState([]); //for posting
    // const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState()

      async function getPostsOwner() {
        const { data, error, isLoading } = await useMoralisCloudFunction("PostOwnerUser", {
          postOwner,
        });

        if(data){
           setPostOwnerUsername(data.username)
           setPostOwnerAvatar(data.avatar)
        }
      }

      getPostsOwner();

 


    useEffect(() => {
        function extractUri(data) {
          const fetchedContent = JSON.parse(JSON.stringify(data, ["contentUri"]));
        
          const contentUri = fetchedContent[0]["contentUri"];
          return contentUri;
        }
        async function fetchIPFSDoc(ipfsHash) {
     
          const url = ipfsHash;
          const response = await fetch(url);
          return await response.json();
        }
        async function processContent() {
          const content = await fetchIPFSDoc(extractUri(data));
          setPosContent(content);
        }
        if (data.length > 0) {
       
          processContent();
        }
      }, [data]);

  
    
    useEffect(() => {
        if (!votes?.length) return null;

        async function getPostVoteStatus() {
            const fetchedVotes = JSON.parse(JSON.stringify(votes));
 
            fetchedVotes.forEach(({ voter, up }) => {
            

              if (voter === walletAddress) setHasLiked(up ? true : false);//setVoteStatus(up ? "liked" : "disliked");
            });
            return;
        }

        getPostVoteStatus();
    }, [votes, walletAddress]);

    




    const sendComment = async (e) => {
  
      e.preventDefault();
  

      const commentToSend = comment;
      setComment('');

 
      
      addPostComment(commentToSend);
    }

    const processCommentContent = async (content) => {
      const ipfsResult = await ipfsProcessor.saveFile(
          "post.json",
         // { base64: btoa(JSON.stringify(content)) },
         { base64: btoa(unescape(encodeURIComponent(JSON.stringify(content)))) },
          { saveIPFS: true}
      )
  
      return ipfsResult._ipfs;
    }

        
    async function addPostComment(post) {
      const contentUri = await processCommentContent(post); 
      const categoryId = selectedCategory["categoryId"];
    
      

      const options = {
          contractAddress: contractAddress,
          functionName: "createComment",
          abi: contractABIJson,
          params: {
              _parentId: postId,
              _contentUri: contentUri,
              _categoryId: categoryId
          },
          }
      await contractProcessor.fetch({params:options,
          onSuccess: () => message.success("success"),
          // onError: (error) => message.error(error),
          onError: (error) => console.log(error),
      });
  }


    
  

    async function vote(direction){
      if (walletAddress.toLowerCase() === postOwner.toLowerCase()){
        setHasLiked(false);
        return message.error("You cannot vote on your posts");
      }
      //if (hasLiked) return message.error("Already voted");
      const options = {
          contractAddress: contractAddress,
          functionName: direction,
          abi: contractABIJson,
          params: {
            _postId: post["postId"],
            [direction === "voteDown" ? "_reputationTaken" : "_reputationAdded"]: 1,
          },
        };
        await contractProcessor.fetch({
          params: options,
          onSuccess: () => console.log("success"),
          onError: (error) => console.error(error),
        });
  }



    const likePost = async () => {
      if(hasLiked){
          setHasLiked(false);
          vote("voteDown");
          
      }else{

          setHasLiked(true);
          vote("voteUp");
      }
  }

    const loading = "";
    let result
    
    result = (



      <div className="bg-white my-7 border rounded-sm">
            {/* Header */}
            <div className="flex item-center paddingHeader items-center">
                {postOwnerAvatar ? (
                  <img src={postOwnerAvatar} className="rounded-full h-12 w-12 object-contain border p-1 mr-3" alt="profile image" />
                ) : ( 
                  <Avatar className="mr-3" src={<Blockie address={post["postOwner"]} scale={4} />}></Avatar>
                )}
                <p className="flex-1 font-bold">@{postOwnerUsername}</p>
                {/* <DotsHorizontalIcon className="h-5" /> */}
                <img src="/images/BscLogo.png" alt="" className="w-5 h-5"/>
            </div>

            {/* img */}
            {postContent["photoFile"] &&
              <img src={postContent["photoFile"]} className="postImage" alt="photoFile" />
            }
            {/* INSTAGRAM: Slika ma vedno wixen height. pri nalaganju ti da možnost al je cropano in je height pravilen, če pa hočeš celo not dobit pa ji spodaj in zgoraj doda rob da height ostane isti */}
            {/* TWITTER: Pri prikazovanju ima lockano širino glede na velikost ekrana, višine pa so različne, sicer je vrjetno neki max-height */}
            {/* <img src={postContent["photoFile"]} className="object-cover w-full" alt="post image" /> */}

            {/* Buttons */}
            {isAuthenticated && (
                <div className="flex justify-between paddingButtonsPost">
                    <div className="flex space-x-4">
                        {hasLiked ? (
                            <HeartIconFilled onClick={likePost} className="btn postButtons text-red-500"/>
                        ) : (
                            <HeartIcon onClick={likePost} className="btn postButtons"/>
                        )}
                        <Votes postId={postId}/> 
                        <ChatIcon className="btn postButtons"/>
                        <PaperAirplaneIcon className="btn postButtons"/>
                    </div>
                    <BookmarkIcon className="btn postButtons" />
                </div>
            )}


            {/* Caption */}
            <div className="paddingComments truncate">
                {/* {likes.length > 0 && (
                     <p className="font-bold mb-1">{likes.length} likes</p>
                )} */}

                <span className="font-bold mr-1">@{postOwnerUsername} </span>
                <p style={{ fontSize: "15px", color: "#111" }}>{postContent["content"]}</p>
            
                </div>
            {/* Comments */}
            {/* {commentList && ( 
               <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                   <Comments comments={lol}/>
               </div>
            )} */}
            {commentList && ( 
              <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
              {commentList.map((commentLink, index) =>{
                // return   <Comments key={commentLink} commentLink={commentLink}/>
                 return   <Comments key={index} commentLink={commentLink}/>
              })}
              </div>
            )}
              {/* {commentList && ( 
               <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                   <Comments comments={lol}/>
               </div>
            )} */}
            {/* {postComments.length > 0 && ( 
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                    {postComments.map(comment =>(
                        <div key={comment.postId} className="flex items-center space-x-2 mb-3">
                            {commentsOwnersAvatars ? (
                            <img className="h-7 rounded-full" src={commentsOwnersAvatars} alt="" />
                         ) : ( 
                        <Avatar className="mr-3" src={<Blockie address={comment["postOwner"]} scale={4} />}></Avatar>
                         )}
                            <p className="text-sm flex-1">
                                <span className="font-bold">
                                    @{postCommentsUsernames}
                                </span>{" "}
                                {postContentComment}
                            </p>

                            <Moment fromNow className="pr-5 text-xs">
                            {comment.updatedAt}
                            </Moment>
                        </div>
                    ))}
                </div>
            )} */}

            {/* Input box */}
            {isAuthenticated && (
                <form className="flex items-center paddingInputComment">
                    <EmojiHappyIcon className="h-7"/>
                    <input value={comment} onChange={e => setComment(e.target.value)} type="text" placeholder="Add a comment..." className="border-none flex-1 focus:ring-0 outline-none"/>
                    <button type='submit' disabled={!comment} onClick={sendComment} className="font-semibold text-blue-400">Post</button> 
                </form>
            )}

      </div>
     )
    //               }
    //               else{
    //                 result = (
    //                     <div key={post["postId"]} className="flex items-center space-x-2 mb-3">
    //                         {postOwnerAvatar ? (
    //                           <img className="h-7 rounded-full" src={postOwnerAvatar} alt="" />
    //                         ) : ( 
    //                           <Avatar className="mr-3" src={<Blockie address={post["postOwner"]} scale={4} />}></Avatar>
    //                         )}
    //                         <p className="text-sm flex-1">
    //                             <span className="font-bold">
    //                               @{postOwnerUsername}
    //                             </span>{" "}
    //                             {postContent}
    //                         </p>

    //                         <Moment fromNow className="pr-5 text-xs">
    //                             {updatedAt.timestamp?.toDate()}
    //                         </Moment>
    //                     </div>
    //                   );
    //               }
    
    
    return postContent["title"] === "default" ? loading : result;
}

export default Post

