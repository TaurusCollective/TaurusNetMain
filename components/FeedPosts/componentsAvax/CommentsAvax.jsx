import { useMoralisQuery } from "react-moralis";
import CommentAvax from "./CommentAvax";
import Comment from "./CommentAvax";

function CommentsAvax({commentLink}) {
  
    let lol = [];
    if(commentLink){
        const { data: commentDataI } = useMoralisQuery("CommentsAVAX", (query) => query.equalTo("postId", commentLink));

        if(commentDataI[0]){
          lol.push(commentDataI[0].attributes);
        }
    }


    return (
  
        <div>
            {commentDataI[0] &&
                 <CommentAvax key={commentDataI[0].postId} comment={commentDataI[0]}/>

            }
        
        </div>
    )
}

export default CommentsAvax




