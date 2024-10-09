require('dotenv').config();
const { ethers } = require('hardhat')

async function main() {
  console.log('Deploying Nftmart in progress...')

  try {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

    const Nftmart = await ethers.getContractFactory('Nftmart')
    console.log('Deploying Nftmart...')

    const nftmart = await Nftmart.deploy(500)
    await nftmart.waitForDeployment()
    console.log('Nftmart deployed at:', await nftmart.getAddress())

    const fs = require('fs')
    const contractsDir = __dirname + "/../contracts"

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir)
    }

    fs.writeFileSync(
      contractsDir + '/contractAddress.json',
      JSON.stringify({ Nftmart: await nftmart.getAddress() }, undefined, 2)
    )

    console.log('Contract address saved to contractAddress.json')
  } catch (error) {
    console.error('Error deploying Nftmart:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
