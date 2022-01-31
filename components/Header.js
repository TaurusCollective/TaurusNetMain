import Image from "next/image"
import {
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    MenuIcon,
    CogIcon,
    ShoppingCartIcon
} from '@heroicons/react/outline'

import {HomeIcon, UserIcon} from '@heroicons/react/solid'
import Account from "./Account"
import Chains from "./Chains";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";

function Header() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('')
    const [predictions, setPredictions] = useState([])

    const { data, error, isLoading } =  useMoralisCloudFunction("GetUsers");
    // if(data){
    //     console.log("TUU : ", data.users);
    // }
    
    const getRecommended = async (value) => {
        return data.users.filter(item => { return item.attributes.username.toLowerCase().indexOf(value.toLowerCase()) !== -1 || item.attributes.ethAddress.toLowerCase().indexOf(value.toLowerCase()) !== -1});
    }


    const handleRecommendedSearch = async (event) => {
        await setSearchValue(event.target.value);
        if (event.target.value.length > 0) {
            const predictionsTmp = await getRecommended(event.target.value);
            setPredictions(predictionsTmp)
        }else{
            setPredictions([]);
        }
    }



    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-50">
            <div className="flex justify-between max-w-6xl  lg:mx-auto">
                {/*Left*/}
                <div onClick={() => router.push('/')}  className="relative hidden lg:inline-grid w-24 cursor-pointer">
                    <Image src="/images/TAURUSLOGOwhite.png" layout='fill' objectFit='contain' />
                </div>

                <div onClick={() => router.push('/')}  className="relative lg:hidden flex-shrink-0 w-10 cursor-pointer">
                    <Image src='/images/TAURUSLOGOwhite.png' layout='fill' objectFit='contain' />
                </div>

                {/*Middle - Search input*/}
                <div className="max-w-xs">
                    <div className="relative mt-1 p-3 rounded-md  ">
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>

                        <input value={searchValue} onChange={handleRecommendedSearch} type="text" placeholder="Search" className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md"/>
                        
                    </div>
                </div>
         

                {/*Right*/}
                <div className="flex items-center justify-end space-x-4">
                    <HomeIcon className="navBtn" onClick={() => router.push('/')}/>
                    <MenuIcon className="h-6 md:hidden cursor-pointer"/>

                    {/* <div className="relative navBtn">
                        <PaperAirplaneIcon className="navBtn rotate-45"/>
                        <div className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
                            3
                        </div>
                    </div> */}
                    {/* <PlusCircleIcon className="navBtn"/> */}
                    {/* <UserGroupIcon className="navBtn" onClick={() => router.push('/explore')}/> */}
                    {/* <HeartIcon className="navBtn"/> */}
                    <ShoppingCartIcon className="navBtn" onClick={() => router.push('/marketplace')}/>
                    <UserIcon className="navBtn" onClick={() => router.push('/myProfile')}/>

                    <Chains />
                    <Account />

                </div>


            </div>

            <div> 
            {
              predictions.map((item, index) => (
                <div className="predictionsContainer cursor-pointer" key={index + item.attributes.ethAddress} onClick={() => router.push(`/userProfile/${item.attributes.ethAddress}`)}>{item.attributes.username}</div>
              ))
            } 
            </div>

        </div>
    )
}

export default Header
