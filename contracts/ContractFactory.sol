// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Raffle} from "./Raffle.sol";
import {VRFCoordinatorV2Mock} from "./test/VRFCoordinatorV2Mock.sol";
import {HelperConfig} from "./HelperConfig.sol";

contract ContractFactory {
    uint96 private constant BASE_FEE = 250000000000000000; // 0.25 is this the premium in LINK?
    uint96 private constant GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas
    address private vrfCoordinatorV2;
    uint64 private subscriptionId;
    bytes32 private gasLane;
    uint256 private interval;
    uint256 private entranceFee;
    uint32 private callbackGasLimit;
    VRFCoordinatorV2Mock vrfMock;

    event Deployed(address raffleAddr, address mockAddr);

    function deploy() public {
        HelperConfig helperConfig = new HelperConfig();
        (vrfCoordinatorV2, subscriptionId, gasLane, interval, entranceFee, callbackGasLimit) =
            helperConfig.activeNetworkConfig();
        if (vrfCoordinatorV2 == address(0)) {
            vrfMock = new VRFCoordinatorV2Mock(BASE_FEE, GAS_PRICE_LINK);
            vrfCoordinatorV2 = address(vrfMock);
        }

        Raffle raffle = new Raffle(vrfCoordinatorV2, subscriptionId, gasLane, interval, entranceFee, callbackGasLimit);

        emit Deployed(address(raffle), address(vrfMock));
    }
}
