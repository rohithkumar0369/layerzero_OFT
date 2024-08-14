# LayerZero OFT contract with example scripts

### step by step guide

1.  Install the package using `yarn`.
2.  Compile the contract in `src/`.
3.  Deploy the contract
4.  execute the example scripts to make OFT cross chain transfers
    => 1.execute the `setPeer` before transfering OFT , you can connect your OFT deployment to different chains by calling `setPeer`.
    	The function takes 2 arguments: `_eid`, the endpoint ID for the destination chain that the other OFT contract lives on, and `_peer`, the destination 	OFT's contract address in bytes32 format.
    
    => 2.fetch an estimation gas fee , we can call the `quoteSend` function to return an estimate from the Endpoint contract.
   	SendParam: what parameters should be used for the send call?
    	`/**
	  * @dev Struct representing token parameters for the OFT send() operation.
	  */
	  struct SendParam {
 	  uint32 dstEid; // Destination endpoint ID.
 	  bytes32 to; // Recipient address.
 	  uint256 amountLD; // Amount to send in local decimals.
 	  uint256 minAmountLD; // Minimum amount to send in local decimals.
 	  bytes extraOptions; // Additional options supplied by the caller to be used in the LayerZero message.
 	  bytes composeMsg; // The composed message for the send() operation.
 	  bytes oftCmd; // The OFT command to be executed, unused in default OFT implementations.

    	_payInLzToken: what token will be used to pay for the transaction?.
     
    => 3. execute the `send` function with 3 params
   		1.SendParam: what parameters should be used for the send call?
   		2._fee: what token will be used to pay for the transaction?
                3._refundAddress: If the transaction fails on the source chain, where should funds be refunded?

## INSTALL

```bash
yarn
```

### `yarn compile`

These will compile your contracts
<br/><br/>

## TEST

-   One using hardhat that can leverage hardhat-deploy to reuse deployment procedures and named accounts:

```bash
yarn test
```

### `yarn test [mocha args...]`

These will execute your tests using mocha. you can pass extra arguments to mocha
<br/><br/>

### `yarn deploy <network> [args...]`

exmaple -  For Arbitrum network .

#### `yarn deploy --network arbitrum`

This will deploy the contract on the specified network.

Behind the scene it uses `hardhat deploy` command so you can append any argument for it
<br/><br/>

## SCRIPTS

### `yarn execute <network> <file.ts> [args...]`

This will execute the script `<file.ts>` against the specified network
<br/><br/>

### `yarn export <network> <file.json>`

This will export the abi+address of deployed contract to `<file.json>`
<br/><br/>

### `yarn coverage`

These will produce a coverage report in the `coverage/` folder
<br/><br/>

### `yarn gas`

These will produce a gas report for function used in the tests
<br/><br/>
