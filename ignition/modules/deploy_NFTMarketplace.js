const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    console.log(NFTMarketplace);

    const nftMarketplace = await NFTMarketplace.deploy();
    console.log(nftMarketplace);

    await nftMarketplace.waitForDeployment();

    console.log("NFTMarketplace deployed to:", nftMarketplace.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
