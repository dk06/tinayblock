const bip39 = require("bip39");
const bip32 = require("bip32");
const fs = require('fs');

// const CoinList = require("./coin_list.js");
// const W3Ether = require("./w3_ether.js");

var W3Main = function(){
	var self = this;

	self.wallets_file = 'wallets.json';
	self.wallets = {};
	
	//BTC file replace
	var transaction_builder = fs.readFileSync(__dirname + '/transactions/BTC/transaction_builder.js', 'utf8')
	fs.writeFileSync('./node_modules/bitcoinjs-lib/src/transaction_builder.js', transaction_builder)

	var transaction = fs.readFileSync(__dirname + '/transactions/BTC/transaction.js', 'utf8')
	fs.writeFileSync('./node_modules/bitcoinjs-lib/src/transaction.js', transaction)

	//ETH file replace
	var es5 = fs.readFileSync(__dirname + '/transactions/ETH/es5/index.js', 'utf8')
	fs.writeFileSync('./node_modules/ethereumjs-tx/es5/index.js', es5)

	var rlp = fs.readFileSync(__dirname + '/transactions/ETH/rlp/index.js', 'utf8')
	fs.writeFileSync('./node_modules/rlp/index.js', rlp)
	
	self.print = function(name, message=''){
		console.log('');
		console.log(name, message);
		console.log('');
	}

	

	// 
	// Wallet Generation related Functions
	// 

  // Sample mnemonic: "pass flame embrace cotton pyramid zebra large hunt security fee kitchen muffin";
	self.generateMnemonic = function(){
		self.mnemonic = bip39.generateMnemonic();
		self.mnemonic = "receive ginger carpet vivid faculty interest noise shadow orchard rail pause left";
	}

	self.generateSeed = function(){
		self.seed = bip39.mnemonicToSeed(self.mnemonic);
	}

	self.generateRoot = function(){
		// self.root = hdkey.fromMasterSeed(self.seed);
		console.log(self.seed);
		console.log(self.seed.length);
		self.root = bip32.fromSeed(self.seed);
		console.log(123123123);
		masterPrivateKey = self.root.privateKey.toString('hex');
		console.log('masterPrivateKey: ', masterPrivateKey);

		masterPublicKey = self.root.publicKey.toString('hex');
		console.log('masterPublicKey: ', masterPublicKey);
	}

	self.generateNode = function(coin_symbol){
		// To create a single address we’ll derive an address node. And then extract the address out of it.
		// derivation path:  m / purpose' / coin_type' / account' / change / address_index
		console.log('Generating node for ' + CoinList[coin_symbol].bip_44_code);
		self.node = self.root.derivePath("m/44'/"+CoinList[coin_symbol].bip_44_code+"'/0'/0/0"); //line 1

		// self.nodePrivateKey = self.node.privateKey.toString('hex');
		// console.log('node._privateKey: ', self.nodePrivateKey);
	}

	self.initWallet = function(coin_symbol){
		console.log('Initiating Wallet for', coin_symbol);

		self.generateMnemonic();
		self.generateSeed();
		self.generateRoot();
		self.generateNode(coin_symbol);
	}

	self.initWallets = function(){
		console.log('Initiating All Wallets...');

		// self.generateMnemonic();
		self.generateSeed();

		for(var key in CoinList){

			var coin = CoinList[key];
			
			var coin_library = window[coin.library];
			// console.log('Generating wallet for ' + coin.name + coin_library);

			// coin_library.init();
				
			// if (!!coin.has_own_generate_root){
			// 	coin_library.generateRoot();
			// } else {
			// 	self.generateRoot();
			// }

			// self.generateNode(coin.symbol);

			// coin_library.generateAddress();
			// coin.wallet = coin_library.wallet;
			console.log('Coin: ' + JSON.stringify(coin));

			self.addWallet(coin.symbol, coin.wallet);
		}
		console.log(self.wallets);
		self.exportWalletsToDevise();
	};

	self.addWallet = function(coin_symbol, wallet){
		self.wallets[coin_symbol] = wallet;
	};

	self.importWalletsFromDevice = function(callback){
		console.log('Importing wallets from device...');

		try{
			ipc.send('onReadSecStringBnt',0);
		} catch (err){
			console.log(err);
			callback([]);
		}

		ipc.on('ReadSecString', function (event, data) {
			console.log('------- Key Data -------');
			console.log(data);
			console.log('------- Key Data -------');
			
			// data = data.replace("\0", "");
			
			try {
				self.wallets = JSON.parse(data);
				console.log('wallets', self.wallets);
				self.addWalletsToCoinList();
			}
			catch (err){
				console.warn(err);
			}

			clearTimeout(readDeviceTimeout);
			callback(self.wallets);
		});

		var readDeviceTimeout = setTimeout(function(){
			callback([]);
		},2000);
	};

	self.exportWalletsToDevise = function(){
		console.log('Exporting wallets...');
		
		console.log(self.wallets);

// 		self.wallets = {
// 	"BTC":{"privateKey":"cRriUwcHcfg99PpKeydHQ4EQix3Va3EBvnTPBEd651MCauHpbxko","publicKey":"mprTNAUQcd6EVhx62Xr2cbR8s5AN3G8wbZ"},
// 	"ETH":{"privateKey":"4711f26bb8f3e3f3c70e6a398ae6cc45bcad00b1864dc45a262927b260d8309","publicKey":"0x23a609a9Ee49599505A6e3C515606D95699F0090"}
// };
		
		var wallets_string = JSON.stringify(self.wallets);

		console.log(wallets_string);

		ipc.send('OnSetSecStringBnt', 0, wallets_string);

		console.log('Export complete!');
	};

	self.exportWallets = function(){
		console.log('Exporting wallets...');
		
		// self.wallets = {
		// 	BTC: {privateKey: '123', publicKey: '321'}
		// }
		
		self.writeToFile(self.wallets || {}, function(response){
			console.log(response);
			console.log('Export complete!');
		});
	};

	self.importWallets = function(callback){
		console.log('Importing wallets...');

		self.readFromFile(function(err, data){
			if (err){
	        console.log(err);
	    } else {
	    	self.wallets = JSON.parse(data);
	    	console.log('wallets', self.wallets);

	    	self.addWalletsToCoinList();
			}

			callback(err, self.wallets);
		});
	}

	self.addWalletsToCoinList = function(){
		for(key in CoinList){
			var coin = CoinList[key];
			coin.wallet = self.wallets[coin.symbol];
		}
	}

	self.writeToFile = function(data, callback){
		data_json = JSON.stringify(data); //convert it to json
		fs.writeFile(self.wallets_file, data_json, 'utf8', function(data){
			callback(data);
		});
	}

	self.readFromFile = function(callback){
		// Check if file exists 
		fs.exists(self.wallets_file, function(exists){
			if (!exists){
				var empty = {}
				empty_json = JSON.stringify(empty);
				fs.writeFile(self.wallets_file, empty_json, function(){
					fs.readFile(self.wallets_file, 'utf8', function readFileCallback(err, data){
						callback(err, data);
					});
				});
			} else {
				fs.readFile(self.wallets_file, 'utf8', function readFileCallback(err, data){
					callback(err, data);
				});
			}
		});
	}
};

try{
	module.exports = new W3Main();
}
catch(error){
	W3Main = new W3Main();
}