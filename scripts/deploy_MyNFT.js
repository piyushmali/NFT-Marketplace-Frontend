module.exports = async ({ ethers, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    const MyNFT = await ethers.getContractFactory("MyNFT", deployer);
    console.log("Deploying MyNFT...");
  
    const myNFT = await MyNFT.deploy();
    console.log("Waiting for deployment to be mined...");
    await myNFT.deployed();
  
    console.log("MyNFT deployed to:", myNFT.address);
  };
  