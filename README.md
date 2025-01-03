<p align="center">
  <img src="https://user-images.githubusercontent.com/26466516/107675802-36216b80-6c77-11eb-8db1-4d3407dc53d9.png" alt="Next.js and TypeScript">
</p>



<br>

# NFT Mart

NFT Mart is a decentralized marketplace for discovering, collecting, and selling extraordinary NFTs. Built with Next.js, Hardhat, and Ethers.js, this project provides a seamless experience for NFT enthusiasts and creators.

## Features

- Browse and explore a wide range of NFTs
- Create and mint your own NFTs
- Buy and sell NFTs using cryptocurrency
- Real-time bidding and auction system
- User-friendly interface with responsive design
- Secure wallet integration using Rainbow Kit
- Smart contract integration for NFT transactions

## Technologies Used

- Next.js 13
- React 18
- TypeScript
- Hardhat
- Ethers.js
- Tailwind CSS
- Redux Toolkit
- Rainbow Kit
- Framer Motion

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask or any Ethereum wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mujeebSulayman/nft-mart.git
   ```

2. Navigate to the project directory:
   ```
   cd nft-mart
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
   NEXT_PUBLIC_PROJECT_ID=your_project_id
   ```

### Running the Development Server

1. Start the Hardhat node:
   ```
   npx hardhat node
   ```

2. In a new terminal, run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.




## Smart Contracts

The main smart contract for this project is `Nftmart.sol`, which handles the creation, minting, and trading of NFTs. You can find it in the `contracts/` directory.

To deploy the smart contract:

1. Compile the contract:
   ```
   npx hardhat compile
   ```

2. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- OpenZeppelin for secure smart contract libraries
- Rainbow Kit for wallet integration
- Hardhat for Ethereum development environment