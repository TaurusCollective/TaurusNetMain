import React from 'react';
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralisQuery } from "react-moralis"
import PostAvax from '../../FeedPosts/componentsAvax/PostAvax';
import Post from '../../FeedPosts/components/Post';

function PostsMultichain() {
    const { selectedCategory } = useMoralisDapp();
    
    const queryPost = useMoralisQuery(
        "PostsMultichain",
        // (query) => query.equalTo("categoryId", selectedCategory["categoryId"]),
        // [selectedCategory],
        // { live: true }
      );

    const fetchedPosts = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList", "chain"])).reverse();
   

    const havePosts = fetchedPosts.length > 0 ? true : false;

    const emptyResult = (
        <div className="noPostsBeFirstDiv">
            <h3>Be the first to post here for</h3>
            <h3>{selectedCategory["category"]} </h3>
        </div>
    );

    const postResult = (<div>
        
            {fetchedPosts.map((post) => (
               
                post.chain == "avax"
                ?   (<PostAvax key={post["postId"]} post={post} />)
                :   (<Post key={post["postId"]} post={post} />)
            
                // <Post key={post["postId"]} post={post} />
            ))}
        </div>
    );

    return havePosts ? postResult : emptyResult;
}

export default PostsMultichain;
