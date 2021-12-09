const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

// var TDErc20 = artifacts.require("ERC20TD.sol");
// var evaluator = artifacts.require("Evaluator.sol");
// var evaluator2 = artifacts.require("Evaluator2.sol");
var exercice = artifacts.require("ExerciceSolution.sol")


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        // await deployTDToken(deployer, network, accounts); 
        // await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts); 
        // await deployRecap(deployer, network, accounts); 
        await deployRinkeby(deployer,network,accounts);
		await deployExerciceSolution(deployer,network,accounts);
    });
};

// async function deployTDToken(deployer, network, accounts) {
// 	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
	
// 	// TDToken = await TDErc20.at("0x46a9Dc47185F769ef9a11927B0f9d2fd0dEc3304")
// }

// async function deployEvaluator(deployer, network, accounts) {
// 	Evaluator = await evaluator.new(TDToken.address)
// 	// Evaluator = await evaluator.at("0x6B19d275dA33857a3f35F7c1034048Ba1abF75CD") 
// 	Evaluator2 = await evaluator2.new(TDToken.address)
// }

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*5))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

// async function deployRecap(deployer, network, accounts) {
// 	console.log("TDToken " + TDToken.address)
// 	console.log("Evaluator " + Evaluator.address)
// 	console.log("Evaluator2 " + Evaluator2.address)
// }

async function deployRinkeby(deployer,network,accounts)
{
    TDToken= await TDErc20.at("0x8B7441Cb0449c71B09B96199cCE660635dE49A1D")
    Evaluator= await evaluator.at("0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E")
    Evaluator2 = await evaluator2.at("0x4f82f7A130821F61931C7675A40fab723b70d1B8")
}


async function deployExerciceSolution(deployer,network,accounts)
{
	//init
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Init balance:"+ getBalance.toString())
	//await web3.eth.sendTransaction({ from:accounts[1],to:Evaluator.address, value:web3.utils.toWei("3", "ether")});

	//ex1
	myExercice= await exercice.new("abc","A");
	await Evaluator.submitExercice(myExercice.address,{from:accounts[1]});

	await myExercice.sendToken(Evaluator.address);
	await Evaluator.ex1_testERC721({from:accounts[1]});

	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex1 balance" + getBalance.toString());

	//ex2
	await Evaluator.ex2a_getAnimalToCreateAttributes({from:accounts[1]});
	sexCheval=await Evaluator.readSex(myExercice.address,{from:accounts[1]});
	jambesCheval=await Evaluator.readLegs(myExercice.address,{from:accounts[1]});
	wingsCheval=await Evaluator.readWings(myExercice.address,{from:accounts[1]});
	nomCheval=await Evaluator.readName(myExercice.address,{from:accounts[1]});
	await myExercice.declareAnimal(sexCheval,jambesCheval,wingsCheval,nomCheval);

	//await myExercice.sendToken(Evaluator.address);
	await myExercice.transferFrom(accounts[0], Evaluator.address, 2);
	await Evaluator.ex2b_testDeclaredAnimal(2,{from:accounts[1]});

	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex2 balance" + getBalance.toString());

	//ex3

	await Evaluator.ex3_testRegisterBreeder({from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex3 balance" + getBalance.toString());

	//ex4

	await Evaluator.ex4_testDeclareAnimal({from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex4 balance" + getBalance.toString());

	//ex5

	await Evaluator.ex5_declareDeadAnimal({from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex5 balance" + getBalance.toString());

	//ex6a

	await Evaluator.ex6a_auctionAnimal_offer({from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex6a balance" + getBalance.toString());

	//ex6b

	await myExercice.declareAnimal(0,4,true,"Rays");
	rangVente=await myExercice.getRang();
	await myExercice.offerForSale(4,1)

	await Evaluator.ex6b_auctionAnimal_buy(4,{from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex6b balance" + getBalance.toString());


	//ex7a
	await Evaluator2.submitExercice(myExercice.address,{from:accounts[1]});
	//await web3.eth.sendTransaction({ from:accounts[1],to:Evaluator2.address, value:web3.utils.toWei("5", "ether")});
	await Evaluator2.ex2a_getAnimalToCreateAttributes({from:accounts[1]});

	await myExercice.registerEvaluator(Evaluator2.address);

	await myExercice.authorizedBreederEval7(Evaluator2.address,3);
	await Evaluator2.ex7a_breedAnimalWithParents(1, 3,{from:accounts[1]});
	await myExercice.removeBreedEval7(Evaluator2.address,3);
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex7a balance" + getBalance.toString());


	//ex7b

	await Evaluator2.ex7b_offerAnimalForReproduction({from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex7b balance" + getBalance.toString());

	//ex7c

	await myExercice.declareAnimal(1,7,true,"Rays2");
	await myExercice.offerForReproduction(6,1);

	await Evaluator2.ex7c_payForReproduction(6,{from:accounts[1]});
	getBalance= await TDToken.balanceOf(accounts[1]);
	console.log("Ex7b balance" + getBalance.toString());

}
