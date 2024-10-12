const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Nftmart', function () {
  let Nftmart
  let nftmart
  let owner
  let user1
  let user2
  let addrs

  beforeEach(async function () {
    ;[owner, user1, user2, ...addrs] = await ethers.getSigners()

    // Deploy the contract with a 5% service fee
    const NftmartFactory = await ethers.getContractFactory('Nftmart')
    nftmart = await NftmartFactory.deploy(500)
    await nftmart.waitForDeployment()
  })

  describe('NFT Creation', function () {
    it('Should create an NFT', async function () {
      const name = 'Test NFT'
      const description = 'This is a test NFT'
      const imageUrl = 'https://example.com/image.jpg'
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const endTime = currentTimestamp + 7 * 24 * 60 * 60 // 7 days from now
      const price = ethers.parseEther('1')

      await nftmart.connect(user1).createNft(name, description, imageUrl, endTime * 1000, price)

      const nft = await nftmart.getSingleNft(1)
      expect(nft.name).to.equal(name)
      expect(nft.description).to.equal(description)
      expect(nft.imageUrl).to.equal(imageUrl)
      expect(nft.owner).to.equal(await user1.getAddress())
      expect(nft.price).to.equal(price)
    })

    it('Should revert if price is zero', async function () {
      const name = 'Test NFT'
      const description = 'This is a test NFT'
      const imageUrl = 'https://example.com/image.jpg'
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const endTime = currentTimestamp + 7 * 24 * 60 * 60 // 7 days from now
      const price = 0

      await expect(
        nftmart.connect(user1).createNft(name, description, imageUrl, endTime * 1000, price)
      ).to.be.revertedWith('Price should be greater than zero')
    })
  })

  describe('NFT Purchase', function () {
    beforeEach(async function () {
      const name = 'Test NFT'
      const description = 'This is a test NFT'
      const imageUrl = 'https://example.com/image.jpg'
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const endTime = currentTimestamp + 7 * 24 * 60 * 60 // 7 days from now
      const price = ethers.parseEther('1')

      await nftmart.connect(user1).createNft(name, description, imageUrl, endTime * 1000, price)
    })

    it('Should allow purchase of an NFT', async function () {
      const nftId = 1
      const price = ethers.parseEther('1')

      await nftmart.connect(user2).buyNft(nftId, { value: price })

      const nft = await nftmart.getSingleNft(nftId)
      expect(nft.owner).to.equal(await user2.getAddress())
    })

    it('Should revert if insufficient funds are sent', async function () {
      const nftId = 1
      const price = ethers.parseEther('0.5')

      await expect(nftmart.connect(user2).buyNft(nftId, { value: price })).to.be.revertedWith(
        'Insufficient funds'
      )
    })
  })

  describe('NFT Payout', function () {
    beforeEach(async function () {
      const name = 'Test NFT'
      const description = 'This is a test NFT'
      const imageUrl = 'https://example.com/image.jpg'
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const endTime = currentTimestamp + 7 * 24 * 60 * 60 // 7 days from now
      const price = ethers.parseEther('1')

      await nftmart.connect(user1).createNft(name, description, imageUrl, endTime * 1000, price)
      await nftmart.connect(user2).buyNft(1, { value: price })
    })

    it('Should allow payout of a sold NFT', async function () {
      const nftId = 1
      const initialBalance = await ethers.provider.getBalance(user1.getAddress())

      // Ensure we're using the correct account (the NFT creator) for payout
      await nftmart.connect(user1).payout(nftId)

      const finalBalance = await ethers.provider.getBalance(user1.getAddress())
      expect(finalBalance).to.be.gt(initialBalance)
    })

    it('Should revert if NFT is already paid out', async function () {
      const nftId = 1

      // First payout
      await nftmart.connect(user1).payout(nftId)

      // Second payout attempt
      await expect(nftmart.connect(user1).payout(nftId)).to.be.revertedWith('Nft already paid out')
    })

    it('Should revert if unauthorized entity attempts payout', async function () {
      const nftId = 1

      // Attempt payout with an unauthorized account (user2)
      await expect(nftmart.connect(user2).payout(nftId)).to.be.revertedWith('Unauthorized entity')
    })
  })

  // Additional test cases can be added here for other functions
  // such as updateNft, deleteNft, getAllNfts, getMyNfts, getSales, etc.
})
