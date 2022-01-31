import Head from 'next/head'
import { useEffect } from 'react';
import { useMoralisCloudFunction } from 'react-moralis';
import Post from '../components/FeedPosts/components/Post';
import Header from '../components/Header'
import UserExploreCard from '../components/Users/UserExploreCard';

export const explore = () => {

        const { data, error, isLoading } =  useMoralisCloudFunction("GetUsers");

        // async function getOneUserInfo() {
        //     const { data, error, isLoading } = await useMoralisCloudFunction("GetOneUser", {
        //         ethAddress: "0x2d5a827d1e7aff5c83afd6f28574a1f851def097",
        //     });
    
        //     //console.log("datadata : ", data);
    
        //     if(data){
        //         console.log("datadatadata : ", data);
        //     }
        // }
    
        // getOneUserInfo();

        // async function getOneUserInfoExtended() {       // user + his posts
        //     const { data, error, isLoading } = await useMoralisCloudFunction("GetOneUserExtended", {
        //         ethAddress: "0x9f15e4021b1f3e03b45d36a4202f1e0dce02524d",
        //     });
    
        //     //console.log("datadata : ", data);
    
        //     if(data){
        //         console.log("datadatadata : ", data);
        //     }
        // }
    
        // getOneUserInfoExtended();

    // useEffect(() => {
    //     if(data){
    //         console.log("data : ", data);
    //         console.log("data.length : ", data.users.length);
    //     }
    // }, [data])

 //console.log(data)

    return (
        <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
        <Head>
          <title>MyProfile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
  
  
  
        <Header />

            {data && 
                <div>
                    {data.users.map((userCard) => (
                        <UserExploreCard key={userCard["id"]} userCard={userCard} />
                    ))}
                </div>
            }
          
        </div>
    )



}

export default explore;