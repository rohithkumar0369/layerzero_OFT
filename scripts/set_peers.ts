import {network, ethers} from 'hardhat';
import {MyOFT} from '../typechain';

const privateKey = process.env.DEPOLYER_KEY as string;

const provider = ethers.provider;

const destination_network = 'polygon';
const destination_oft_contract = ethers.utils.hexZeroPad('0x4A61A9eaDc7902D38aB3E819E428f0da108646C6', 32);
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

		const EID = getEID(destination_network);
		const isPeer = await my_oft.connect(signer).isPeer(EID, destination_oft_contract);
		if (isPeer) {
			console.log(`Peer already set to ${destination_oft_contract} `);
			return;
		}
		const gas = await my_oft.connect(signer).estimateGas.setPeer(EID, destination_oft_contract);
		console.log(`Gas required: ${gas.toString()}`);
		const tx = await my_oft.connect(signer).setPeer(EID, destination_oft_contract, {
			gasLimit: gas,
			gasPrice: await provider.getGasPrice(),
		});
		const res = await tx.wait();
		console.log(`Transaction hash: ${res.transactionHash}`);
		console.log(`Peer set to ${destination_oft_contract} `);
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
