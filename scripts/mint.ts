import {network, ethers} from 'hardhat';
import {MyOFT} from '../typechain';
import {parseUnits} from 'ethers/lib/utils';

const privateKey = process.env.DEPOLYER_KEY as string;

const provider = ethers.provider;

const amount = parseUnits('1', 18);

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

		const mint = await my_oft.connect(signer).mint(signer.address, amount);
		const res = await mint.wait();

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
