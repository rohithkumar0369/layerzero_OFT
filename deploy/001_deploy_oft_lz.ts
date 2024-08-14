import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';
import {endPoint} from '../config/endPoints';
import {EndpointId} from '@layerzerolabs/lz-definitions';
import {ethers} from 'hardhat';
import {MyOFT} from '../typechain';
import { verifyContract } from './9999_verify_all_facets';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts, network} = hre;
	const {deploy} = deployments;

	const {deployer, simpleERC20Beneficiary} = await getNamedAccounts();

	if (!endPoint[network.name]) {
		console.log(`No layerzero endpoint CONFIG set for ${network.name}. Skipping...`);
		return;
	}

	const name = 'My Omni-Fungible Token';
	const symbol = 'MOFT';
	const delegate = deployer;
	const end_point = endPoint[network.name];

	await deploy('MyOFT', {
		from: deployer,
		args: [name, symbol, end_point, delegate],
		log: true,
		deterministicDeployment: true,
	});

	const oft = await ethers.getContract('MyOFT');

	await verifyContract(hre, 'MyOFT', {
		address: oft.address,
		args: [name, symbol, end_point, delegate],
	});

};
export default func;
func.tags = ['MyOFT'];
