// test/Nftmart.test.js
const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe('Nftmart Contract', function () {
  let contract, result
  const servicePct = 500
  const nftId = 1
  const name = 'My NFT'
  const description = 'My first nft marketplace dApp'
  const imageUrl = 'https://linktoimage.png'
  const price = 1.5
  const endTime = Date.now() + 10 * 60 * 1000

  beforeEach(async () => {
    ;[deployer, owner, buyer1, buyer2] = await ethers.getSigners()
    contract = await ethers.deployContract('Nftmart', [servicePct])
    await contract.waitForDeployment()
  })

  describe('NFT Creation', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, description, imageUrl, endTime, toWei(price))
    })
    //Create NFT Test
    it('Should confirm nft creation', async () => {
      result = await contract.getAllNfts()
      expect(result).to.have.lengthOf(1)
      expect(result[0].id).to.equal(nftId)
      expect(result[0].name).to.equal(name)
      expect(result[0].description).to.equal(description)
      expect(result[0].imageUrl).to.equal(imageUrl)
      expect(result[0].price).to.equal(toWei(price))
      expect(result[0].endTime).to.equal(endTime)

      result = await contract.connect(owner).getMyNfts()
      expect(result).to.have.lengthOf(1)
      expect(result[0].id).to.equal(nftId)
      expect(result[0].name).to.equal(name)
      expect(result[0].description).to.equal(description)
      expect(result[0].imageUrl).to.equal(imageUrl)
      expect(result[0].price).to.equal(toWei(price))
      expect(result[0].endTime).to.equal(endTime)

      result = await contract.getSingleNft(nftId)
      expect(result.name).to.equal(name)
      expect(result.description).to.equal(description)
      expect(result.imageUrl).to.equal(imageUrl)
      expect(result.price).to.equal(toWei(price))
      expect(result.endTime).to.equal(endTime)
    })

    // Update NFT Test
    it('Should update nft creation', async () => {
      result = await contract.getSingleNft(nftId)
      expect(result.name).to.be.equal(name)
      expect(result.description).to.be.equal(description)
      expect(result.imageUrl).to.be.equal(imageUrl)

      const newName = 'This is the new NFT name'
      const newDescription = 'This is the new NFT description'
      const newImageUrl = 'This is the new NFT image Url'
      const newEndTime = Date.now() + 10 * 60 * 1000
      const newPrice = toWei(2)

      await contract
        .connect(owner)
        .updateNft(nftId, newName, newDescription, newImageUrl, newEndTime, newPrice)

      result = await contract.getSingleNft(nftId)
      expect(result.name).to.be.equal(newName)
      expect(result.description).to.be.equal(newDescription)
      expect(result.imageUrl).to.be.equal(newImageUrl)
      expect(result.endTime).to.be.equal(newEndTime)
      expect(result.price).to.be.equal(newPrice)
    })

    //Delete NFT Test
    it('should delete nft', async () => {
      result = await contract.getAllNfts()
      expect(result).to.have.lengthOf(1)

      result = await contract.getSingleNft(nftId)
      expect(result.deleted).to.be.equal(false)

      await contract.connect(owner).deleteNft(nftId)

      result = await contract.getAllNfts()
      expect(result).to.have.lengthOf(0)

      result = await contract.getSingleNft(nftId)
      expect(result.deleted).to.be.equal(true)
    })
  })

  describe('NFT Purchase', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, description, imageUrl, endTime, toWei(price))

      await contract.connect(buyer1).buyNft(nftId, { value: toWei(price) })
    })

    it('should buy nft', async () => {
      result = await contract.getSingleNft(nftId)
      expect(result.owner).to.be.equal(buyer1.address)

      expect(result.price).to.be.equal(toWei(price))
      expect(result.endTime).to.be.equal(endTime)

      result = await contract.connect(buyer1).getMyNfts()
      expect(result).to.have.lengthOf(1)
      expect(result[0].id).to.be.equal(nftId)
      expect(result[0].name).to.be.equal(name)
      expect(result[0].description).to.be.equal(description)
      expect(result[0].imageUrl).to.be.equal(imageUrl)
      expect(result[0].price).to.be.equal(toWei(price))
      expect(result[0].endTime).to.be.equal(endTime)
    })

   


    
  })
})
