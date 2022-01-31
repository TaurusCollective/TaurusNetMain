import { useMoralisQuery } from "react-moralis";
import Comment from "./Comment";

function Comments({commentLink}) {

    let lol = [];
    if(commentLink){
        const { data: commentDataI } = useMoralisQuery("Comments", (query) => query.equalTo("postId", commentLink));
    
        if(commentDataI[0]){
          lol.push(commentDataI[0].attributes);
        }
    }


    return (

        <div>
            {commentDataI[0] &&
                 <Comment key={commentDataI[0].postId} comment={commentDataI[0]}/>

            }
        
        </div>
    )
}

export default Comments


















