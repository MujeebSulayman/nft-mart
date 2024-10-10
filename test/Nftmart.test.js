const { expect } = require('chai')
const { ethers } = require('hardhat')
const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers')
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe('Nftmart Contract', () => {
  let contract, result
  const servicePct = 500 // 5%
  const nftId = 1
  const name = 'My NFT'
  const imageUrl = 'https://linktoimage.png'
  const description = 'My First Ever Charity Reminiscence'
  const price = 1.5
  let endTime

  beforeEach(async () => {
    ;[deployer, owner, buyer1, buyer2] = await ethers.getSigners()
    contract = await ethers.deployContract('Nftmart', [servicePct])
    await contract.waitForDeployment()

    // Set endTime to 2 hours from now to ensure it's always at least 1 hour in the future
    const currentBlockTime = await time.latest()
    endTime = currentBlockTime + 7200 // 2 hours from now in seconds
  })

  describe('NFT Management', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, description, imageUrl, endTime, toWei(price))
    })

    it('should confirm nft creation', async () => {
      result = await contract.getAllNfts()
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(owner).getMyNfts()
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm nft update', async () => {
      result = await contract.getSingleNft(nftId)
      expect(result.name).to.be.equal(name)

      const newName = 'This is the NFT new name'
      await contract
        .connect(owner)
        .updateNft(nftId, newName, description, imageUrl, endTime, toWei(price))
      result = await contract.getSingleNft(nftId)
      expect(result.name).to.be.equal(newName)
    })
  })

  describe('buyNft', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, description, imageUrl, endTime, toWei(price))
    })

    it('should allow a user to buy an NFT', async () => {
      const buyTx = await contract.connect(buyer1).buyNft(nftId, { value: toWei(price) })
      await expect(buyTx)
        .to.emit(contract, 'NftSold')
        .withArgs(nftId, owner.address, buyer1.address, toWei(price))

      const nft = await contract.getSingleNft(nftId)
      expect(nft.owner).to.equal(buyer1.address)
      expect(nft.minted).to.be.true
    })

    it('should revert if insufficient funds are sent', async () => {
      await expect(
        contract.connect(buyer1).buyNft(nftId, { value: toWei(price / 2) })
      ).to.be.revertedWith('Insufficient funds')
    })

    it('should revert if NFT is already minted', async () => {
      await contract.connect(buyer1).buyNft(nftId, { value: toWei(price) })
      await expect(
        contract.connect(buyer2).buyNft(nftId, { value: toWei(price) })
      ).to.be.revertedWith('Nft already minted')
    })
  })

  describe('payout', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, description, imageUrl, endTime, toWei(price));
      await contract.connect(buyer1).buyNft(nftId, { value: toWei(price) });
      
      // Ensure the contract has sufficient balance
      await owner.sendTransaction({
        to: contract.address,
        value: ethers.parseEther("10.0") // Send 10 ETH to the contract
      });
    });

    it('should allow the NFT owner to payout', async () => {
      const initialBalance = await ethers.provider.getBalance(owner.address)
      const payoutTx = await contract.connect(buyer1).payout(nftId)

      const expectedPayout = toWei(price).mul(9500).div(10000) // 95% of the price
      const expectedServiceFee = toWei(price).mul(500).div(10000) // 5% of the price

      await expect(payoutTx)
        .to.emit(contract, 'NftPaidOut')
        .withArgs(nftId, owner.address, expectedPayout, expectedServiceFee)

      const finalBalance = await ethers.provider.getBalance(owner.address)
      expect(finalBalance.sub(initialBalance)).to.equal(expectedPayout)

      const nft = await contract.getSingleNft(nftId)
      expect(nft.paidOut).to.be.true
    })

    it('should revert if NFT is already paid out', async () => {
      await contract.connect(buyer1).payout(nftId)
      await expect(contract.connect(buyer1).payout(nftId)).to.be.revertedWith(
        'Nft already paid out'
      )
    })

    it('should revert if called by unauthorized entity', async () => {
      await expect(contract.connect(buyer2).payout(nftId)).to.be.revertedWith('Unauthorized entity')
    })
  })
})
