// Moralis.Cloud.afterSave("Posts", async function(request) {
Moralis.Cloud.define("AddPostsToMultichain", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    logger.info("SEM TU ZAJ1.2"); 


    logger.info("request");
    logger.info(JSON.stringify(request))
    logger.info(JSON.stringify(request.params))
    logger.info(JSON.stringify(request.params.postId))

    const PostsMultichain = Moralis.Object.extend("PostsMultichain");
    logger.info("SEM TU ZAJ2"); 
    const postMultichain = new PostsMultichain();
    logger.info("SEM TU ZAJ3"); 
    postMultichain.set("postId", request.params.postId);
    postMultichain.set("contentId", request.params.contentId);
    postMultichain.set("postOwner", request.params.postOwner);
    postMultichain.set("parentId", request.params.parentId);
    postMultichain.set("categoryId", request.params.categoryId);
    postMultichain.set("updatedAt", request.params.updatedAt);
    postMultichain.set("commentList", request.params.commentList);
    postMultichain.set("chain", "bsc");
    logger.info("SEM TU ZAJ4"); 
    postMultichain.save().then((question) => {
            // Execute any logic that should take place after the object is saved.
            logger.info('New object created with objectId: ' + question.id); 
        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            logger.info('Failed to create new object, with error code: ' + error.message); 
        });
});





Moralis.Cloud.define("AddPostsAVAXToMultichain", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    logger.info("SEM TU ZAJ1.2"); 


    logger.info("request");
    logger.info(JSON.stringify(request))
    logger.info(JSON.stringify(request.params))
    logger.info(JSON.stringify(request.params.postId))

    const PostsMultichain = Moralis.Object.extend("PostsMultichain");
    logger.info("SEM TU ZAJ2"); 
    const postMultichain = new PostsMultichain();
    logger.info("SEM TU ZAJ3"); 
    postMultichain.set("postId", request.params.postId);
    postMultichain.set("contentId", request.params.contentId);
    postMultichain.set("postOwner", request.params.postOwner);
    postMultichain.set("parentId", request.params.parentId);
    postMultichain.set("categoryId", request.params.categoryId);
    postMultichain.set("updatedAt", request.params.updatedAt);
    postMultichain.set("commentList", request.params.commentList);
    postMultichain.set("chain", "avax");
    logger.info("SEM TU ZAJ4"); 
    postMultichain.save().then((question) => {
            // Execute any logic that should take place after the object is saved.
            logger.info('New object created with objectId: ' + question.id); 
        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            logger.info('Failed to create new object, with error code: ' + error.message); 
        });
});
