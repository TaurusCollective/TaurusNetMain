import { Button } from 'antd';
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import { useMoralis, useMoralisCloudFunction, useMoralisQuery } from 'react-moralis';
import Header from '../../components/Header'
import FollowUser from '../../components/Profile/FollowUser';
import MyPosts from '../../components/Profile/MyPosts';
import MyPostsAvax from '../../components/Profile/MyPostsAvax';
import { useMoralisDapp } from '../../providers/MoralisDappProvider/MoralisDappProvider';


const userProfile = ({ethAddress}) => {
    const [userProfileData, setUserProfileData] = useState();
    const { authenticate, isAuthenticated, logout, user} = useMoralis();
    const [isSending, setIsSending] = useState(false)
    const [followUserState, setFollowUserState] = useState(false)
    const [isFollowing, setIsFollowing] = useState(0);
    const [userPostsList, setUserPostsList] = useState([]);
    const [followersAmmount, setFollowersAmmount] = useState(0);
    const [userBio, setUserBio] = useState("");

    const {chainId} = useMoralisDapp();

    const [isAvax, setIsAvax] = useState(true);
    useEffect(() => {
        if(chainId == 0xa869){ // Avalanche testnet
            setIsAvax(true);
        }else if(chainId == 0x61){      // BSC testnet
            setIsAvax(false)
        }
    }, [chainId]);

    async function getOneUserInfoExtended() {
        const { data, error, isLoading } = await useMoralisCloudFunction("GetOneUserExtended", {
            ethAddress: ethAddress,
        });
        if(data){
            setUserProfileData(data[0]);
            setUserBio(userProfileData?.userBio)
        }
    }
    getOneUserInfoExtended();

    async function GetIsFollowingUser() {
        const { data: data2, error, isLoading } = await useMoralisCloudFunction("GetIsFollowingUser", {
            meEthAddress: user?.attributes.ethAddress,//'0x9f15e4021b1f3e03b45d36a4202f1e0dce02524d',
            userEthAddress: userProfileData?.ethAddress//'0x2d5a827d1e7aff5c83afd6f28574a1f851def097'
            
        });
        if(data2){
            setIsFollowing(data2.doesItAlreadyExist);
            //setUserProfileData(data2);
        }
    }
    GetIsFollowingUser();

    useEffect(() => {
        if(userProfileData){
            setFollowersAmmount(userProfileData.Followers?.length);
            const postsList = userProfileData.postList;
            setUserPostsList(postsList)
        }
    }, [userProfileData])

    //

   

    useEffect(() => {
        if(followUserState){
            if(isFollowing){
            // isFollowing = false;
            //   setTimeout(function() {
                   setIsFollowing(false);
            //   }, 6000);
                setFollowersAmmount(userProfileData?.Followers?.length - 1);
                //followersAmmount =- 1;
            }else{
                //isFollowing = true;
             //  setTimeout(function() {
                   setIsFollowing(true);
            //   }, 6000);
                setFollowersAmmount(userProfileData?.Followers?.length + 1);
                //followersAmmount =+ 1;
            }
        }
    }, [followUserState])

 

    return (
        <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
            <Head>
            <title>MyProfile</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <Header />

            <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:mx-w-6xl mx-auto">
            
            <section className="col-span-3">

            {userProfileData && (
                <div>
                    <div className="bg-white my-7 border  p-5 rounded roundedBorder">
                    <div className='profileImageDiv'>
                        <img src={userProfileData.avatar} className="rounded-full h-20 w-20 object-contain border p-1 mr-3 profilePageProfileImage" alt="" />
                    </div>
                       
                    <div className='basicUserInfoDiv'>
                        <p className='userName'><b>@{userProfileData.username} </b></p>
                        <p className='userEmail'>{userProfileData.email} </p>
                        {isFollowing ? (
                            <div className='followUnfollowButton'>
                            {/* <div>here {isFollowing}</div> */}
                                <Button onClick={() => setFollowUserState(true)}>Unfollow</Button>
                            </div>
                            )
                            :
                            (
                            <div className='followUnfollowButton'>
                                {/* <div>here {isFollowing}</div> */}
                                <Button onClick={() => setFollowUserState(true)}>Follow</Button>
                            </div>
                            )
                        }
                        <p className='followersAmount'>Followers Amount: {followersAmmount}</p>
                    </div>
                    <p className='userBioP'>{userBio} </p>
                    {userBio &&
                    <p className='userBioP'>{userProfileData.myBio} </p>
                    }
            
                       
                       
                       
                       
                       
                       
                      </div>
                    {/* {
                        userProfileData.userPosts.map((item, index) => (
                            <div key={index + item.postId}>{item.contentId}</div>
                        ))
                    } */}

                    {/* His Posts: */}
                    {userPostsList &&
                        isAvax ? (
                            <MyPostsAvax myPostsList={userPostsList}/>
                          ) : (
                            <MyPosts myPostsList={userPostsList}/>
                          )
                    }


                    {/* {followUserState && (
                        <FollowUser ethAddress={ethAddress} value={value} onChange={handleChange}/>
                    )} */}
                    {followUserState && (
                        <FollowUser ethAddress={ethAddress}/>
                    )}
                    

                </div>
            )}
               </section>

</main>

        </div>
        
    )
}

export async function getServerSideProps({ params }) {
    return {
        props: { ethAddress: params.ethAddress }
    }
}

export default userProfile
