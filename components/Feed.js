import MiniProfile from "./MiniProfile"
import Posts from "./Posts"
// import Stories from "./Stories"
import Suggestions from "./Suggestions"
import Categories from "./Categories"
import FeedPosts from "./FeedPosts"
import { useMoralisQuery } from "react-moralis"
import Stories from "./StoriePosts"
import {useMoralisDapp} from "../providers/MoralisDappProvider/MoralisDappProvider"
import PostsMultichain from "./Multichain/components/PostsMultichain"
import { useEffect, useState } from "react"
import {Menu } from "antd"
import glStyles from "./gstyles" 
// import { useMoralisDapp } from '../providers/MoralisDappProvider/MoralisDappProvider';
// import { useEffect, useState } from "react"

function Feed() {
    // const {chainId} = useMoralisDapp();
    //let queryCategories
    //let fetchedCategories
    //const [queryCategories, setQueryCategories] = useState([]);
    // const [fetchedCategories, setFetchedCategories] = useState([]);
    // useEffect(() => {
    //     if(chainId == 0xa869){ // Avalanche testnet
    //       
    //         const queryCategories = useMoralisQuery("CategoriesAVAX");
    //         fetchedCategories = JSON.parse(JSON.stringify(queryCategories.data, ["categoryId", "category"]));
    //     }else if(chainId == 0x61){      // BSC testnet
    //       
    //         const queryCategories = useMoralisQuery("Categories");
    //         fetchedCategories = JSON.parse(JSON.stringify(queryCategories.data, ["categoryId", "category"]));
    //     }
    // }, [chainId]);
    

    const queryCategories = useMoralisQuery("Categories");
    const fetchedCategories = JSON.parse(JSON.stringify(queryCategories.data, ["categoryId", "category"]));
    
    const { selectedCategory } = useMoralisDapp();
    const [isCategorySelected, setIsCategorySelected] = useState(false);

    
    useEffect(() => {
        if(selectedCategory.category == "default"){
            setIsCategorySelected(false);
        }else{
            setIsCategorySelected(true);
        }
    }, [selectedCategory]);

    return (
        // <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:mx-w-6xl mx-auto">
        //     <section className="col-span-2">

        //         <Stories />
        //         <Posts />
        //     </section>

        //     <section className="hidden xl:inline-grid md:col-span-1">
        //         <div className="fixed top-20">
        //             <MiniProfile />
        //             <Suggestions />
        //         </div>
        //     </section>
        // </main>





        <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:mx-w-6xl mx-auto">
            
        <section className="col-span-2">

        <Stories />
            {isCategorySelected ? (
                    <FeedPosts/>  
                ) : (
                    <PostsMultichain />
                ) 
            }

        </section>

        <section className="hidden xl:inline-grid md:col-span-1">
            <div className="fixed top-20">
            <div  className="categoriesSidebar">
            
                <Menu 
                onClick={(e) => setIsCategorySelected(false)}>
                    <Menu.Item >
                        TAURUSnet
                    </Menu.Item>
                </Menu>
            </div>

                <Categories categories={fetchedCategories}/>
                {/* <MiniProfile /> */}
                {/* <Suggestions /> */}
            </div>

        </section>



    </main>
    )
}

export default Feed
