// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { OFTAdapter } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTAdapter.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Adapter is OFTAdapter {
    constructor(
        address _token,           // Address of the existing ERC20 token
        address _layerZeroEndpoint, // Address of the LayerZero endpoint for the current chain
        address _owner              // Owner of the contract, used for administrative purposes
    ) OFTAdapter(_token, _layerZeroEndpoint, _owner) Ownable(_owner) {

	}
}
