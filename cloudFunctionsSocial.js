Moralis.Cloud.define("PostOwnerUser", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("ethAddress", request.params.postOwner);
  const results = await query.find({ useMasterKey: true });
  
  const logger = Moralis.Cloud.getLogger();
  logger.info("results[0]"); 
  logger.info(results[0]); 
  
  const returnObj = {
  	username : results[0].attributes.username,
    avatar : results[0].attributes.avatar
  }
  
  return returnObj;
});

Moralis.Cloud.define("StoryOwnerUser", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("ethAddress", request.params.userAddres);
  const results = await query.find({ useMasterKey: true });
  
  const returnObj = {
  	username : results[0].attributes.username,
    avatar : results[0].attributes.avatar
  }
  
  return returnObj;
});



Moralis.Cloud.afterSave("Comments", async (request) => {
  const confirmed = request.object.get("confirmed");
  if(confirmed){
      const logger = Moralis.Cloud.getLogger();
    logger.info("Hello World");
    logger.info(request.object.get("parentId")); 

    const query = new Moralis.Query("Posts");
    query.equalTo("postId", request.object.get("parentId"));
    const results = await query.find();
    logger.info("results");
    logger.info(results);
    for (let i = 0; i < results.length; i++) {
      logger.info("LOOL1"); 
      const object = results[i];
      logger.info(object);

      object.add('commentList', request.object.get("postId"));
      await object.save();

      return object;

    }
  }
});


Moralis.Cloud.afterSave("Posts", async (request) => {     
  const confirmed = request.object.get("confirmed");
  if(confirmed){
    const logger = Moralis.Cloud.getLogger();
    logger.info("Hello World2"); 

    const query = new Moralis.Query("User");
    logger.info(request.object.get("postOwner"));
    logger.info(JSON.stringify(request.object.get("postOwner")))
    logger.info(request.object.get("postOwner"))
    logger.info(request.object.get("postId"))
    query.equalTo("ethAddress", request.object.get("postOwner"));
    const results = await query.find({ useMasterKey: true });

    const object = results[0];

    logger.info('postListpostList');
    logger.info(object.get('postList'));
    const existingList = object.get('postList')
    
    let doesItAlreadyExist = false;

    if(existingList){
      for (let i = 0; i < existingList.length; i++) {
        logger.info(existingList[i]);
        if(existingList[i] == request.object.get("postId")){
          doesItAlreadyExist = true;
        }
      }
    }

    if(!doesItAlreadyExist){
      object.add('postList', request.object.get("postId"));
      await object.save(null, { useMasterKey: true });
    }

    logger.info('request.object.get("postId")');
    logger.info(request.object.get("postId"))

    const params =  { postId: request.object.get("postId"),
      contentId: request.object.get("contentId"),
      postOwner: request.object.get("postOwner"),
      parentId: request.object.get("parentId"),
      categoryId: request.object.get("categoryId"),
      updatedAt: request.object.get("updatedAt"),
      commentList: request.object.get("commentList"),
      chain: "bsc",
    };

    logger.info('params');
    logger.info(params)
    logger.info(JSON.stringify(params))

    await Moralis.Cloud.run("AddPostsToMultichain", params);
    
  }
});



Moralis.Cloud.afterSave("UserOnChain", async (request) => {     
  const confirmed = request.object.get("confirmed");
  if(confirmed){
    const logger = Moralis.Cloud.getLogger();
    logger.info("Hello World2"); 

    const query = new Moralis.Query("User");
    query.equalTo("ethAddress", request.object.get("ethAddress"));
    const results = await query.find({ useMasterKey: true });

    const object = results[0];

    logger.info('userId: : ');
    logger.info(request.object.get("userId"));
    const existingLink = object.get('UserOnChainUserId')

    if(!existingLink){
      object.add('UserOnChainUserId', request.object.get("userId"));
      await object.save(null, { useMasterKey: true });
    }
    
  }
});

Moralis.Cloud.define("GetUsers", async (request) => {
  const query = new Moralis.Query("User");
  const results = await query.find({ useMasterKey: true });
  
  const logger = Moralis.Cloud.getLogger();
  logger.info("results"); 
  logger.info(results); 
  
  const returnObj = {
  	users : results
  }
  
  return returnObj;
});

Moralis.Cloud.define("GetOneUser", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("ethAddress", request.params.ethAddress);

  const logger = Moralis.Cloud.getLogger();
  logger.info("request.params.ethAddress"); 
  logger.info(request.params.ethAddress); 

  const results = await query.find({ useMasterKey: true });
  

  
  const returnObj = {
  	username : results[0].attributes.username,
    avatar : results[0].attributes.avatar
  }
  
  return returnObj;
});






Moralis.Cloud.define("GetOneUserExtended", async (request) => {
  const query = new Moralis.Query("User");
  const pipeline = [
    {match: { ethAddress:  request.params.ethAddress}}, //filter only from this user
    // join to Token collection on token_address
    {lookup: {
      from: "Posts",
      localField: "ethAddress",
      foreignField: "postOwner",
      as: "userPosts"
    }}
  
  ];

  return await query.aggregate(pipeline);
});


Moralis.Cloud.define("SetFollowUser", async (request) => {
  const queryMe = new Moralis.Query("User");
  queryMe.equalTo("ethAddress", request.params.meEthAddress);
  const results = await queryMe.find({ useMasterKey: true });
  const object = results[0];


  const existingList = object.get('Following')
    
  let doesItAlreadyExist = false;

  if(existingList){
    for (let i = 0; i < existingList.length; i++) {
      logger.info(existingList[i]);
      if(existingList[i] == request.params.ethAddress){
        doesItAlreadyExist = true;
      }
    }
  }

  if(!doesItAlreadyExist){
    object.add('Following', request.params.ethAddress);
    await object.save(null, { useMasterKey: true });
  }else{
    object.remove('Following', request.params.ethAddress);
    await object.save(null, { useMasterKey: true });
  }
});

Moralis.Cloud.define("SetFollowingUser", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("ethAddress", request.params.ethAddress);
  const results = await query.find({ useMasterKey: true });
  const object = results[0];

  const existingList = object.get('Followers')
    
  let doesItAlreadyExist = false;

  if(existingList){
    for (let i = 0; i < existingList.length; i++) {
      logger.info(existingList[i]);
      if(existingList[i] == request.params.meEthAddress){
        doesItAlreadyExist = true;
      }
    }
  }

  if(!doesItAlreadyExist){
    object.add('Followers', request.params.meEthAddress);
    await object.save(null, { useMasterKey: true });

    const params =  { meEthAddress: request.params.meEthAddress,
                      ethAddress: request.params.ethAddress
                    };
    await Moralis.Cloud.run("SetFollowUser", params);
  }else{
    object.remove('Followers', request.params.meEthAddress);
    await object.save(null, { useMasterKey: true });

    const params =  { meEthAddress: request.params.meEthAddress,
      ethAddress: request.params.ethAddress
    };
    await Moralis.Cloud.run("SetFollowUser", params);
  }
});


Moralis.Cloud.define("GetIsFollowingUser", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("ethAddress", request.params.meEthAddress);
  const results = await query.find({ useMasterKey: true });
  const object = results[0];

  const existingList = object.get('Following')
    
  let doesItAlreadyExist = false;

  if(existingList){
    for (let i = 0; i < existingList.length; i++) {
      logger.info(existingList[i]);
      if(existingList[i] == request.params.userEthAddress){
        doesItAlreadyExist = true;
      }
    }
  }

  const returnObj = {
  	doesItAlreadyExist : doesItAlreadyExist
  }
  
  return returnObj;
});

