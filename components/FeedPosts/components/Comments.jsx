import { useMoralisQuery } from "react-moralis";
import Comment from "./Comment";

function Comments({commentLink}) {
    //console.log("TUUUUTUUUU : ", commentLink)
    //console.log("TUUUUTUUUU222 : ", typeof(commentLink))

    // commentLink.forEach(comment => {
    //     console.log("comment :: ", comment.contentId)
    // });
    let lol = [];
    if(commentLink){
        const { data: commentDataI } = useMoralisQuery("Comments", (query) => query.equalTo("postId", commentLink));
        //console.log("commentTemp: ",commentDataI[0].attributes.contentId);
         //console.log("commentDataI : ", commentDataI)
        if(commentDataI[0]){
          lol.push(commentDataI[0].attributes);
        }
    }


    return (
        // <div>
        //     {comments.length > 0 && (
        //         <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
        //             Here are 
              
        //             {comments.map((comment, index) =>{
        //                 <p>sm not
        //                 <Comment key={comment.postId} />
        //                 </p>
        //             })} 

        //         </div>
        //     )}
        // </div>
        <div>
            {commentDataI[0] &&
                 <Comment key={commentDataI[0].postId} comment={commentDataI[0]}/>

            }
        
        </div>
    )
}

export default Comments



















// import { useMoralisQuery } from "react-moralis";
// import Comment from "./Comment";

// function Comments({comments}) {
//     console.log("TUUUUTUUUU : ", comments)
//     console.log("TUUUUTUUUU222 : ", typeof(comments))

//     comments.forEach(comment => {
//         console.log("comment :: ", comment.contentId)
//     });

//     // let lol2 = [];
//     // comments.forEach((comment) => {
//     //         if(comment){
//     //             console.log("ELEMENT: ",comment);
//     //             console.log("ELEMENT.contentId: ",comment.contentId);
//     //             // const { data: ContetntDataURIComment } = useMoralisQuery("Contents", (query) => query.equalTo("contentId", element[0].attributes.contentId));

//     //             const { data: ContetntDataURIComment } = useMoralisQuery("Contents", (query) => query.equalTo("contentId", comment.contentId));
//     //             //console.log("11111dataComment: ",ContetntDataURIComment);
//     //             lol2.push(ContetntDataURIComment);
//     //         }
//     // });
      
//     // console.log("LOOOOOOLLLL2 : ", lol2);


//     return (
//         // <div>
//         //     {comments.length > 0 && (
//         //         <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
//         //             Here are 
              
//         //             {comments.map((comment, index) =>{
//         //                 <p>sm not
//         //                 <Comment key={comment.postId} />
//         //                 </p>
//         //             })} 

//         //         </div>
//         //     )}
//         // </div>
//         <div>
//         {comments.map((comment, index) =>{
//           return   (<p>{index} <Comment key={comment.postId} comment={comment}/></p> );

//         })}
//         </div>
//     )
// }

// export default Comments
