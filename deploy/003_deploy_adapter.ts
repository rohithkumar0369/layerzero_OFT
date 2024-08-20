import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {endPoint} from '../config/endPoints';
import {verifyContract} from './9999_verify_all_facets';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts, network} = hre;
	const {deploy} = deployments;

	const {deployer} = await getNamedAccounts();

	const my_token = await ethers.getContract('MyToken');
	const end_point = endPoint[network.name];
	const owner = deployer;

	await deploy('Adapter', {
		from: deployer,
		args: [my_token.address, end_point, owner],
		log: true,
		deterministicDeployment: true,
	});

	const Adapter = await ethers.getContract('Adapter');

	await verifyContract(hre, 'Adapter', {
		address: Adapter.address,
		args: [my_token.address, end_point, owner],
	});
};
export default func;
func.tags = ['Adapter'];
