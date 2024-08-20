import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';
import {endPoint} from '../config/endPoints';
import {EndpointId} from '@layerzerolabs/lz-definitions';
import {ethers} from 'hardhat';
import {MyOFT} from '../typechain';
import {verifyContract} from './9999_verify_all_facets';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts, network} = hre;
	const {deploy} = deployments;

	const {deployer} = await getNamedAccounts();

	const name = 'OFT Test Token';
	const symbol = 'T_OFT';
	const initial_supply = ethers.utils.parseUnits('100', 18);
	await deploy('MyToken', {
		from: deployer,
		args: [name, symbol, initial_supply, deployer],
		log: true,
		deterministicDeployment: true,
	});

	const my_token = await ethers.getContract('MyToken');

	await verifyContract(hre, 'MyToken', {
		address: my_token.address,
		args: [name, symbol, initial_supply, deployer],
	});
};
export default func;
func.tags = ['MyToken'];
