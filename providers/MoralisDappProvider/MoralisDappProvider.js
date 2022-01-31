import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import  {tokenContractAbiE, marketplaceContractAbiE} from "../../SmartContracts/BSCtestnet/abi-morarableMarketplace"; //tokenContractAbiE ne vem točno če je vredi oz. če je še isti

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  // Old unchainged contract from tutorial
  // const [contractABI, setContractABI] = useState('[{"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "categoryId", "type": "bytes32"}, {"indexed": false, "internalType": "string", "name": "category", "type": "string"}], "name": "CategoryCreated", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32"}, {"indexed": false, "internalType": "string", "name": "contentUri", "type": "string"}], "name": "ContentAdded", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "postOwner", "type": "address"}, {"indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32"}, {"indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32"}, {"indexed": false, "internalType": "bytes32", "name": "categoryId", "type": "bytes32"}], "name": "PostCreated", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "postOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "voter", "type": "address"}, {"indexed": false, "internalType": "uint80", "name": "reputationPostOwner", "type": "uint80"}, {"indexed": false, "internalType": "uint80", "name": "reputationVoter", "type": "uint80"}, {"indexed": false, "internalType": "int40", "name": "postVotes", "type": "int40"}, {"indexed": false, "internalType": "bool", "name": "up", "type": "bool"}, {"indexed": false, "internalType": "uint8", "name": "reputationAmount", "type": "uint8"}], "name": "Voted", "type": "event"}, {"inputs": [{"internalType": "string", "name": "_category", "type": "string"}], "name": "addCategory", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_parentId", "type": "bytes32"}, {"internalType": "string", "name": "_contentUri", "type": "string"}, {"internalType": "bytes32", "name": "_categoryId", "type": "bytes32"}], "name": "createPost", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_categoryId", "type": "bytes32"}], "name": "getCategory", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_contentId", "type": "bytes32"}], "name": "getContent", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_postId", "type": "bytes32"}], "name": "getPost", "outputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "bytes32", "name": "", "type": "bytes32"}, {"internalType": "bytes32", "name": "", "type": "bytes32"}, {"internalType": "int72", "name": "", "type": "int72"}, {"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_address", "type": "address"}, {"internalType": "bytes32", "name": "_categoryID", "type": "bytes32"}], "name": "getReputation", "outputs": [{"internalType": "uint80", "name": "", "type": "uint80"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_postId", "type": "bytes32"}, {"internalType": "uint8", "name": "_reputationTaken", "type": "uint8"}], "name": "voteDown", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_postId", "type": "bytes32"}, {"internalType": "uint8", "name": "_reputationAdded", "type": "uint8"}], "name": "voteUp", "outputs": [], "stateMutability": "nonpayable", "type": "function"}]');
  // const [contractAddress, setContractAddress] = useState("0x82eBdbAE9c496a99be4Bf50d139E999Ce91992ae");
  // My contract- added comments (simple):
 const [contractABI, setContractABI] = useState('[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "category", "type": "string" } ], "name": "CategoryCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" } ], "name": "CommentCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "contentUri", "type": "string" } ], "name": "ContentAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32[]", "name": "commentList", "type": "bytes32[]" } ], "name": "PostChangedCommentList", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" } ], "name": "PostCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "voter", "type": "address" }, { "indexed": false, "internalType": "uint80", "name": "reputationPostOwner", "type": "uint80" }, { "indexed": false, "internalType": "uint80", "name": "reputationVoter", "type": "uint80" }, { "indexed": false, "internalType": "int40", "name": "postVotes", "type": "int40" }, { "indexed": false, "internalType": "bool", "name": "up", "type": "bool" }, { "indexed": false, "internalType": "uint8", "name": "reputationAmount", "type": "uint8" } ], "name": "Voted", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "_category", "type": "string" } ], "name": "addCategory", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_parentId", "type": "bytes32" }, { "internalType": "string", "name": "_contentUri", "type": "string" }, { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "createComment", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_parentId", "type": "bytes32" }, { "internalType": "string", "name": "_contentUri", "type": "string" }, { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "createPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "getCategory", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" } ], "name": "getComment", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "int72", "name": "", "type": "int72" }, { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_contentId", "type": "bytes32" } ], "name": "getContent", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" } ], "name": "getPost", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "int72", "name": "", "type": "int72" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPosts", "outputs": [ { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "bytes32", "name": "_categoryID", "type": "bytes32" } ], "name": "getReputation", "outputs": [ { "internalType": "uint80", "name": "", "type": "uint80" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "posts", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" }, { "internalType": "uint8", "name": "_reputationTaken", "type": "uint8" } ], "name": "voteDown", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" }, { "internalType": "uint8", "name": "_reputationAdded", "type": "uint8" } ], "name": "voteUp", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]');
  // lol
 //const [contractABI, setContractABI] = useState('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "category", "type": "string" } ], "name": "CategoryCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" } ], "name": "CommentCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "contentUri", "type": "string" } ], "name": "ContentAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "parentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "categoryId", "type": "bytes32" } ], "name": "PostCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "postId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "postOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "voter", "type": "address" }, { "indexed": false, "internalType": "uint80", "name": "reputationPostOwner", "type": "uint80" }, { "indexed": false, "internalType": "uint80", "name": "reputationVoter", "type": "uint80" }, { "indexed": false, "internalType": "int40", "name": "postVotes", "type": "int40" }, { "indexed": false, "internalType": "bool", "name": "up", "type": "bool" }, { "indexed": false, "internalType": "uint8", "name": "reputationAmount", "type": "uint8" } ], "name": "Voted", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "_category", "type": "string" } ], "name": "addCategory", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_parentId", "type": "bytes32" }, { "internalType": "string", "name": "_contentUri", "type": "string" }, { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "createComment", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_parentId", "type": "bytes32" }, { "internalType": "string", "name": "_contentUri", "type": "string" }, { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "createPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_categoryId", "type": "bytes32" } ], "name": "getCategory", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" } ], "name": "getComment", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "int72", "name": "", "type": "int72" }, { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_contentId", "type": "bytes32" } ], "name": "getContent", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" } ], "name": "getPost", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "int72", "name": "", "type": "int72" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPosts", "outputs": [ { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "bytes32", "name": "_categoryID", "type": "bytes32" } ], "name": "getReputation", "outputs": [ { "internalType": "uint80", "name": "", "type": "uint80" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "posts", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" }, { "internalType": "uint8", "name": "_reputationTaken", "type": "uint8" } ], "name": "voteDown", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_postId", "type": "bytes32" }, { "internalType": "uint8", "name": "_reputationAdded", "type": "uint8" } ], "name": "voteUp", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]');

 
 
  // const [contractAddress, setContractAddress] = useState("0x7e54e9005D81761f1BD9f3776a4A5734441d207d");  //isto samo spodaj sem popravo za upvotanje:
  // const [contractAddress, setContractAddress] = useState("0x6F2aEEb0C62c663f0313CC7D93c49232cE692C1D");  //vredi samo brez da je nft
  const [contractAddress, setContractAddress] = useState("");     //posts BSC testnet
  const [selectedCategory, setSelectedCategory] = useState({"categoryId":"0x91","category":"default"});

  //User V2:
  // const [contractUserABI, setContractUserABI] = useState('[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "contentUri", "type": "string" } ], "name": "ContentAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "contentUri", "type": "string" } ], "name": "ContentUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "userId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "ethAddress", "type": "address" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" } ], "name": "UserCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "userId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "ethAddress", "type": "address" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" } ], "name": "UserUpdated", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "_contentUri", "type": "string" } ], "name": "createUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_contentId", "type": "bytes32" } ], "name": "getContent", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_userId", "type": "bytes32" } ], "name": "getUser", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getUsers", "outputs": [ { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_contentUri", "type": "string" } ], "name": "testEncode", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_userId", "type": "bytes32" }, { "internalType": "bytes32", "name": "_contentId", "type": "bytes32" }, { "internalType": "string", "name": "_contentUriNew", "type": "string" } ], "name": "updateUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "users", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" } ]');
  // const [contractUserAddress, setContractUserAddress] = useState("0x4817661814DD537CA34512E535765302391Da291");

  //User V3:
  const [contractUserABI, setContractUserABI] = useState('[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "contentId", "type": "bytes32" }, { "indexed": false, "internalType": "string", "name": "contentUri", "type": "string" } ], "name": "ContentAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "userId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "ethAddress", "type": "address" }, { "indexed": false, "internalType": "bytes32", "name": "contentId", "type": "bytes32" } ], "name": "UserCreated", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "_contentUri", "type": "string" } ], "name": "createUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_contentId", "type": "bytes32" } ], "name": "getContent", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "_userId", "type": "bytes32" } ], "name": "getUser", "outputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getUsers", "outputs": [ { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_contentUri", "type": "string" } ], "name": "testEncode", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "users", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" } ]');
  const [contractUserAddress, setContractUserAddress] = useState("0xA62Fb1e99c2aA9218ad2CfCe1Ae7aC02d5B5131d");

  //Marketplace:
  const [contractMarketplaceABI, setContractMarketplaceABI] = useState(marketplaceContractAbiE);
  const [contractMarketplaceAddress, setContractMarketplaceAddress] = useState("0xb2BED9E95562A878a9c59ad7675fE375C6E9e862");


  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
      if(chain == 0xa869){
        setContractAddress("0x7C8207a4632Bc31283a789F92764A8b20467d924") //posts decentraPosts Avalanche testnet
        setContractUserAddress("0x9614C39Bda6D0a315cAeAb0d6a116abdaF71e0Ee") //user decentraUser for Avalanche testnet
        setContractMarketplaceAddress("0xb114145385f82C76151A7477C11768c522290404")  //marketplace for Avalanche testnet
      } else if(chain == 0x61){
        setContractAddress("0xC95520bF17f53BAc917eB46D50815Eb5a5792973") //posts decentraPosts BSC testnet
        setContractUserAddress("0xA62Fb1e99c2aA9218ad2CfCe1Ae7aC02d5B5131d") //user decentraUser for BSC testnet
        setContractMarketplaceAddress("0xb2BED9E95562A878a9c59ad7675fE375C6E9e862")  //marketplace for BSC testnet
      }
     
     
      

    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(chainId == 0xa869){
      setContractAddress("0x7C8207a4632Bc31283a789F92764A8b20467d924") //posts decentraPosts Avalanche testnet
      setContractUserAddress("0x9614C39Bda6D0a315cAeAb0d6a116abdaF71e0Ee") //user decentraUser for Avalanche testnet
      setContractMarketplaceAddress("0xb114145385f82C76151A7477C11768c522290404")  //marketplace for Avalanche testnet
    } else if(chainId == 0x61){
      setContractAddress("0xC95520bF17f53BAc917eB46D50815Eb5a5792973") //posts decentraPosts BSC testnet
      setContractUserAddress("0xA62Fb1e99c2aA9218ad2CfCe1Ae7aC02d5B5131d") //user decentraUser for BSC testnet
      setContractMarketplaceAddress("0xb2BED9E95562A878a9c59ad7675fE375C6E9e862")  //marketplace for BSC testnet
    }

  }, [chainId]);
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, selectedCategory, setSelectedCategory, contractABI, setContractABI, contractAddress, setContractAddress,
      contractUserABI, setContractUserABI, contractUserAddress, setContractUserAddress, contractMarketplaceABI, contractMarketplaceAddress , tokenContractAbiE }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
