module.exports = async ({ ethers, getNamedAccounts }) => {
  // Export an asynchronous function that deploys the MyNFT contract

  const { deployer } = await getNamedAccounts();
  // Get the account named 'deployer' from the named accounts

  const MyNFT = await ethers.getContractFactory("MyNFT", deployer);
  // Get the contract factory for the MyNFT contract using the deployer account

  console.log("Deploying MyNFT...");
  // Log a message indicating the deployment process has started

  const myNFT = await MyNFT.deploy();
  // Deploy the MyNFT contract and store the contract instance in 'myNFT'

  console.log("Waiting for deployment to be mined...");
  // Log a message indicating that the script is waiting for the contract to be mined (deployed)

  await myNFT.deployed();
  // Wait until the MyNFT contract is fully deployed and mined

  console.log("MyNFT deployed to:", myNFT.address);
  // Log the address where the MyNFT contract has been deployed
};
