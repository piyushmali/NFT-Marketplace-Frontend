// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        uint256 price;
        address seller;
    }

    struct Offer {
        uint256 offerPrice;
        address offerer;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => Offer)) public offers;

    event NFTListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price,
        address seller
    );
    event NFTBought(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price,
        address buyer
    );
    event OfferMade(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 offerPrice,
        address offerer
    );
    event OfferAccepted(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 offerPrice,
        address buyer
    );
    event ListingCancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller
    );

    constructor() Ownable(msg.sender) {}

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        listings[nftContract][tokenId] = Listing(price, msg.sender);
        emit NFTListed(nftContract, tokenId, price, msg.sender);
    }

    function buyNFT(address nftContract, uint256 tokenId) external payable {
        Listing memory listing = listings[nftContract][tokenId];
        require(msg.value >= listing.price, "Not enough funds to buy NFT");

        payable(listing.seller).transfer(listing.price);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        delete listings[nftContract][tokenId];
        emit NFTBought(nftContract, tokenId, listing.price, msg.sender);
    }

    function makeOffer(address nftContract, uint256 tokenId) external payable {
        offers[nftContract][tokenId] = Offer(msg.value, msg.sender);
        emit OfferMade(nftContract, tokenId, msg.value, msg.sender);
    }

    function acceptOffer(address nftContract, uint256 tokenId) external {
        Offer memory offer = offers[nftContract][tokenId];
        Listing memory listing = listings[nftContract][tokenId];
        require(msg.sender == listing.seller, "Only seller can accept offer");

        payable(listing.seller).transfer(offer.offerPrice);
        IERC721(nftContract).transferFrom(
            address(this),
            offer.offerer,
            tokenId
        );

        delete offers[nftContract][tokenId];
        delete listings[nftContract][tokenId];
        emit OfferAccepted(
            nftContract,
            tokenId,
            offer.offerPrice,
            offer.offerer
        );
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing memory listing = listings[nftContract][tokenId];
        require(msg.sender == listing.seller, "Only seller can cancel listing");

        IERC721(nftContract).transferFrom(
            address(this),
            listing.seller,
            tokenId
        );
        delete listings[nftContract][tokenId];
        emit ListingCancelled(nftContract, tokenId, listing.seller);
    }
}
