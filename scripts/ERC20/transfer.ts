import {network, ethers} from 'hardhat';
import {MyOFT} from '../../typechain';
import {MessagingFeeStruct, SendParamStruct} from '../../typechain/src/Mon.sol/MyOFT';
import {parseUnits} from 'ethers/lib/utils';
import {MyToken__factory} from '../../typechain/factories/src/MyToken__factory';

const privateKey = process.env.DEPOLYER_KEY as string;
const provider = ethers.provider;

const amount = parseUnits('5', 18);
const amount2 = parseUnits('2', 18);
const recipient = '0x4ade31Ee6009cB35427afEb784B59E881a459225';

async function main() {
	try {
		const signer = new ethers.Wallet(privateKey, provider);
		const account = await signer.getAddress();
		let balance = await signer.getBalance();
		console.log(`${network.name} address : ${account} with balance ${balance.toString()}`);

		const tokenAddress = (await ethers.getContract('MyToken')).address;

		const token = MyToken__factory.connect(tokenAddress, signer);

		const totalSupply = await token.totalSupply();

		console.log(`totalSupply : ${totalSupply}`);

		let owner = await token.owner();

		console.log(`owner of token : ${owner}`);

		let token_balance = await token.balanceOf(signer.address);

		console.log(`token_balance of signer : ${token_balance}`);

		const mint = await token.mint(signer.address, amount);

		await mint.wait();

		token_balance = await token.balanceOf(signer.address);

		console.log(`token_balance of signer : ${token_balance}`);

		token_balance = await token.balanceOf(recipient);

		console.log(`token_balance of recipient : ${token_balance}`);

		const transfer = await token.transfer(recipient, amount2);

		await transfer.wait();

		token_balance = await token.balanceOf(recipient);

		console.log(`token_balance of recipient : ${token_balance}`);

		const burn = await token.burn(amount2);

		await burn.wait();

		token_balance = await token.balanceOf(signer.address);

		console.log(`token_balance of signer : ${token_balance}`);
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
