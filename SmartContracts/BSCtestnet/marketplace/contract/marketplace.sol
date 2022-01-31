// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract MorarableMarketContract {
    struct AuctionItem {
        // our Item structure
        uint256 id;
        address tokenAddress;
        uint256 tokenId;
        address payable seller;
        uint256 askingPrice;
        bool isSold;
    }

    AuctionItem[] public itemsForSale; // Array of Items that are for sale
    mapping(address => mapping(uint256 => bool)) activeItems; // tokenAddress => (id => isSold)  For each tokenAddress for its id check if true or false, then it's activeItems; so that we don't neeed to always loop through itemsForSale

    event itemAdded(
        uint256 id,
        uint256 tokenId,
        address tokenAddress,
        uint256 askingPrice
    ); // executes when new itemAdded
    event itemSold(uint256 id, address buyer, uint256 askingPrice); // executes when item sold

    modifier OnlyItemOwner(address tokenAddress, uint256 tokenId) {
        // to check that the caller is the owner of the Item
        IERC721 tokenContract = IERC721(tokenAddress); // gets the tokenContract
        require(tokenContract.ownerOf(tokenId) == msg.sender); // require that the owner of tokenId of tokenContract is the msg.sender
        _;
    }

    modifier HasTransferApproval(address tokenAddress, uint256 tokenId) {
        // to check if Marketplace has the approval of transfering the Item on behalf of the user
        IERC721 tokenContract = IERC721(tokenAddress);
        require(tokenContract.getApproved(tokenId) == address(this)); // require that the approved address is the address of this contract (marketplace contract)
        _;
    }

    modifier ItemExist(uint256 id) {
        // Chack if Item with this id exists
        require(
            id < itemsForSale.length && itemsForSale[id].id == id,
            "Could not find Item!"
        );
        _;
    }

    modifier IsForSale(uint256 id) {
        // Chack if Item is for sale
        require(itemsForSale[id].isSold == false, "Item is already sold!");
        _;
    }

    function addItemToMarket(
        uint256 tokenId,
        address tokenAddress,
        uint256 askingPrice
    )
        external
        OnlyItemOwner(tokenAddress, tokenId)
        HasTransferApproval(tokenAddress, tokenId)
        returns (uint256)
    {
        // to add Item... Make that OnlyItemOwner can add it for sale... chack that this contract has the approval to transfer
        require(
            activeItems[tokenAddress][tokenId] == false,
            "Item already up for Sale!"
        ); // require that the item isn't already for sale
        uint256 newItemId = itemsForSale.length; // set new id
        itemsForSale.push(
            AuctionItem(
                newItemId,
                tokenAddress,
                tokenId,
                payable(msg.sender),
                askingPrice,
                false
            )
        ); // add Item to the array
        activeItems[tokenAddress][tokenId] = true; // ser item for sale

        assert(itemsForSale[newItemId].id == newItemId); // make sure that the id of new item added is same to newItemId
        emit itemAdded(newItemId, tokenId, tokenAddress, askingPrice); // execute event
        return newItemId; // return id of new item
    }

    function buyItem(uint256 id)
        external
        payable
        ItemExist(id)
        IsForSale(id)
        HasTransferApproval(
            itemsForSale[id].tokenAddress,
            itemsForSale[id].tokenId
        )
    {
        // to buy item... Check that the Item exists... that it is for sale... chack that this contract has the approval to transfer
        require(
            msg.value >= itemsForSale[id].askingPrice,
            "Not enough funds sent!"
        ); // require that the msg.value is greater or same as asking price
        require(
            msg.sender != itemsForSale[id].seller,
            "Buyer can't be the seller!"
        ); // require that the buyer isn't the seller

        itemsForSale[id].isSold = true; // tag item as sold
        activeItems[itemsForSale[id].tokenAddress][
            itemsForSale[id].tokenId
        ] = false; // remove item form activeItems array
        IERC721(itemsForSale[id].tokenAddress).safeTransferFrom(
            itemsForSale[id].seller,
            msg.sender,
            itemsForSale[id].tokenId
        ); // transfer token ie Item
        itemsForSale[id].seller.transfer(msg.value); // transfer the funds "money"

        emit itemSold(id, msg.sender, itemsForSale[id].askingPrice); // execute event
    }
}
