import { useState } from "react";
import { useMoralisQuery } from "react-moralis";
import Post from "../FeedPosts/components/Post";

function MyPosts({myPostsList}) {

    let queryPost;
    let myPosts = [];
    let fetchedPost;

    //console.log("myPostsList : ", myPostsList);
    
    myPostsList.forEach(myPost => {
        //console.log("myPost2 : ", myPost);
        queryPost = useMoralisQuery(
            "Posts",
            (query) => query.equalTo("postId", myPost)
        );

        //console.log("queryPost : ", queryPost.data);
        fetchedPost = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList"])).reverse();
        //console.log("fetchedPost: ",fetchedPost);
        if(fetchedPost && fetchedPost.length > 0){
            myPosts.push(fetchedPost);
        }
        
    });

    //console.log("myPosts0: ", myPosts);
    const havePosts = myPosts.length > 0 ? true : false;
    //console.log("havePosts : ", havePosts);

    //console.log("myPosts: ", myPosts);

    
    const emptyResult = (
        <div>
            <h3>You dont have any posts 😲</h3>
        </div>
    );

    const postResult = (<div>
            {myPosts.map((post) => (
                    <Post key={post[0]["postId"]} post={post[0]} />
            ))}
        </div>
    );

    return havePosts ? postResult : emptyResult;
    




    // const queryPost = useMoralisQuery(
    //     "Posts"
    // );

    // const fetchedPosts = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList"])).reverse();
    // //console.log("fetchedPosts: ",fetchedPosts);
    // const havePosts = fetchedPosts.length > 0 ? true : false;

    // const emptyResult = (
    //     <div>
    //         <h3>You dont have any posts 😲</h3>
    //     </div>
    // );

    // const postResult = (<div>
    //         {fetchedPosts.map((post) => (
    //             // <Post key={post["postId"]} post={post} />
    //             <div></div>
    //         ))}
    //     </div>
    // );

    // return havePosts ? postResult : emptyResult;







   
    // const queryPost = useMoralisQuery(
    //     "Posts"
    // );

    // const fetchedPosts = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList"])).reverse();
    // //console.log("fetchedPosts: ",fetchedPosts);
    // const havePosts = fetchedPosts.length > 0 ? true : false;

    // const emptyResult = (
    //     <div>
    //         <h3>You dont have any posts 😲</h3>
    //     </div>
    // );

    // const postResult = (<div>
    //         {fetchedPosts.map((post) => (
    //             // <Post key={post["postId"]} post={post} />
    //             <div></div>
    //         ))}
    //     </div>
    // );

    // return havePosts ? postResult : emptyResult;
}

export default MyPosts
