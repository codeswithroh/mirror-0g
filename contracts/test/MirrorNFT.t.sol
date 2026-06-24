// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MirrorNFT.sol";

contract MirrorNFTTest is Test {
    MirrorNFT public mirror;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        mirror = new MirrorNFT();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    function test_MintPersona() public {
        vm.prank(alice);
        uint256 id = mirror.mintPersona(
            "Alice AI",
            "My digital twin",
            bytes32(uint256(1)),
            0,
            "ipfs://Qm..."
        );
        assertEq(id, 0);
        assertEq(mirror.ownerOf(0), alice);
        (string memory name,,,,,, bool active) = mirror.personas(0);
        assertEq(name, "Alice AI");
        assertTrue(active);
    }

    function test_FreePersonaAccess() public {
        vm.prank(alice);
        mirror.mintPersona("Alice AI", "Bio", bytes32(uint256(1)), 0, "ipfs://Qm...");
        assertTrue(mirror.hasAccess(0, bob));
    }

    function test_PaidPersonaAccess() public {
        vm.prank(alice);
        mirror.mintPersona("Alice AI", "Bio", bytes32(uint256(1)), 0.01 ether, "ipfs://Qm...");
        assertFalse(mirror.hasAccess(0, bob));

        vm.prank(bob);
        mirror.purchaseAccess{value: 0.01 ether}(0);
        assertTrue(mirror.hasAccess(0, bob));
    }

    function test_OwnerAlwaysHasAccess() public {
        vm.prank(alice);
        mirror.mintPersona("Alice AI", "Bio", bytes32(uint256(1)), 1 ether, "ipfs://Qm...");
        assertTrue(mirror.hasAccess(0, alice));
    }

    function test_UpdateStorageRoot() public {
        vm.prank(alice);
        mirror.mintPersona("Alice AI", "Bio", bytes32(uint256(1)), 0, "ipfs://Qm...");

        bytes32 newHash = bytes32(uint256(999));
        vm.prank(alice);
        mirror.updateStorageRoot(0, newHash);

        (, , bytes32 root,,,,) = mirror.personas(0);
        assertEq(root, newHash);
    }

    function test_RevertIfNotOwnerUpdatesRoot() public {
        vm.prank(alice);
        mirror.mintPersona("Alice AI", "Bio", bytes32(uint256(1)), 0, "ipfs://Qm...");

        vm.prank(bob);
        vm.expectRevert(MirrorNFT.NotPersonaOwner.selector);
        mirror.updateStorageRoot(0, bytes32(uint256(2)));
    }
}
