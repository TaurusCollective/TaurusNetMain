import Head from 'next/head'
import { useEffect } from 'react';
import { useMoralisCloudFunction } from 'react-moralis';
import Post from '../components/FeedPosts/components/Post';
import Header from '../components/Header'
import UserExploreCard from '../components/Users/UserExploreCard';

export const explore = () => {

    const { data, error, isLoading } =  useMoralisCloudFunction("GetUsers");


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