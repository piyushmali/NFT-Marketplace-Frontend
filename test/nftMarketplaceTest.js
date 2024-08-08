const { expect } = require("chai");
// Import the Chai assertion library for writing test assertions
const { ethers } = require("hardhat");
// Import the ethers library from Hardhat for interacting with Ethereum

describe("NFTMarketplace", function () {
    // Define a test suite named "NFTMarketplace"
    
    let MyNFT, myNFT, NFTMarketplace, nftMarketplace, owner, addr1, addr2;
    // Declare variables for contracts and signers

    beforeEach(async function () {
        // Before each test case, run the following setup code
        
        MyNFT = await ethers.getContractFactory("MyNFT");
        // Get the contract factory for the MyNFT contract
        
        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        // Get the contract factory for the NFTMarketplace contract

        [owner, addr1, addr2] = await ethers.getSigners();
        // Get the list of signers (accounts) and assign them to variables
        
        myNFT = await MyNFT.deploy();
        // Deploy the MyNFT contract and assign it to the 'myNFT' variable
        await myNFT.deployed();
        // Wait for the deployment transaction to be mined
        
        nftMarketplace = await NFTMarketplace.deploy();
        // Deploy the NFTMarketplace contract and assign it to the 'nftMarketplace' variable
        await nftMarketplace.deployed();
        // Wait for the deployment transaction to be mined

        console.log("MyNFT deployed to:", myNFT.address);
        console.log("NFTMarketplace deployed to:", nftMarketplace.address);
        // Log the addresses of the deployed contracts for debugging
    });

    it("Should list an NFT", async function () {
        // Test case to check if an NFT can be listed on the marketplace
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        // Define the token URI and price for the NFT

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT

        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        const listing = await nftMarketplace.listings(myNFT.address, tokenId);
        // Retrieve the listing details from the marketplace
        expect(listing.price).to.equal(price);
        // Check that the price matches the expected price
        expect(listing.seller).to.equal(owner.address);
        // Check that the seller address matches the expected owner address
    });

    it("Should allow a user to buy an NFT", async function () {
        // Test case to check if a user can buy an NFT
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        await nftMarketplace.connect(addr1).buyNFT(myNFT.address, tokenId, { value: price });
        // Buy the NFT using addr1 with the correct price

        const newOwner = await myNFT.ownerOf(tokenId);
        // Check the current owner of the NFT
        expect(newOwner).to.equal(addr1.address);
        // Verify that the new owner is addr1
    });

    it("Should allow a user to make an offer on an NFT", async function () {
        // Test case to check if a user can make an offer on an NFT
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        const offerPrice = ethers.parseEther("0.8");
        await nftMarketplace.connect(addr1).makeOffer(myNFT.address, tokenId, { value: offerPrice });
        // Make an offer on the NFT using addr1 with a specified offer price

        const offer = await nftMarketplace.offers(myNFT.address, tokenId);
        // Retrieve the offer details from the marketplace
        expect(offer.offerPrice).to.equal(offerPrice);
        // Check that the offer price matches the expected offer price
        expect(offer.offerer).to.equal(addr1.address);
        // Check that the offerer address matches addr1
    });

    it("Should allow the owner to accept an offer", async function () {
        // Test case to check if the owner can accept an offer on an NFT
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        const offerPrice = ethers.parseEther("0.8");
        await nftMarketplace.connect(addr1).makeOffer(myNFT.address, tokenId, { value: offerPrice });
        // Make an offer on the NFT using addr1 with a specified offer price

        await nftMarketplace.connect(owner).acceptOffer(myNFT.address, tokenId);
        // Accept the offer on the NFT using the owner

        const newOwner = await myNFT.ownerOf(tokenId);
        // Check the current owner of the NFT
        expect(newOwner).to.equal(addr1.address);
        // Verify that the new owner is addr1
    });

    it("Should allow the owner to cancel a listing", async function () {
        // Test case to check if the owner can cancel a listing
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        await nftMarketplace.connect(owner).cancelListing(myNFT.address, tokenId);
        // Cancel the listing of the NFT

        const listing = await nftMarketplace.listings(myNFT.address, tokenId);
        // Retrieve the listing details from the marketplace
        expect(listing.price).to.equal(0);
        // Verify that the price is set to 0 (indicating cancellation)
        expect(listing.seller).to.equal(ethers.constants.AddressZero);
        // Verify that the seller address is set to the zero address (indicating cancellation)
    });

    it("Should fail to buy an NFT with insufficient funds", async function () {
        // Test case to check if buying an NFT with insufficient funds fails
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        const lowPrice = ethers.parseEther("0.5");
        await expect(
            nftMarketplace.connect(addr1).buyNFT(myNFT.address, tokenId, { value: lowPrice })
        ).to.be.revertedWith("Not enough funds to buy NFT");
        // Attempt to buy the NFT with insufficient funds and expect the transaction to revert
    });

    it("Should fail to make an offer without sending ether", async function () {
        // Test case to check if making an offer without sending ether fails
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        await expect(
            nftMarketplace.connect(addr1).makeOffer(myNFT.address, tokenId)
        ).to.be.revertedWith("Offer must include ether");
        // Attempt to make an offer without sending ether and expect the transaction to revert
    });

    it("Should fail to accept an offer if not the seller", async function () {
        // Test case to check if a non-seller cannot accept an offer
        
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");

        const tx = await myNFT.createNFT(tokenURI);
        // Create a new NFT with the specified token URI
        const receipt = await tx.wait();
        // Wait for the transaction to be mined
        const tokenId = receipt.events[0].args[0].toString();
        // Get the token ID from the transaction receipt

        await myNFT.connect(owner).approve(nftMarketplace.address, tokenId);
        // Approve the NFTMarketplace contract to transfer the NFT
        await nftMarketplace.connect(owner).listNFT(myNFT.address, tokenId, price);
        // List the NFT on the marketplace with the specified price

        const offerPrice = ethers.parseEther("0.8");
        await nftMarketplace.connect(addr1).makeOffer(myNFT.address, tokenId, { value: offerPrice });
        // Make an offer on the NFT using addr1 with a specified offer price

        await expect(
            nftMarketplace.connect(addr2).acceptOffer(myNFT.address, tokenId)
        ).to.be.revertedWith("Only seller can accept offer");
        // Attempt to accept the offer using a non-seller account and expect the transaction to revert
    });
});
