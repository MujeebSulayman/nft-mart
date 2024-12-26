//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

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

  // Add these event declarations
  event NftPaidOut(
    uint256 indexed nftId,
    address indexed owner,
    uint256 payoutAmount,
    uint256 serviceAmount
  );
  event NftSold(
    uint256 indexed nftId,
    address indexed seller,
    address indexed buyer,
    uint256 price
  );

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
    require(price > 0, 'Price should be greater than zero');
    require(bytes(name).length > 0, 'Name should be greater than zero');
    require(bytes(description).length > 0, 'Description should be greater than zero');
    require(bytes(imageUrl).length > 0, 'ImageUrl should be greater than zero');
    require(endTime > currentTime(), 'End time should be greater than current time');

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
    require(price > 0, 'Price must be greater than zero');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(endTime > currentTime(), 'End time should be greater than end time');

    nfts[nftId].name = name;
    nfts[nftId].description = description;
    nfts[nftId].imageUrl = imageUrl;
    nfts[nftId].price = price;
    nfts[nftId].endTime = endTime;
  }

  // Delete Nfts
  function deleteNft(uint256 nftId) public {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.sender == nfts[nftId].owner || msg.sender == owner(), 'Unauthorized entity');
    require(!nfts[nftId].minted, 'Nft already minted');
    require(!nfts[nftId].deleted, 'Nft already deleted');
    require(refundNfts(nftId), 'Nft refund failed');

    nfts[nftId].deleted = true;
  }

  // Refund Nfts
  function refundNfts(uint256 nftId) internal returns (bool success) {
    for (uint256 i = 0; i < sales[nftId].length; i++) {
      sales[nftId][i].refunded = true;
      payTo(sales[nftId][i].owner, sales[nftId][i].price);
      balance -= sales[nftId][i].price;
    }
    return true;
  }

  //Get single NFT
  function getSingleNft(uint256 nftId) public view returns (NftStruct memory) {
    require(nftExists[nftId], 'Nft does not exist');
    return nfts[nftId];
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
    require(nfts[nftId].endTime > currentTime(), 'Nft sale has ended');

    address previousOwner = nfts[nftId].owner;
    nfts[nftId].owner = msg.sender;

    SalesStruct memory sale;
    sale.id = sales[nftId].length;
    sale.nftId = nftId;
    sale.owner = msg.sender;
    sale.price = nfts[nftId].price;
    sale.timestamp = currentTime();
    sales[nftId].push(sale);

    balance += msg.value;

    if (!nfts[nftId].minted) {
      _mint(msg.sender, nftId);
      nfts[nftId].minted = true;
    } else {
      _transfer(previousOwner, msg.sender, nftId);
    }

    _totalSales.increment();

    emit NftSold(nftId, previousOwner, msg.sender, nfts[nftId].price);

    if (msg.value > nfts[nftId].price) {
      payTo(msg.sender, msg.value - nfts[nftId].price);
    }
  }

  // Get Sales of a Nft
  function getSale(uint256 nftId) public view returns (SalesStruct[] memory) {
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
  function payout(uint256 nftId) public nonReentrant {
    require(nftExists[nftId], 'Nft does not exist');
    require(msg.sender == nfts[nftId].owner || msg.sender == owner(), 'Unauthorized entity');
    require(!nfts[nftId].deleted, 'Nft already deleted');
    require(!nfts[nftId].paidOut, 'Nft already paid out');
    require(nfts[nftId].minted, 'Nft not minted');

    uint256 revenue = nfts[nftId].price;
    require(balance >= revenue, 'Insufficient contract balance');

    uint256 serviceAmount = (revenue * servicePct) / 10000;
    uint256 payoutAmount = revenue - serviceAmount;

    // Payout to NFT owner
    payTo(nfts[nftId].owner, payoutAmount);

    payTo(owner(), serviceAmount);

    nfts[nftId].paidOut = true;

    balance -= revenue;

    emit NftPaidOut(nftId, nfts[nftId].owner, payoutAmount, serviceAmount);
  }

  //Mint Nft
  function mintNft(uint256 nftId) public returns (bool) {
    require(nftExists[nftId], 'Nft does not exist');
    require(!nfts[nftId].minted, 'Nft already minted');

    for (uint256 i = 0; i < sales[nftId].length; i++) {
      _totalTokens.increment();
      sales[nftId][i].minted = true;
      _mint(sales[nftId][i].owner, nftId);
    }

    nfts[nftId].minted = true;
    return true;
  }

  // Transfer ownership
  function transferOwnership(uint256 nftId, address newOwner) public {
    require(nftExists[nftId], 'Nft does not exist');
    require(
      msg.sender == nfts[nftId].owner || msg.sender == owner(),
      'Only the owner can transfer ownership'
    );

    _transfer(nfts[nftId].owner, newOwner, nftId);
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
