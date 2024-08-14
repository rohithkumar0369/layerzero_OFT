# Boilerplate for ethereum solidity smart contract development

## INSTALL

```bash
yarn
```

## TEST

- One using hardhat that can leverage hardhat-deploy to reuse deployment procedures and named accounts:

```bash
yarn test
```

## SCRIPTS

Here is the list of npm scripts you can execute:

Some of them relies on [./\_scripts.js](./_scripts.js) to allow parameterizing it via command line argument (have a look inside if you need modifications)
<br/><br/>

### `yarn prepare`

As a standard lifecycle npm script, it is executed automatically upon install. It generate config file and typechain to get you started with type safe contract interactions
<br/><br/>

### `yarn format` and `yarn format:fix`

These will format check your code. the `:fix` version will modifiy the files to match the requirement specified in `.prettierrc.`
<br/><br/>

### `yarn compile`

These will compile your contracts
<br/><br/>

### `yarn test [mocha args...]`

These will execute your tests using mocha. you can pass extra arguments to mocha
<br/><br/>

### `yarn coverage`

These will produce a coverage report in the `coverage/` folder
<br/><br/>

### `yarn gas`

These will produce a gas report for function used in the tests
<br/><br/>


### `yarn execute <network> <file.ts> [args...]`

This will execute the script `<file.ts>` against the specified network
<br/><br/>

### `yarn deploy <network> [args...]`

This will deploy the contract on the specified network.

Behind the scene it uses `hardhat deploy` command so you can append any argument for it
<br/><br/>

### `yarn export <network> <file.json>`

This will export the abi+address of deployed contract to `<file.json>`
<br/><br/>
