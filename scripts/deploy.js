require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  console.log('Deploying Nftmart to Sepolia...')

  try {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString())

    const Nftmart = await ethers.getContractFactory('Nftmart')
    console.log('Deploying Nftmart...')

    const nftmart = await Nftmart.deploy(500)
    await nftmart.deployed()
    console.log('Nftmart deployed at:', nftmart.address)

    const fs = require('fs')
    const contractsDir = __dirname + '/../contracts'

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir)
    }

    fs.writeFileSync(
      contractsDir + '/contractAddress.json',
      JSON.stringify({ Nftmart: nftmart.address }, undefined, 2)
    )

    console.log('Contract address saved to contractAddress.json')

    console.log("Waiting for Etherscan verification...")
    // Wait for 6 block confirmations
    await nftmart.deployTransaction.wait(6)
    
    // Verify the contract on Etherscan
    await hre.run("verify:verify", {
      address: nftmart.address,
      constructorArguments: [500],
    })
    
    console.log("Contract verified on Etherscan")
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
