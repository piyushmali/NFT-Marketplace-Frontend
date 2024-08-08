const hre = require("hardhat");
// Import Hardhat Runtime Environment (HRE) to use Hardhat's tools

async function main() {
    // Define an asynchronous function named 'main'
    
    const [deployer] = await hre.ethers.getSigners();
    // Get the first account from the list of available signers (usually the deployer)
    
    console.log("Deploying contracts with the account:", deployer.address);
    // Log the address of the account that will deploy the contracts
    
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    // Get the contract factory for the NFTMarketplace contract (used to deploy instances of the contract)
    
    console.log(NFTMarketplace);
    // Log the NFTMarketplace contract factory object for debugging purposes
    
    const nftMarketplace = await NFTMarketplace.deploy();
    // Deploy the NFTMarketplace contract and store the contract instance in 'nftMarketplace'
    
    console.log(nftMarketplace);
    // Log the nftMarketplace contract instance for debugging purposes
    
    await nftMarketplace.waitForDeployment();
    // Wait for the NFTMarketplace contract deployment to complete
    
    console.log("NFTMarketplace deployed to:", nftMarketplace.address);
    // Log the address where the NFTMarketplace contract has been deployed
}

main()
    .then(() => process.exit(0))
    // If the 'main' function executes successfully, exit the process with code 0 (success)
    .catch((error) => {
        console.error(error);
        // If an error occurs, log the error to the console
        process.exit(1);
        // Exit the process with code 1 (error)
    });
