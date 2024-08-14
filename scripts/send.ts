import {getUnnamedAccounts, network, ethers} from 'hardhat';
import {MyOFT} from '../typechain';
import {EndpointId} from '@layerzerolabs/lz-definitions';
import {MessagingFeeStruct, SendParamStruct} from '../typechain/src/Mon.sol/MyOFT';
import {parseUnits, zeroPad} from 'ethers/lib/utils';

const privateKey = process.env.DEPOLYER_KEY as string;

const provider = ethers.provider;

const destination_network = 'polygon';
const destination_oft_contract = ethers.utils.hexZeroPad('0x4A61A9eaDc7902D38aB3E819E428f0da108646C6', 32);

const recieptant = ethers.utils.hexZeroPad('0x4ade31Ee6009cB35427afEb784B59E881a459225', 32);

const amount = parseUnits('1', 18);
const min_amount = parseUnits('0.99', 18);

const getEID = (network: string) => {
	switch (network) {
		case 'mainnet':
			return 30101;
		case 'avalanche':
			return 30106;
		case 'arbitrum':
			return 30110;
		case 'polygon':
			return 30109;
		default:
			throw new Error(`UnSupported network ${network}`);
	}
};
async function main() {
	try {
		const signer = new ethers.Wallet(privateKey, provider);
		const account = await signer.getAddress();
		let balance = await signer.getBalance();
		console.log(`${network.name} address : ${account} with balance ${balance.toString()}`);

		let my_oft: MyOFT;
		const oft = await ethers.getContract('MyOFT');
		console.log(oft.address);
		my_oft = <MyOFT>await ethers.getContractAt('MyOFT', oft.address);

		const token = await my_oft.token();
		console.log(`Token  : ${token}`);
		const token_supply = await my_oft.totalSupply();
		console.log(`Token supply : ${token_supply.toString()}`);

		if (amount.gte(token_supply)) {
			const mint = await my_oft.connect(signer).mint(signer.address, amount);
			await mint.wait();

			console.log(`Minted : ${mint.hash}`);
			const token_supply = await my_oft.totalSupply();
			console.log(`Token supply : ${token_supply.toString()}`);
		}

		const EID = getEID(destination_network);

		const send_params: SendParamStruct = {
			dstEid: EID,
			to: recieptant,
			amountLD: amount,
			minAmountLD: min_amount,
			extraOptions: '0x000301001101000000000000000000000000000186a0',
			composeMsg: ethers.utils.arrayify('0x'),
			oftCmd: ethers.utils.arrayify('0x'),
		};

		// const en = await my_oft.connect(signer).enforcedOptions(EID, '1');
		// console.log(`Enforced ` + en );

		const fee = await my_oft.connect(signer).quoteSend(send_params, false);

		console.log(`Fee : ${fee.toString()}`);

		const message_fee: MessagingFeeStruct = {
			nativeFee: fee[0],
			lzTokenFee: fee[1],
		};
		const gas = await my_oft.connect(signer).estimateGas.send(send_params, message_fee, signer.address, {
			value: message_fee.nativeFee,
		});
		console.log(`Gas cost : ${gas.toString()}`);
		const tx = await my_oft.connect(signer).send(send_params, message_fee, signer.address, {
			gasLimit: gas,
			gasPrice: await provider.getGasPrice(),
			value: message_fee.nativeFee,
		});
		const res = await tx.wait();

		console.log(`Transaction hash : ${res.transactionHash}`);
	} catch (error) {
		console.log(error);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
