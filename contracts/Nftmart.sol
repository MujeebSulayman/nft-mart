// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Nftmart is ERC721, Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _totalNfts;
  Counters.Counter private _totalTokens;

  uint256 public servicePct;
  uint256 public balance;

  struct NftStruct {
    uint256 id;
    string name;
    string imageUrl;
    string description;
    address owner;
    uint256 price;
    uint256 timestamp;
    bool deleted;
    bool minted;
    bool paidOut;
    bool refunded;
  }

  struct SalesStruct {
    uint256 id;
    uint256 nftId;
    address owner;
    uint256 price;
    uint256 timestamp;
    bool minted;
    bool refunded;
  }

  mapping(uint256 => NftStruct) nfts;
  mapping(uint256 => SalesStruct[]) sales;
  mapping(uint256 => bool) nftExists;

  constructor(uint256 _pct) ERC721('Nftmart', 'NM') {
    servicePct = _pct;
  }

  function createNft(
    string memory name,
    string memory description,
    string memory imageUrl,
    uint256 price
  ) public {
    require(price > 0 ether, 'Price should be greater than zero');
    require(bytes(name).length > 0, 'Name should be greater than zero');
    require(bytes(description).length > 0, 'Description should be greater than zero');
    require(bytes(imageUrl).length > 0, 'ImageUrl should be greater than zero');

    _totalNfts.increament();
    NftStruct memory nftX;

    nftX.id = _totalNfts.current();
    nftX.name = name;
    nftX.imageUrl = imageUrl;
    nftX.description = description;
    nftX.owner = msg.sender;
    nftX.price = price;
    nftX.timestamp = currentTime();

    nftExists[nftX.id] = true;
    nfts[nftX.id] = nftX;
  }

  function updateNft(
    uint256 nftId,
    string memory name,
    string memory description,
    string memory imageUrl,
    uint256 price
  ) public {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.sender == nfts[nftId].owner, 'Only the owner can edit this NFT');
    require(price > 0 ether, 'Price must be greater than zero');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');

    nfts[nftId].name = name;
    nfts[nftsId].description = description;
    nfts[nftsId].imageUrl = imageUrl;
    nfts[nftsId].price = price;
  }


    funtion deleteNft (uint256 id) public {
    require(nftExists[id], 'Nft does not exist');
    require(msg.sender == nfts[id].owner || msg.sender == owner(), 'Unauthorized entity');
    require(!nfts[id].minted, 'Nft already minted');
    require(!nfts[id].deleted, 'Nft already deleted');
    require(refundNfts(id), 'Nft refund failed');

    nfts[id].deleted = true;
  }

  function refundNfts(uint256 id) internal returns (bool) {
    for (uint256 i = 0; i < sales[nftsId].length; i++){
     sales[nftsId][i].refunded = true;
     payTo(sales[nftsId][i].owner, sales[nftsId][i].price);
     balance -= sales[nftsId][i].price;
    }
  }
 
 function getSingleNft( uint256 id ) public view returns (NftStruct memory) {
  return nfts[id];
 }

funtion getAllNfts () public view returns (NftStruct[] memory){
  uint256 availableNfts;
  for (uint256 i = 1; i< _totalNfts.current(); i++  ){
    if(nfts[i].deleted == false){
      availableNfts++;
    }
  }

  NftStruct[] memory availableNfts = new NftStruct[](availableNfts);
  uint256 index;
  for (uint256 i = 1; i< _totalNfts.current(); i++  ){
    if(nfts[i].deleted == false){
      availableNfts[index] = nfts[i];
  }

    
function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{value: amount}('');
    require(success, 'Payment failed');
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }
}
