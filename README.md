# NFT Marketplace

A decentralized marketplace for trading ERC721 NFTs.

## Requirements

- Node.js
- Hardhat
- dotenv

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/piyushmali/NFT-marketplace.git
   cd NFT-marketplace
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   AMOY_RPC_URL=<Your_Amoy_RPC_URL>
   PRIVATE_KEY=<Your_Private_Key>
   ```

## Compile Contracts

```sh
npx hardhat compile
```

## Deploy Contracts

```sh
npx hardhat run scripts/deploy_NFTMarketplace.js --network amoy
```

## Test Contracts

```sh
npx hardhat test
```

## Project Structure

- `contracts/`: Solidity contracts
- `scripts/`: Deployment scripts
- `test/`: Test scripts

## License

MIT
