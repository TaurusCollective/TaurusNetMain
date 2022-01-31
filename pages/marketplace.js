import {useMoralis, useMoralisSubscription} from "react-moralis";
import {useEffect, useState} from "react";
//import  {marketplaceContractAbiE} from "../SmartContracts/BSCtestnet/abi-morarableMarketplace";
import { useMoralisDapp } from '../providers/MoralisDappProvider/MoralisDappProvider';
import {useWeb3ExecuteFunction} from "react-moralis";
import Head from 'next/head'
import Header from "../components/Header";

const Marketplace = () => {
    const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError, Moralis, authenticate, isAuthenticated, user, logout, login } = useMoralis()
    const {contractMarketplaceABI, contractMarketplaceAddress, chainId} = useMoralisDapp();
    let marketplaceItemTemplate;
    let itemsForSale;
    let userItemTemplate;
    let userItems;
    const MARKETPLACE_CONTRACT_ADDRESS = contractMarketplaceAddress;//"0xb2BED9E95562A878a9c59ad7675fE375C6E9e862";  //Bsc Testnet
    const marketplaceContract = new web3.eth.Contract(contractMarketplaceABI, MARKETPLACE_CONTRACT_ADDRESS);
    const [myProvider, serMyProvider] = useState(web3.currentProvider)


    const [isAvax, setIsAvax] = useState(true);
    useEffect(() => {
        if(chainId == 0xa869){ // Avalanche testnet
            console.log("Tu pravi da je avax")
            setIsAvax(true);
        }else if(chainId == 0x61){      // BSC testnet
            console.log("Tu pravi da je bsc")
            setIsAvax(false)
        }
    }, [chainId]);


    useEffect(() => {
        serMyProvider(web3.currentProvider);
        console.log("web3.currentProvider 5 : ", myProvider)
    }, [web3, myProvider])
    // useMoralisSubscription("SoldItems", q => q, [], {
    //     onCreate: data => onItemSold,
    // });
    // useMoralisSubscription("ItemsForSale", q => q, [], {
    //     onCreate: data => onItemAdded,
    // });

    
    // useEffect( () => {
    //     const EnableWeb3 = async ({user}) => {
      
    //         if(isWeb3Enabled){
    //             console.log("JEEEEJJJJEEEE");
    //           return null
    //         }else{
    //             console.log("NIIIII");
    //             enableWeb3()
    //         }
          
           
    //     }
    //     EnableWeb3(user);
    // }, [ Moralis,isWeb3Enabled,enableWeb3, user ])






    const initTemplate = (id) => {
        const template = document.getElementById(id);
        console.log("web3.currentProvider 5 : ", myProvider)
        setTimeout(function () {
            console.log("template :: ",template);
            //template.id = "";
            if(template.parentNode)
                template.parentNode.removeChild(template);
        }, 1000);
        return template;
    }

    function fixURL(url){
        console.log("web3.currentProvider 5 : ", myProvider)
        if(url.startsWith("ipfs://")){
        return "https://ipfs.moralis.io:2053/ipfs/"+ url.split("ipfs://").slice(-1);
        } else{
        return url+"?format=json"
        }
    }

      
    const getAndRenderItemData = (item, renderFunction) => {
        let lolUlr;
        console.log("item.tokenUri : ", item.tokenUri)
        if(item.tokenUri.length > 0){
          lolUlr = fixURL(item.tokenUri);
        }else{
          lolUlr = item.tokenUri;
        }
        fetch(lolUlr)
            .then(response => response.json())
                .then(data => {
                    if(data.name){
                        item.name = data.name;
                        item.description = data.description;
                        item.image = fixURL(data.image);
                        renderFunction(item);
                      }else{
                        item.name = data.title;
                        item.description = data.content;
                        item.image = fixURL(data.photoFile);
                        renderFunction(item);
                      }
                });
    }

    // const renderUserItem = async (item) => {
       
    //     const userItemListing = document.getElementById(`user-item-${item.tokenObjectId}`);
        
    //     if (userItemListing) {
    //         return;
    //     }

    //     const userItem = userItemTemplate.cloneNode(true);    // you get the whole div and what is inside it
    //     userItem.getElementsByTagName("img")[0].src = item.image;
    //     userItem.getElementsByTagName("img")[0].alt = item.name;
    //     userItem.getElementsByTagName("h5")[0].innerText = item.name;
    //     userItem.getElementsByTagName("p")[0].innerText = item.description;
    
    //     userItem.getElementsByTagName("input")[0].value = item.askingPrice ?? 1;    //if no askingPrice default to 1
    //     userItem.getElementsByTagName("input")[0].disabled = item.askingPrice > 0;  //if there is an askingPrice we dont allow the user to change the value
    
    //     userItem.getElementsByTagName("button")[0].disabled = item.askingPrice > 0;
    //     userItem.getElementsByTagName("button")[0].onclick = async () => {
    //         console.log("SEM tu");
    //        // user = await Moralis.User.current();
    //         if (!user){
    //             console.log("SEM tu2");
    //             //login();
    //             return;
    //         }
    //         console.log("SEM tu3");
    //         await ensureMarketplaceIsApproved(item.tokenId, item.tokenAddress);
    //         console.log("SEM tu4");
    //         console.log("item.tokenId: ", item.tokenId, "item.tokenAddress: ", item.tokenAddress, "value: ", userItem.getElementsByTagName("input")[0].value );
    //         if (isWeb3Enabled){
    //             await marketplaceContract.methods.addItemToMarket(item.tokenId, item.tokenAddress, userItem.getElementsByTagName("input")[0].value).send({from: user.get('ethAddress') });
    //             console.log("SEM tu4.5");
    //         }else{
    //             console.log("Ni hoto not... addItemToMarket...");
    //         }
            
    //         console.log("SEM tu5");
    
    //     };
    //     // const userItems = document.getElementById("userItemsList");

    //     userItem.id = `user-item-${item.tokenObjectId}`
    //     userItems.appendChild(userItem);
    //     //console.log("userItems :: " , userItems);
       
    // }


    //const contractProcessor = useWeb3ExecuteFunction();
    const buyItem = async (item) => {
        console.log("web3.currentProvider 5 : ", myProvider)
        const userAddress = user.get("ethAddress");
        if (!user) {
            login();
            return;
        }
        console.log("web3.currentProvider 01 : ", myProvider)
        console.log("web3.currentProvider 012 : ", web3.currentProvider)
        marketplaceContract.setProvider(web3.currentProvider);
       await marketplaceContract.methods.buyItem(item.uid).send({from: userAddress, value: item.askingPrice});

    //    const options = {
    //        contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    //        functionName: "buyItem",
    //        abi: marketplaceContractAbiE,
    //        params: {
    //            id: item.uid
    //        },
    //    }
    //    await contractProcessor.fetch({params:options,
    //        onSuccess: () => console.log("success"),
    //        onError: (error) =>  console.log(error),
    //    });
       

    }

    const renderItem = (item) => {
        console.log("web3.currentProvider 5 : ", myProvider)
        console.log("sem tu not");

        const itemForSale = marketplaceItemTemplate.cloneNode(true);    // you get the whole div and what is inside it
        if(item.sellerAvatar){
            console.log("item.sellerAvatar : ", item.sellerAvatar)
            itemForSale.getElementsByTagName("img")[0].src = item.sellerAvatar;
            itemForSale.getElementsByTagName("img")[0].alt = item.sellerUsername;
            itemForSale.getElementsByTagName("span")[0].innerText = item.sellerUsername;
    
        }
        itemForSale.getElementsByTagName("img")[1].src = item.image;
        itemForSale.getElementsByTagName("img")[1].alt = item.name;
        itemForSale.getElementsByTagName("h5")[0].innerText = item.name;
        itemForSale.getElementsByTagName("p")[0].innerText = item.description;
    
        itemForSale.getElementsByTagName("button")[0].innerText = `Buy for ${item.askingPrice}`;
        itemForSale.getElementsByTagName("button")[0].onclick = () => buyItem(item);
        itemForSale.id = `item-${item.uid}`;
        itemsForSale.appendChild(itemForSale)
        console.log("itemsForSale !!!! ",itemsForSale);
    }


    console.log("web3.currentProvider 511 : ", myProvider)

      const loadItems = async () => {
        console.log("web3.currentProvider 5 : ", myProvider)

        let items;

        if(isAvax){
            items = await Moralis.Cloud.run("getItemsAvax");
        } else {
            items = await Moralis.Cloud.run("getItems");
        }



        // const items = await Moralis.Cloud.run("getItems");
        console.log("Items for sale: "+JSON.stringify(items));

        items.forEach(item => {
            if(user){
                if(user.attributes.accounts.includes(item.ownerOf)){        //if item is his it wont render it, it will skip it
                    const userItemListing = document.getElementById(`user-item-${item.tokenObjectId}`);
                    if (userItemListing) {
                        userItemListing.parentNode.removeChild(userItemListing);
                    }
                  //  getAndRenderItemData(item, renderUserItem);
                    return;
                }
            }
         
            getAndRenderItemData(item, renderItem);
        });
    }











      
