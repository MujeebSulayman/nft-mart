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
  Counters.Counter private _totalSales;

  uint256 public servicePct;
  uint256 public balance;

  // Nft Struct
  struct NftStruct {
    uint256 id;
    string name;
    string imageUrl;
    string description;
    address owner;
    uint256 price;
    uint256 timestamp;
    uint256 endTime;
    bool deleted;
    bool minted;
    bool paidOut;
    bool refunded;
  }

  // Sales Struct
  struct SalesStruct {
    uint256 id;
    uint256 nftId;
    address owner;
    uint256 price;
    uint256 timestamp;
    uint256 endTime;
    bool minted;
    bool refunded;
  }

  mapping(uint256 => NftStruct) nfts;
  mapping(uint256 => SalesStruct[]) sales;
  mapping(uint256 => bool) nftExists;

  constructor(uint256 _pct) ERC721('Nftmart', 'NM') {
    servicePct = _pct;
  }

  // Create Nfts
  function createNft(
    string memory name,
    string memory description,
    string memory imageUrl,
    uint256 endTime,
    uint256 price
  ) public {
    require(price > 0 ether, 'Price should be greater than zero');
    require(bytes(name).length > 0, 'Name should be greater than zero');
    require(endTime > currentTime(), 'End time should be greater than current time');
    require(bytes(description).length > 0, 'Description should be greater than zero');
    require(bytes(imageUrl).length > 0, 'ImageUrl should be greater than zero');

    _totalNfts.increment();
    NftStruct memory nftX;

    nftX.id = _totalNfts.current();
    nftX.name = name;
    nftX.imageUrl = imageUrl;
    nftX.description = description;
    nftX.owner = msg.sender;
    nftX.price = price;
    nftX.timestamp = currentTime();
    nftX.endTime = endTime;
    nftExists[nftX.id] = true;
    nfts[nftX.id] = nftX;
  }

  // Update Nfts
  function updateNft(
    uint256 nftId,
    string memory name,
    string memory description,
    string memory imageUrl,
    uint256 endTime,
    uint256 price
  ) public {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.sender == nfts[nftId].owner, 'Only the owner can edit this NFT');
    require(price > 0 ether, 'Price must be greater than zero');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(endTime > currentTime(), 'End time should be greater than current time');
    nfts[nftId].name = name;
    nfts[nftId].description = description;
    nfts[nftId].imageUrl = imageUrl;
    nfts[nftId].price = price;
    nfts[nftId].endTime = endTime;
  }

  // Delete Nfts
  function deleteNft(uint256 id) public {
    require(nftExists[id], 'Nft does not exist');
    require(msg.sender == nfts[id].owner || msg.sender == owner(), 'Unauthorized entity');
    require(!nfts[id].minted, 'Nft already minted');
    require(!nfts[id].deleted, 'Nft already deleted');
    require(refundNfts(id), 'Nft refund failed');

    nfts[id].deleted = true;

  }

  // Refund Nfts
  function refundNfts(uint256 id) internal returns (bool success) {
    for (uint256 i = 0; i < sales[id].length; i++) {
      sales[id][i].refunded = true;
      payTo(sales[id][i].owner, sales[id][i].price);
      balance -= sales[id][i].price;
    }
    return true;
  }

  function getSingleNft(uint256 id) public view returns (NftStruct memory) {
    return nfts[id];
  }

  // Get all Nfts
  function getAllNfts() public view returns (NftStruct[] memory Nfts) {
    uint256 availableNfts;
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      if (nfts[i].deleted == false) {
        availableNfts++;
      }
    }
    // Initialize Nfts array
    Nfts = new NftStruct[](availableNfts);
    uint256 index;
    // Loop through all Nfts
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      if (nfts[i].deleted == false) {
        Nfts[index] = nfts[i];
        index++;
      }
    }
    return Nfts;
  }

  // Get all Nfts owned by the user
  function getMyNfts() public view returns (NftStruct[] memory Nfts) {
    uint256 availableNfts;
    // Loop through all Nfts
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      if (!nfts[i].deleted && nfts[i].owner == msg.sender) {
        availableNfts++;
      }
    }
    // Initialize Nfts array
    Nfts = new NftStruct[](availableNfts);

    uint256 index;
    // Loop through all Nfts
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      if (!nfts[i].deleted && nfts[i].owner == msg.sender) {
        Nfts[index] = nfts[i];
        index++;
      }
    }
    return Nfts;
  }

  // Buy Nft
  function buyNft(uint256 nftId) public payable nonReentrant {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.value >= nfts[nftId].price, 'Insufficient funds');
    require(nfts[nftId].deleted == false, 'Nft already deleted');
    require(nfts[nftId].minted == false, 'Nft already minted');
    require(nfts[nftId].endTime > currentTime(), 'Nft sale has ended');

    SalesStruct memory sale;
    sale.id = sales[nftId].length + 1;
    sale.nftId = nftId;
    sale.owner = msg.sender;
    sale.price = nfts[nftId].price;
    sale.timestamp = currentTime();
    sale.endTime = nfts[nftId].endTime;
    sales[nftId].push(sale);

    balance += msg.value;
    nfts[nftId].owner = msg.sender;

    // Automatically mint the NFT when purchased
    mintNft(nftId); // Call to mint the NFT

    _totalSales.increment();
  }

  // Get Sales of a Nft
  function getSales(uint256 nftId) public view returns (SalesStruct[] memory Sales) {
    return sales[nftId];
  }

  // Get All Sales
  function getAllSales() public view returns (SalesStruct[] memory Sales) {
    uint256 totalSalesCount = 0;

    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      totalSalesCount += sales[i].length;
    }

    Sales = new SalesStruct[](totalSalesCount);
    uint256 index = 0;

    // Flatten sales data into a single array
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      for (uint256 j = 0; j < sales[i].length; j++) {
        Sales[index] = sales[i][j];
        index++;
      }
    }
    return Sales;
  }

  // Get All Sales of a user
  function getMySales() public view returns (SalesStruct[] memory Sales) {
    uint256 _totalSalesCount = 0;

    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      for (uint256 j = 0; j < sales[i].length; j++) {
        if (sales[i][j].owner == msg.sender) {
          _totalSalesCount++;
        }
      }
    }
    Sales = new SalesStruct[](_totalSalesCount);
    uint256 index = 0;
    for (uint256 i = 1; i <= _totalNfts.current(); i++) {
      for (uint256 j = 0; j < sales[i].length; j++) {
        if (sales[i][j].owner == msg.sender) {
          Sales[index] = sales[i][j];
          index++;
        }
      }
    }
    return Sales;
  }

  //Payout
  function payout(uint256 nftId) public {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.sender == nfts[nftId].owner || msg.sender == owner(), 'Unauthorized entity');
    require(!nfts[nftId].deleted, 'Nft already deleted');
    require(!nfts[nftId].paidOut, 'Nft already paid out');
    require(nfts[nftId].minted, 'Nft not minted');

    uint256 payoutAmount = (balance * (10000 - servicePct)) / 10000;
    uint256 serviceAmount = balance - payoutAmount;

    payTo(nfts[nftId].owner, payoutAmount);
    payTo(owner(), serviceAmount);
    balance = 0;
    nfts[nftId].paidOut = true;
  }

  //Mint Nft
  function mintNft(uint256 nftId) internal returns (bool) {
    require(nftExists[nftId], 'Nft does not exist');
    require(!nfts[nftId].minted, 'Nft already minted');

    // Mint the NFT to each buyer of the NFT (if multiple buyers)
    for (uint256 i = 0; i < sales[nftId].length; i++) {
        _totalTokens.increment();
        sales[nftId][i].minted = true;
        _mint(sales[nftId][i].owner, _totalTokens.current());
    }

    nfts[nftId].minted = true;
    return true;
  }

//Transfer ownership
funtion transferOwnership (uint256 nftId, address newOwner) public {
  require(nftExists[nftId], 'Nft does not exist');
  require(msg.sender == nfts[nftId].owner || msg.sender == owner(), 'Unauthorized entity');

  // Transfer ownership using the ERC721 _transfer method
    _transfer(nfts[nftId].owner, newOwner, nftId);

    // Update internal mapping for the NFT owner
    nfts[nftId].owner = newOwner;
}



  // Pay to
  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success, 'Payment failed');
  }

  // Get current time
  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }
}
