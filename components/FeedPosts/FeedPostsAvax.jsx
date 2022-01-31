import {useMoralisDapp} from "../../providers/MoralisDappProvider/MoralisDappProvider"
import {useState} from "react"
import Posts from "./components/Posts"
import Reputation from "../Reputation"

import {Avatar, Button }from "antd" 
import glStyles from "../gstyles"
import Blockie from "../Blockie"
import AddPost from "./components/AddPost"
import PostsAvax from "./componentsAvax/PostsAvax"
import AddPostAvax from "./componentsAvax/AddPostAvax"
import ReputationAvax from "../ReputationAvax"

const FeedPostsAvax = () => {
    const {selectedCategory} = useMoralisDapp();
    const [showAddPost, setShowAddPost] = useState(false)

    let result = null;
    
    function toogleShowAddPost(){
        setShowAddPost(!showAddPost);
    }

    if (selectedCategory["category"] === "default") {
        result = (
          <div className="">
            <h3>Choose a Category</h3>
          </div>
        );
      }
    else {
        result = (
        <div className="">
            <div
                style={{
                    ...glStyles.card,
                    padding: "10px 13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Avatar src={<Blockie currentWallet />} />
                <h4> Your Reputation in {selectedCategory["category"]} is 
                <ReputationAvax/>
                 </h4>
                <Button shape="round" onClick={toogleShowAddPost}>
                    Post
                </Button>
            </div>
            {showAddPost ? <AddPostAvax/>:""}
            <PostsAvax/>
        </div>    
        )
    }
    
    return result;
}

export default FeedPostsAvax
