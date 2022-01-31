import faker from 'faker';
import { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import Story from './Components/Story';

function Stories() {
    const [suggestions, setSuggestions] = useState([])
    const { authenticate, isAuthenticated, logout, user} = useMoralis();

   
    const queryPost = useMoralisQuery(
        "Stories"
    );
    
    const fetchedStories = JSON.parse(JSON.stringify(queryPost.data, ["objectId", "storyImg", "user"])).reverse();

    //console.log("fetchedStories : ", fetchedStories)

    const havePosts = fetchedStories.length > 0 ? true : false;


    const avatar = user?.get('avatar'); 

    useEffect(() => {
        const suggestions = [...Array(20)].map((_, i) => ({
            ...faker.helpers.contextualCard(),
            id: i,
        }));

        setSuggestions(suggestions);

    }, [])      //if array ampti UseEffect only runs once on Component mount, if it has a variable in it runs whenever that variable changes as well



    return (
        <div className="flex space-x-2 p-6 bg-white mt-8 border border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">

            {user && avatar && (
                <Story
                    profileImg={user.attributes.avatar} 
                    username={user.attributes.username} 
                    img={user.attributes.avatar}
                />
            )}

{/* 
            {user && (
                <Story
                    profileImg={"trololol"} 
                    username={user.attributes.username}
                    img={user.attributes.avatar}
                />
            )} */}

            {/* {suggestions.map(profile =>(
                <Story 
                    key={profile.id} 
                    profileImg={null} 
                    username={profile.username} 
                    img={null}
                    // img={user.attributes.avatar}
                />
            ))} */}
            {fetchedStories.map(story =>(
                <Story 
                    key={story.objectId} 
                    profileImg={null} 
                    // username={story.username} 
                    img={story.storyImg}
                    userAddres={story.user}
                    // img={user.attributes.avatar}
                />
            ))}

        </div>
    )
}

export default Stories
