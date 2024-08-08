// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// Import the ERC721 interface from OpenZeppelin
import "@openzeppelin/contracts/access/Ownable.sol";
// Import the Ownable contract from OpenZeppelin for ownership management

contract NFTMarketplace is Ownable {
    // Declare a contract named NFTMarketplace that inherits from Ownable

    struct Listing {
        uint256 price;
        address seller;
    }
    // Define a struct named Listing to store price and seller address for an NFT

    struct Offer {
        uint256 offerPrice;
        address offerer;
    }
    // Define a struct named Offer to store offer price and offerer address for an NFT

    mapping(address => mapping(uint256 => Listing)) public listings;
    // Create a nested mapping to store listings for each NFT (contract address and token ID)

    mapping(address => mapping(uint256 => Offer)) public offers;
    // Create a nested mapping to store offers for each NFT (contract address and token ID)

    event NFTListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price,
        address seller
    );
    // Event to be emitted when an NFT is listed for sale

    event NFTBought(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price,
        address buyer
    );
    // Event to be emitted when an NFT is bought

    event OfferMade(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 offerPrice,
        address offerer
    );
    // Event to be emitted when an offer is made for an NFT

    event OfferAccepted(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 offerPrice,
        address buyer
    );
    // Event to be emitted when an offer is accepted for an NFT

    event ListingCancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller
    );
    // Event to be emitted when a listing is cancelled

    constructor() Ownable(msg.sender) {}
    // Constructor function to initialize the contract with the owner

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        // Function to list an NFT for sale

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        // Transfer the NFT from the seller to the marketplace contract

        listings[nftContract][tokenId] = Listing(price, msg.sender);
        // Create a new listing with the given price and seller address

        emit NFTListed(nftContract, tokenId, price, msg.sender);
        // Emit the NFTListed event
    }

    function buyNFT(address nftContract, uint256 tokenId) external payable {
        // Function to buy an NFT

        Listing memory listing = listings[nftContract][tokenId];
        // Retrieve the listing for the given NFT

        require(msg.value >= listing.price, "Not enough funds to buy NFT");
        // Ensure the buyer has sent enough ether to buy the NFT

        payable(listing.seller).transfer(listing.price);
        // Transfer the payment to the seller

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        // Transfer the NFT from the marketplace to the buyer

        delete listings[nftContract][tokenId];
        // Remove the listing

        emit NFTBought(nftContract, tokenId, listing.price, msg.sender);
        // Emit the NFTBought event
    }

    function makeOffer(address nftContract, uint256 tokenId) external payable {
        // Function to make an offer for an NFT

        offers[nftContract][tokenId] = Offer(msg.value, msg.sender);
        // Create a new offer with the given offer price and offerer address

        emit OfferMade(nftContract, tokenId, msg.value, msg.sender);
        // Emit the OfferMade event
    }

    function acceptOffer(address nftContract, uint256 tokenId) external {
        // Function to accept an offer for an NFT

        Offer memory offer = offers[nftContract][tokenId];
        // Retrieve the offer for the given NFT

        Listing memory listing = listings[nftContract][tokenId];
        // Retrieve the listing for the given NFT

        require(msg.sender == listing.seller, "Only seller can accept offer");
        // Ensure that only the seller can accept the offer

        payable(listing.seller).transfer(offer.offerPrice);
        // Transfer the offer price to the seller

        IERC721(nftContract).transferFrom(address(this), offer.offerer, tokenId);
        // Transfer the NFT from the marketplace to the offerer

        delete offers[nftContract][tokenId];
        // Remove the offer

        delete listings[nftContract][tokenId];
        // Remove the listing

        emit OfferAccepted(nftContract, tokenId, offer.offerPrice, offer.offerer);
        // Emit the OfferAccepted event
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        // Function to cancel a listing for an NFT

        Listing memory listing = listings[nftContract][tokenId];
        // Retrieve the listing for the given NFT

        require(msg.sender == listing.seller, "Only seller can cancel listing");
        // Ensure that only the seller can cancel the listing

        IERC721(nftContract).transferFrom(address(this), listing.seller, tokenId);
        // Transfer the NFT from the marketplace back to the seller

        delete listings[nftContract][tokenId];
        // Remove the listing

        emit ListingCancelled(nftContract, tokenId, listing.seller);
        // Emit the ListingCancelled event
    }