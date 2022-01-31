import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import Head from 'next/head'
import Header from "../components/Header";
import { useMoralisDapp } from '../providers/MoralisDappProvider/MoralisDappProvider';


const MyNfts = () => {

  const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError, Moralis, authenticate, isAuthenticated, user,logout } = useMoralis()
  const {tokenContractAbiE, contractMarketplaceABI, contractMarketplaceAddress, chainId} = useMoralisDapp();

  const [isAvax, setIsAvax] = useState(true);
  useEffect(() => {
      if(chainId == 0xa869){ // Avalanche testnet
          setIsAvax(true);
      }else if(chainId == 0x61){      // BSC testnet
          setIsAvax(false)
      }
  }, [chainId]);


  let userItemTemplate;
  let userItems;


  useEffect( () => {
    const EnableWeb3 = async () => {
  
        if(isWeb3Enabled){
          return null
        }else{
            enableWeb3()
        }
      
       
    }
    EnableWeb3();

     userItemTemplate = initTemplate("itemTemplate");
     userItems = document.getElementById("userItemsList");

    if (isAuthenticated && isWeb3Enabled) {
      //  EnableWeb3(user);
        setTimeout(function () {
          loadUserItems();
        }, 500);
    }
  }, [isAuthenticated, Moralis,isWeb3Enabled,enableWeb3, user ])












  // const TOKEN_CONTRACT_ADDRESS = "0x682B589b4Ef09c069f608cDED92871C988fc1F55";    //Bsc Testnet
  // const MARKETPLACE_CONTRACT_ADDRESS = "0x4CF7f84FA643E709999Bf3866Cd5cA256848cA51";  //Bsc Testnet

  //const TOKEN_CONTRACT_ADDRESS = "0xC95520bF17f53BAc917eB46D50815Eb5a5792973";    //Bsc Testnet
  const MARKETPLACE_CONTRACT_ADDRESS = contractMarketplaceAddress//"0xb2BED9E95562A878a9c59ad7675fE375C6E9e862";  //Bsc Testnet



 // const tokenContract = new web3.eth.Contract(tokenContractAbiE, TOKEN_CONTRACT_ADDRESS);
  const marketplaceContract = new web3.eth.Contract(contractMarketplaceABI, MARKETPLACE_CONTRACT_ADDRESS);


  const initTemplate = (id) => {
    const template = document.getElementById(id);
    setTimeout(function () {
        //template.id = "";
        if(template.parentNode)
            template.parentNode.removeChild(template);
    }, 1000);
    return template;
  }


  function fixURL(url){
    if(url){
      if(url.startsWith("ipfs://")){
        return "https://ipfs.moralis.io:2053/ipfs/"+ url.split("ipfs://").slice(-1);
      } else{
        return url+"?format=json"
      }
    }

  }

  const getAndRenderItemData = (item, renderFunction) => {
    let lolUlr;
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
            })
            .catch((error) =>{
              console.error(error);
            } )
  }


  const loadUserItems = async () => {
    let ownedItems;
    if(isAvax){
      ownedItems = await Moralis.Cloud.run("getUserItemsAvax");
    } else {
      ownedItems = await Moralis.Cloud.run("getUserItems");
    }
    ownedItems.forEach(item => {
        const userItemListing = document.getElementById(`user-item-${item.tokenObjectId}`);
        if (userItemListing) {
            return;
        }
        getAndRenderItemData(item, renderUserItem);
    });
  }



  const renderUserItem = async (item) => {
       
    const userItemListing = document.getElementById(`user-item-${item.tokenObjectId}`);
    
    if (userItemListing) {
        return;
    }

    const userItem = userItemTemplate.cloneNode(true);    // you get the whole div and what is inside it
    userItem.getElementsByTagName("img")[0].src = item.image;
    userItem.getElementsByTagName("img")[0].alt = `${item.name} is not reachable... `;
    userItem.getElementsByTagName("h5")[0].innerText = item.name;
    userItem.getElementsByTagName("p")[0].innerText = item.description;

    userItem.getElementsByTagName("input")[0].value = item.askingPrice ?? 1;    //if no askingPrice default to 1
    userItem.getElementsByTagName("input")[0].disabled = item.askingPrice > 0;  //if there is an askingPrice we dont allow the user to change the value

    userItem.getElementsByTagName("button")[0].disabled = item.askingPrice > 0;
    userItem.getElementsByTagName("button")[0].onclick = async () => {
       // user = await Moralis.User.current();
        if (!user){
         //   login();
            return;
        }
        await ensureMarketplaceIsApproved(item.tokenId, item.tokenAddress);
   
        await marketplaceContract.methods.addItemToMarket(item.tokenId, item.tokenAddress, userItem.getElementsByTagName("input")[0].value).send({from: user.get('ethAddress') });
   

    };
    // const userItems = document.getElementById("userItemsList");

    userItem.id = `user-item-${item.tokenObjectId}`
    userItems.appendChild(userItem);
   
}

const ensureMarketplaceIsApproved = async (tokenId, tokenAddress) => {
  const userAddress = user.get('ethAddress');
  const contract = new web3.eth.Contract(tokenContractAbiE, tokenAddress);
 
  
      const approvedAddress = await contract.methods.getApproved(tokenId).call({from: userAddress});

      if(approvedAddress != MARKETPLACE_CONTRACT_ADDRESS){

          await contract.methods.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId).send({from: userAddress});

      }
 
}








return (
  <div className="bg-gray-50 h-screen overflow-y-scroll ">
  <Head>
    <title>MyProfile</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <Header />




  <div className="col mb-4" id="itemTemplate">
    <div className="card h-100 border-light bg-transparent " >
        <div className="cardImageWrapper">
          <img src="" className="card-img-top" alt="" />
        </div>
        <div className="card-body  align-items-end">
            <div className="w-100">
                <h5 className="card-title"></h5>
                <p className="card-text"></p>
                <div className="input-group mb-3">
                    <input type="number" min="1" step="1" className="form-control" placeholder="Price" />
                    <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">Put for sale</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
 

    <div className="" id="userItems" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title myModalTitle">My Items</h5>
              {/* <button onClick={() => setUserItemsShow(false)} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button> */}
            </div>
            <div className="modal-body row row-cols-1 row-cols-md-4 mt-5" id="userItemsList">
            
            </div>
            {/* <div className="modal-footer">
                <button onClick={() => setUserItemsShow(false)} type="button" id="btnCloseUserItems" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div> */}
        </div>
      </div>
    </div>
  </div>
)



}

export default MyNfts;
