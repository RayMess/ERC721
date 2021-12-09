pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ExerciceSolution is ERC721
{

	mapping(uint256 => string) public NomCheval;
	mapping(uint256 => bool) public WingsCheval;
	mapping(uint256 => uint) public JambesCheval;
	mapping(uint256 => uint) public SexCheval;

	mapping(address => bool) public breeder;
	mapping(uint => address) public indexToken;
	mapping(uint => bool) public forSale;
	mapping(uint => uint) public priceSale;
	mapping(uint => uint) public Parent1;
	mapping(uint => uint) public Parent2;
	mapping(uint => bool) public Reproduce;

	mapping(uint => address) public authoBreed;

	uint256 private rang; 
	uint256 public priceRegister;
	uint256 public priceRp;
	

    constructor (string memory name, string memory symbol) public ERC721(name,symbol){
		rang=1;
		priceRegister=0.01 ether;
		priceRp=0;
    }

	function sendToken(address account) external{
		_mint(account,rang);
		indexToken[rang]=account;
	}

	function isBreeder(address account) external returns (bool)
	{
		return breeder[account];
	}

	function registrationPrice() external returns (uint256)
	{
		return priceRegister;
	}

	function registerMeAsBreeder() external payable
	{
		require(msg.value == priceRegister, "You need to pay more");
		breeder[msg.sender] = true;
	}

	function declareAnimal(uint sex, uint legs, bool wings, string calldata name) external returns (uint256)
	{
		rang++;
		NomCheval[rang]=name;
		WingsCheval[rang]=wings;
		JambesCheval[rang]=legs;
		SexCheval[rang]=sex;
		_mint(msg.sender,rang);
		indexToken[rang]=msg.sender;
		return rang;
	}

	function getAnimalCharacteristics(uint animalNumber) external returns (string memory _name, bool _wings, uint _legs, uint _sex)
	{
		_name=NomCheval[animalNumber];
		_wings=WingsCheval[animalNumber];
		_legs=JambesCheval[animalNumber];
		_sex=SexCheval[animalNumber];
		return (_name,_wings,_legs,_sex);
	}

	function getRang() public returns(uint256)
	{
		return rang;
	}

	function declareDeadAnimal(uint animalNumber) external
	{
		require(ownerOf(animalNumber) == msg.sender,"Echec");
		_burn(animalNumber);
		NomCheval[animalNumber]="";
		WingsCheval[animalNumber]=false;
		JambesCheval[animalNumber]=0;
		SexCheval[animalNumber]=0;
		delete indexToken[animalNumber];
	}

	//SELL

	function isAnimalForSale(uint animalNumber) external view returns (bool)
	{
		return forSale[animalNumber];
	}

	function animalPrice(uint animalNumber) external view returns (uint256)
	{
		if (forSale[animalNumber]==true)
		{
			return priceSale[animalNumber];
		}
		else{
			return 0;
		}
	}

	function buyAnimal(uint animalNumber) external payable
	{
		require(forSale[animalNumber]);

		(bool sent, bytes memory data) = ownerOf(animalNumber).call{value: msg.value}("");
		require(sent, "Failed to transfer Ether");


		_transfer(ownerOf(animalNumber), msg.sender, animalNumber);
		forSale[animalNumber]=false;
		priceSale[animalNumber]=0;
	}

	function offerForSale(uint animalNumber, uint price) external
	{
		forSale[animalNumber]=true;
		priceSale[animalNumber]=price;

	}

	function registerEvaluator(address Eval) external
	{
		breeder[Eval]=true;
	}

	//PARENTS

	function declareAnimalWithParents(uint sex, uint legs, bool wings, string calldata name,uint parent1, uint parent2) external returns(uint id)
	{
		require(msg.sender == this.authorizedBreederToReproduce(parent2), "User not allowed to reproduce");
		rang++;
		NomCheval[rang]=name;
		WingsCheval[rang]=wings;
		JambesCheval[rang]=legs;
		SexCheval[rang]=sex;
		Parent1[rang]=parent1;
		Parent2[rang]=parent2;
		indexToken[rang]=msg.sender;

		Reproduce[parent1]=false;
		Reproduce[parent2]=false;
		delete authoBreed[parent2];

		return rang;
	}

	function getParents(uint animalNumber) external returns(uint parent1, uint parent2)
	{
		return (Parent1[animalNumber],Parent2[animalNumber]);
	}


	//REPRODUCTION

	function canReproduce(uint animalNumber) external returns (bool)
	{
		return Reproduce[animalNumber];
	}

	function reproductionPrice(uint animalNumber) external returns (uint256)
	{
		return priceRp;
	}

	function offerForReproduction(uint animalNumber, uint price) external returns(uint256)
	{
		require(msg.sender==ownerOf(animalNumber),"Echec");
		Reproduce[animalNumber]=true;
		priceRp=price;
		return animalNumber;
	}

	function authorizedBreederToReproduce(uint animalNumber) external returns(address)
	{
		return (authoBreed[animalNumber]);
	}

	function payForReproduction(uint animalNumber) external payable
	{
		(bool sent, bytes memory data) = ownerOf(animalNumber).call{value: msg.value}("");
		require(sent, "Failed to transfer Ether");

		authoBreed[animalNumber]=msg.sender;
	}

	function authorizedBreederEval7(address a, uint animalNumber) external 
	{
		authoBreed[animalNumber]=a;
	}

	function removeBreedEval7(address a, uint animalNumber) external 
	{
		delete authoBreed[animalNumber];
	}
}