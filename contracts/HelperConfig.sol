// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract HelperConfig {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        address vrfCoordinatorV2;
        uint64 subscriptionId;
        bytes32 gasLane;
        uint256 interval;
        uint256 entranceFee;
        uint32 callbackGasLimit;
    }

    constructor() {
        if (block.chainid == 31337) {
            activeNetworkConfig = getLocalNetworkConfig();
        } else {
            activeNetworkConfig = getSepoliaNetworkConfig();
        }
    }

    function getLocalNetworkConfig() private pure returns (NetworkConfig memory) {
        return NetworkConfig({
            vrfCoordinatorV2: address(0),
            subscriptionId: 1,
            gasLane: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c, // keyHash
            interval: 30,
            entranceFee: 0.01 ether,
            callbackGasLimit: 500000
        });
    }

    function getSepoliaNetworkConfig() private pure returns (NetworkConfig memory) {
        return NetworkConfig({
            vrfCoordinatorV2: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
            subscriptionId: 588,
            gasLane: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c, // keyHash
            interval: 30,
            entranceFee: 0.01 ether,
            callbackGasLimit: 500000
        });
    }
}
