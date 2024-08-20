// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20 , Ownable {
	constructor(string memory name, string memory symbol, uint256 initialSupply , address _owner) ERC20(name, symbol) Ownable(_owner) {
		// Mint 100 tokens to msg.sender
		// Similar to how
		// 1 dollar = 100 cents
		// 1 token = 1 * (10 ** decimals)
		_mint(_owner, initialSupply);
	}

	// Mint new tokens - can only be called by the owner
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Burn tokens from the caller's account
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
