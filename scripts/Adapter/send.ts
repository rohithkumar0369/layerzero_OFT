import {network, ethers} from 'hardhat';
import {ERC20__factory, MyOFT, OFTAdapter__factory} from '../../typechain';
import {MessagingFeeStruct, SendParamStruct} from '../../typechain/src/Mon.sol/MyOFT';
import {parseUnits} from 'ethers/lib/utils';

const privateKey = process.env.DEPOLYER_KEY as string;


const recieptant_privateKey = process.env.PRIVATE_KEY as string;

const provider = ethers.provider;

const destination_network = 'polygon';
const destination_oft_contract = ethers.utils.hexZeroPad('0x6c4ef945552FAb67813dE5dbD497a33882E0cEc7', 32);

const tokenAddress = '0xd59d5827262EbE4cCD262915136C95751d7ef935'

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

		const recieptant__signer = new ethers.Wallet(recieptant_privateKey, provider);
		const recieptant_account = await recieptant__signer.getAddress();

		let balance = await signer.getBalance();
		console.log(`${network.name} address : ${account} with balance ${balance.toString()}`);

		balance = await recieptant__signer.getBalance();
		console.log(`${network.name} address : ${recieptant_account} with balance ${balance.toString()}`);

		const adapter_address = (await ethers.getContract('Adapter')).address;

		const adapter = OFTAdapter__factory.connect(adapter_address, signer);

		//approve before sending

		const token = ERC20__factory.connect(tokenAddress, signer);

		const allowance = await token.allowance(signer.address,adapter_address)

		console.log(`allowance : ${allowance}`);

		if(allowance.lt(amount)){
			const tx = await token.approve(adapter_address, amount);
			const res = await tx.wait();
			console.log('Approval successful',res.transactionHash);
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

		console.log({send_params})

		const fee = await adapter.quoteSend(send_params, false);

		console.log(`Fee : ${fee.toString()}`);

		const message_fee: MessagingFeeStruct = {
			nativeFee: fee[0],
			lzTokenFee: fee[1],
		};

		console.log({message_fee})

		// const gas = await adapter.estimateGas.send(send_params, message_fee, signer.address, {
		// 	value: message_fee.nativeFee,
		// });
		// console.log(`Gas cost : ${gas.toString()}`);

		// const tx = await adapter.send(send_params, message_fee, signer.address, {
		// 	gasLimit: gas,
		// 	gasPrice: await provider.getGasPrice(),
		// 	value: message_fee.nativeFee,
		// });
		// const res = await tx.wait();

		// console.log(`Transaction hash : ${res.transactionHash}`);
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
