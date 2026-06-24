// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MirrorNFT.sol";

contract DeployMirror is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        MirrorNFT mirror = new MirrorNFT();
        console.log("MirrorNFT deployed at:", address(mirror));

        vm.stopBroadcast();
    }
}
