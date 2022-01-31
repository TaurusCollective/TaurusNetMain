import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralisQuery } from "react-moralis";
import Post from "./PostAvax"
import PostAvax from "./PostAvax";

const PostsAvax = () => {
    const { selectedCategory } = useMoralisDapp();
    
    const queryPost = useMoralisQuery(
        "PostsAVAX",
        (query) => query.equalTo("categoryId", selectedCategory["categoryId"]),
        [selectedCategory],
        { live: true }
      );

    const fetchedPosts = JSON.parse(JSON.stringify(queryPost.data, ["postId", "contentId", "postOwner", "parentId", "updatedAt", "commentList"])).reverse();
    //console.log("fetchedPosts: ",fetchedPosts);
    const havePosts = fetchedPosts.length > 0 ? true : false;

    const emptyResult = (
        <div className="noPostsBeFirstDiv">
            <h3>Be the first to post here for</h3>
            <h3>{selectedCategory["category"]} </h3>
        </div>
    );

    const postResult = (<div>
            {fetchedPosts.map((post) => (
                <PostAvax key={post["postId"]} post={post} />
            ))}
        </div>
    );

    return havePosts ? postResult : emptyResult;
}

export default PostsAvax
