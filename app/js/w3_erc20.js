const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");

var W3ERC20 = function(){

	var self = this;
	self.infura_ley = '5GZBABYhPzfctlTOIiXu'
	self.networkUrl = 'https://ropsten.infura.io/'+self.infura_ley;

	self.print = function(name, message=''){
		console.log('');
		console.log(name, message);
		console.log('');
	}

	self.init = function(){
		self.initDemoWallet(); // Only Use this for testing else comment it out!

		self.initWeb3();
		self.initContract();
	}

	self.initWeb3 = function(){
		// var web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8546"); 
		self.web3 = new Web3(new Web3.providers.HttpProvider(self.networkUrl));
	}

	self.initContract = function(){
		var abiArray = self.getABI();
		var contractAddress = self.getContractAddress();
		self.contract = new self.web3.eth.Contract(abiArray, contractAddress,{
			from: self.wallet.publicKey
		});
	}

	self.initDemoWallet = function(){
		self.wallet = {
			privateKey: 'e03055e3c90998ed0ca71c7a2bbc40055db4264c937fc0640e5839e7d03e6ea9', 
			publicKey: '0xdc95f34b6e36c7fefd6bce81613c0118d188a1f8'
		};
	}

	self.getContractAddress = function(){
		return '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367';
		// return "0xa4B271D6D68661E19FC69B0a1B0BdA94eCb90Ff3";
	}

	self.getABI = function(){
		return [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ethers","type":"uint256"}],"name":"withdrawEthers","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"TokensCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
		// return [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_ownerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
	}

	// 
	// Wallet Generation related Functions
	// 

	self.generateAddress = function(){
		pubKey = ethUtil.privateToPublic(W3Main.node.privateKey);
		self.print('pubKey:', pubKey);

		addr = ethUtil.publicToAddress(pubKey).toString('hex');
		self.print('addr:', addr);

		self.publicKey = ethUtil.toChecksumAddress(addr);
		self.print('Public Address:', self.publicKey);

		self.wallet = {privateKey: W3Main.nodePrivateKey, publicKey: self.publicKey}
	}

	self.initWallet = function(){
		W3Main.initWallet('ETH');
		self.generateAddress();
	}

	// 
	// Transaction related Functions
	// 
	
	self.toHex = function(value){
		return self.web3.utils.toHex(value);
	}

	self.toEther = function(value){
		return self.web3.utils.fromWei(value, 'ether');
	}

	self.toWei = function(value){
		return self.web3.utils.toWei(value, 'ether');
	}

	self.getBalance = function(public_address){
		return self.contract.methods.balanceOf(public_address).call({});
	}

	self.getTxCount = function(public_address){
		return self.web3.eth.getTransactionCount(public_address);
	}

	self.sendTx = function(to_address, nonce, value){
		var params = {
		  nonce: nonce,
		  to: to_address,//'0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8'
		  value: self.web3.utils.toHex(value), //value,
		  gasPrice: self.web3.utils.toHex(21000),
		  gasLimit: self.web3.utils.toHex(250000),
		  chainId: 3
		};

		self.print('Tx Params:', params);

		var tx = new ethTx(params);

		var privateKey = Buffer.from(self.wallet.privateKey, 'hex')
		
		// tx.sign(self.node._privateKey);
		tx.sign(privateKey);

		var serializedTx = tx.serialize()
		self.print('serializedTx:', serializedTx);
		
		self.web3.eth.sendSignedTransaction(
		  `0x${serializedTx.toString('hex')}`, 
		  (error, result) => { 
		    if (error) { console.log(`Error: ${error}`); }  
		    else { console.log(`Result: ${result}`); } 
		  } 
		);
	}

	self.initTx = function(to_address, value){		
		self.getTxCount(self.wallet.publicKey).then(function(data){
			self.print('Transaction count:', data);
			txCount = self.toHex(data);

			self.sendTx(to_address, txCount, value);
		});
	}

	self.buyToken = function(){
		self.initTx("0x583cbBb8a8443B38aBcC0c956beCe47340ea1367", 1000000000000000000);
	}

	self.transferToken = function(from_address, to_address, nonce, value){
		var params = {
		  nonce: nonce,
		  from: from_address,
		  to: self.getContractAddress(),
		  value: self.web3.utils.toHex(0),
		  gasPrice: self.web3.utils.toHex(300000),
		  gasLimit: self.web3.utils.toHex(250000),
		  data: self.contract.methods.transfer(to_address, value).encodeABI(),
		  chainId: 3
		};

		self.print('Tx Params:', params);

		var tx = new ethTx(params);

		var privateKey = Buffer.from(self.wallet.privateKey, 'hex')
		
		// tx.sign(self.node._privateKey);
		tx.sign(privateKey);

		var serializedTx = tx.serialize()
		self.print('serializedTx:', serializedTx);
		
		self.web3.eth.sendSignedTransaction(
		  `0x${serializedTx.toString('hex')}`, 
		  (error, result) => { 
		    if (error) { console.log(`Error: ${error}`); }  
		    else { console.log(`Result: ${result}`); } 
		  } 
		);
	}

	self.initTokenTransfer = function(to_address, value){		
		self.getTxCount(self.wallet.publicKey).then(function(data){
			self.print('Transaction count:', data);
			txCount = self.toHex(data);

			self.transferToken(self.wallet.publicKey, to_address, txCount, value);
		});
	}
}

W3ERC20 = new W3ERC20();
W3ERC20.init();

W3ERC20.getBalance(W3ERC20.wallet.publicKey).then(function(data){
	console.log(`Sender Balance: ${data}`);
}, function(error){
	console.log(`Sender Balance Error: ${error}`);
});

// W3ERC20.buyToken();


W3ERC20.getBalance("0xec4Be665Aa262c1DEd47988f09cEb0aF5757bD52").then(function(data){
	console.log(`Reciever Balance: ${data}`);
	// W3ERC20.initTokenTransfer("0xec4Be665Aa262c1DEd47988f09cEb0aF5757bD52", 500000000000000000);
}, function(error){
	console.log(`Reciever Balance Error: ${error}`);
});

// W3ERC20.initTxToContract('0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8', '0xfA5DEeB3D97edc095af7a26853b46b755F41B10a', '10000000000000000');
// W3ERC20.initTx('0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba', '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367', '10000000000000000');