// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Persona NFT minted when a user creates their AI mirror on 0G.
/// @dev tokenURI points to a JSON blob stored on 0G Storage.
///      The JSON includes the 0G storage root hash of the persona's training data.
contract MirrorNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    struct Persona {
        string name;
        string description;
        bytes32 storageRootHash; // 0G Storage root hash of persona data
        uint256 accessFee;       // Wei per chat session (0 = free)
        address creator;
        uint256 createdAt;
        bool active;
    }

    mapping(uint256 => Persona) public personas;
    mapping(address => uint256[]) public creatorPersonas;

    // tracks who has paid for access to a persona (tokenId => user => expiry timestamp)
    mapping(uint256 => mapping(address => uint256)) public accessExpiry;

    uint256 public mintFee = 0;
    uint256 public platformFeePercent = 5; // 5% platform fee on access payments

    event PersonaMinted(uint256 indexed tokenId, address indexed creator, string name, bytes32 storageRootHash);
    event AccessGranted(uint256 indexed tokenId, address indexed user, uint256 expiry);
    event StorageUpdated(uint256 indexed tokenId, bytes32 newRootHash);
    event AccessFeeUpdated(uint256 indexed tokenId, uint256 newFee);

    error NotPersonaOwner();
    error InsufficientPayment();
    error PersonaNotActive();
    error AlreadyHasAccess();

    constructor() ERC721("Mirror", "MIRROR") Ownable(msg.sender) {}

    /// @notice Mint a new AI persona NFT.
    /// @param name Display name for the persona.
    /// @param description Short bio shown on the explore page.
    /// @param storageRootHash Root hash of the 0G Storage merkle tree for this persona's data.
    /// @param accessFee Wei cost per 24-hour access window (0 = public).
    /// @param metadataURI IPFS/0G URI of the NFT metadata JSON.
    function mintPersona(
        string calldata name,
        string calldata description,
        bytes32 storageRootHash,
        uint256 accessFee,
        string calldata metadataURI
    ) external payable returns (uint256) {
        if (msg.value < mintFee) revert InsufficientPayment();

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        personas[tokenId] = Persona({
            name: name,
            description: description,
            storageRootHash: storageRootHash,
            accessFee: accessFee,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        creatorPersonas[msg.sender].push(tokenId);

        emit PersonaMinted(tokenId, msg.sender, name, storageRootHash);
        return tokenId;
    }

    /// @notice Pay to access a persona for 24 hours.
    function purchaseAccess(uint256 tokenId) external payable nonReentrant {
        Persona storage p = personas[tokenId];
        if (!p.active) revert PersonaNotActive();
        if (msg.value < p.accessFee) revert InsufficientPayment();

        uint256 expiry = block.timestamp + 1 days;
        accessExpiry[tokenId][msg.sender] = expiry;

        // Split payment: creator gets (100 - platformFeePercent)%, platform gets the rest
        if (msg.value > 0) {
            uint256 platformCut = (msg.value * platformFeePercent) / 100;
            uint256 creatorCut = msg.value - platformCut;
            payable(p.creator).transfer(creatorCut);
        }

        emit AccessGranted(tokenId, msg.sender, expiry);
    }

    /// @notice Check if an address can chat with a persona.
    function hasAccess(uint256 tokenId, address user) external view returns (bool) {
        Persona memory p = personas[tokenId];
        if (!p.active) return false;
        if (p.accessFee == 0) return true;
        if (ownerOf(tokenId) == user) return true;
        if (p.creator == user) return true;
        return accessExpiry[tokenId][user] > block.timestamp;
    }

    /// @notice Update the 0G storage root hash after adding more training data.
    function updateStorageRoot(uint256 tokenId, bytes32 newRootHash) external {
        if (ownerOf(tokenId) != msg.sender) revert NotPersonaOwner();
        personas[tokenId].storageRootHash = newRootHash;
        emit StorageUpdated(tokenId, newRootHash);
    }

    /// @notice Change the access fee for your persona.
    function setAccessFee(uint256 tokenId, uint256 newFee) external {
        if (ownerOf(tokenId) != msg.sender) revert NotPersonaOwner();
        personas[tokenId].accessFee = newFee;
        emit AccessFeeUpdated(tokenId, newFee);
    }

    /// @notice Toggle persona active state.
    function setActive(uint256 tokenId, bool active) external {
        if (ownerOf(tokenId) != msg.sender) revert NotPersonaOwner();
        personas[tokenId].active = active;
    }

    function getCreatorPersonas(address creator) external view returns (uint256[] memory) {
        return creatorPersonas[creator];
    }

    function totalPersonas() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function withdrawPlatformFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
