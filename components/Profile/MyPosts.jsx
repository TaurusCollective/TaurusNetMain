import { useState } from "react";
import { useMoralisQuery } from "react-moralis";
import Post from "../FeedPosts/components/Post";

function MyPosts({myPostsList}) {

    let queryPost;
    let myPosts = [];
    let fetchedPost;

    myPostsList.forEach(myPost => {
        queryPost = useMoralisQuery(
            "Posts",
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
                    <Post key={post[0]["postId"]} post={post[0]} />
            ))}
        </div>
    );

    return havePosts ? postResult : emptyResult;
    


}

export default MyPosts