// setTimeout(function () {
  
//     marketplaceItemTemplate = initTemplate("marketplaceItemTemplate");
//     itemsForSale = document.getElementById("itemsForSale");

//     loadItems();
//   }, 500);
  


  
    // useEffect( () => {
    //     const EnableWeb3 = async ({user}) => {
    
    //         if(isWeb3Enabled){
    //             console.log("JEEEEJJJJEEEE");
    //         return null
    //         }else{
    //             console.log("NIIIII");
    //             enableWeb3()
    //         }
        
        
    //     }
    //     EnableWeb3(user);

    //     setTimeout(function () {
    
    //         marketplaceItemTemplate = initTemplate("marketplaceItemTemplate");
    //         itemsForSale = document.getElementById("itemsForSale");
        
            
    //         // userItemTemplate = initTemplate("itemTemplate");
    //         // userItems = document.getElementById("userItemsList");
    //         // console.log("userItemsSS : ",userItems)
        
    //         loadItems();
    //     }, 500);
      
    // }, [ Moralis, isWeb3Enabled, enableWeb3, user ])

  

    useEffect( () => {
        const EnableWeb3 = async ({}) => {
    
            if(isWeb3Enabled){
                console.log("JEEEEJJJJEEEE");
                serMyProvider(web3.currentProvider);
                console.log("web3.currentProvider 57 : ", myProvider)
            return null
            }else{
                console.log("NIIIII");
                enableWeb3()
            }
        
        
        }
        EnableWeb3();
        console.log("web3.currentProvider 56 : ", myProvider)

        setTimeout(function () {
    
            marketplaceItemTemplate = initTemplate("marketplaceItemTemplate");
            itemsForSale = document.getElementById("itemsForSale");
            console.log("web3.currentProvider 512 : ", myProvider)
            
            if(isWeb3Enabled){
                loadItems();
            }
        }, 500);
      
    }, [ Moralis, isWeb3Enabled, enableWeb3, user ])

    // useEffect( () => {
    //     setTimeout(function () {
    
    //       //  marketplaceItemTemplate = initTemplate("marketplaceItemTemplate");
    //       //  itemsForSale = document.getElementById("itemsForSale");
    //         console.log("web3.currentProvider 513 : ", myProvider)
    //         loadItems();
    //     }, 500);
    // }, [isWeb3Enabled])


    console.log("web3.currentProvider 58 : ", myProvider)

    return (
        <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
            <Head>
            <title>MyProfile</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>
        
            <Header />
        
            
           
            <div className="" id="userItems" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title myModalTitle">Buy NFTs: </h1>
      
            </div>
                <div className="modal-body row row-cols-1 row-cols-md-4 mt-5" id="itemsForSale">
                </div>
                </div>
      </div>
    </div>
          

            <div className="col mb-4" id="marketplaceItemTemplate">
                <div className="card h-100 border-light bg-transparent " >
                    <nav className="card-header navbar navbar.dark p-1">
                        <img src="" alt="" style={{ maxWidth: 62 }} />
                        <span></span>
                    </nav>
            
                    <div className="cardImageWrapper">
                        <img src="" className="card-img-top" alt="" />
                    </div>
                    <div className="card-body d-flex align-items-end">
                        <div className="w-100">
                            <h5 className="card-title"></h5>
                            <p className="card-text"></p>
                            <button className="btn btn-primary btn-block btnBuyOnMarket"></button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Marketplace;
