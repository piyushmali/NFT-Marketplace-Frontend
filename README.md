# NFT Marketplace

[Live Deployment](https://nft-marketplace-frontend-kappa.vercel.app/)

This is a decentralized NFT marketplace built using Hardhat for smart contract development and Next.js for the frontend. The platform enables users to mint, buy, and sell NFTs securely on the Ethereum blockchain.

## Features

- **Minting NFTs**: Users can create their own NFTs directly from the platform.
- **Buying/Selling NFTs**: Users can list their NFTs for sale and purchase NFTs listed by others.
- **Blockchain Integration**: Secure and transparent transactions powered by Ethereum.

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Hardhat**
- **MetaMask** (or another Ethereum wallet)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/piyushmali/NFT-Marketplace-Frontend.git
    cd NFT-Marketplace-Frontend
    ```

2. **Install frontend dependencies:**
    ```bash
    cd client
    npm install
    ```

3. **Install backend dependencies:**
    ```bash
    npm install
    ```

4. **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Populate it with necessary environment variables (e.g., Alchemy API URL, Private Key).

### Deployment

1. **Compile the contracts:**
    ```bash
    npx hardhat compile
    ```

2. **Deploy the contracts:**
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Token.js --network sepolia
    ```

3. **Run the frontend:**
    ```bash
    cd client
    npm run dev
    ```

### Running Tests

- **Run smart contract tests:**
    ```bash
    npx hardhat test
    ```

## Usage

- Open the frontend in your browser at `http://localhost:3000`.
- Connect your MetaMask wallet.
- Mint, buy, and sell NFTs directly from the application.

## License

This project is licensed under the MIT License.
