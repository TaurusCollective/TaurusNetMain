import { useState } from "react";
import { useMoralisQuery } from "react-moralis";
import PostAvax from "../FeedPosts/componentsAvax/PostAvax";

function MyPostsAvax({myPostsList}) {

    let queryPost;
    let myPosts = [];
    let fetchedPost;

    
    myPostsList.forEach(myPost => {
        queryPost = useMoralisQuery(
            "PostsAVAX",
            (query) => query.equalTo("postId", myPost)
        );

        fetchedPost = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList"])).reverse();

        if(fetchedPost && fetchedPost.length > 0){
            myPosts.push(fetchedPost);
        }
        
    });

    const havePosts = myPosts.length > 0 ? true : false;


    
    const emptyResult = (
        <div>
            <h3>You dont have any posts 😲</h3>
        </div>
    );

    const postResult = (<div>
            {myPosts.map((post) => (
                    <PostAvax key={post[0]["postId"]} post={post[0]} />
            ))}
        </div>
    );

    return havePosts ? postResult : emptyResult;
    

}

export default MyPostsAvax
