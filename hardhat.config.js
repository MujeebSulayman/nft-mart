require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
};
