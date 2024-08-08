// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Import the ERC721 standard with URI storage extension from OpenZeppelin
import "@openzeppelin/contracts/access/Ownable.sol";

// Import the Ownable contract from OpenZeppelin for ownership management

contract MyNFT is ERC721URIStorage, Ownable {
    // Declare a contract named MyNFT that inherits from ERC721URIStorage and Ownable

    uint256 public tokenCounter;

    // State variable to keep track of the number of tokens

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        // Constructor function to initialize the contract
        // Set the name and symbol for the NFT collection as "MyNFT" and "MNFT"
        // Set the owner of the contract to the deployer's address

        tokenCounter = 0;
        // Initialize the token counter to 0
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        // Function to create a new NFT with a given URI

        uint256 newTokenId = tokenCounter;
        // Assign the current token counter value as the new token ID

        _safeMint(msg.sender, newTokenId);
        // Mint a new token safely and assign it to the sender's address

        _setTokenURI(newTokenId, tokenURI);
        // Set the token URI for the newly minted token

        tokenCounter++;
        // Increment the token counter for the next token ID

        return newTokenId;
        // Return the new token ID
    }
}
