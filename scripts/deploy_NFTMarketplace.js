const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");

    const nftMarketplace = await NFTMarketplace.deploy();

    // Debugging: Check if deployTransaction is available
    console.log("Deploy Transaction:", nftMarketplace.deployTransaction);

    await nftMarketplace.deployTransaction.wait();

    console.log("NFTMarketplace deployed to:", nftMarketplace.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
