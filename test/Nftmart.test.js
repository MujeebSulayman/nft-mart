const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe('NFT Contract', () => {
  let contract, result
  const servicePct = 500
  const nftId = 1
  const name = 'My NFT'
  const imageUrl = 'https://linktoimage.png'
  const description = 'My First Ever Charity Reminicence'
  const price = 1.5
  const endTime = Date.now() + 10 * 60 * 1000

  beforeEach(async () => {
    ;[deployer, owner, buyer1, buyer2] = await ethers.getSigners()
    contract = await ethers.deployContract('Nftmart', [servicePct])
    await contract.waitForDeployment()
  })

  describe('NFT Management', () => {
    beforeEach(async () => {
      await contract.connect(owner).createNft(name, imageUrl, description, toWei(price), endTime)
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
        .updateNft(nftId, newName, imageUrl, description, toWei(price), endTime)
      result = await contract.getSingleNft(nftId)
      expect(result.name).to.be.equal(newName)
    })
  })
})
