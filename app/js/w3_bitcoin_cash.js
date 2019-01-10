// const bitcoinjs = require('bitcoinjs-lib');
// const btcClient = require('bitcoin-core');
const request = require('request');
const bitcoincashjs = require('bitcoincashjs');
var Client=require('./js/Client.js');

var W3BitcoinCash = function(){

	var self = this;

	self.init = function(){
		// self.initBTCClient();
		self.initNetwork();
	}

	self.initNetwork = function(){
		// self.network = bitcoinjs.networks.bitcoin;
		self.network = bitcoinjs.networks.testnet;
	}

	self.initBTCClient = function(){
		self.client = Client;	
		// self.client = new btcClient({
		// 	headers : true,
		// 	network : 'testnet',
		// 	host    : '13.232.249.83',
		// 	password: 'bitcoin',
		// 	port    : 18332,
		// 	username: 'bitcoin'
		// });
	}

	// 
	// Wallet Generation related Functions
	// 
	
	self.wallet = {
		privateKey: '', 
		publicKey: ''
	}
	
	self.generateRoot = function(){
		W3Main.root = bitcoinjs.HDNode.fromSeedHex(W3Main.seed, self.network);

		var extendedPubKey = W3Main.root.neutered().toBase58();
		var extendedPrivKey = W3Main.root.toBase58();

		console.log('Extended public key: ', extendedPubKey)
		console.log('Extended private key: ', extendedPrivKey)
	}

	self.getAddress = function(node){
	  // var network = bitcoinjs.networks.bitcoin
	  return bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(node.publicKey), self.network.pubKeyHash)
	}

	self.generateAddress = function(){
		var keyPair = new bitcoinjs.ECPair(W3Main.node.keyPair.d, null, { compressed: true,  network: self.network});
		self.privkey = keyPair.toWIF();
		var address = new bitcoincashjs.PrivateKey(self.privkey).toAddress();
		
		self.cashAddress = address.toString(bitcoincashjs.Address.CashAddrFormat);
		self.legacyAddress = address.toString();

		console.log("Bitcoin Cash Address: ", self.cashAddress);
		console.log("Bitcoin Cash Legacy Address: ", self.legacyAddress);
		console.log("Private Key: ", self.privkey);

		self.wallet = {privateKey: self.privkey, publicKey: self.cashAddress, legacyAddress: self.legacyAddress};
	}
	
	self.initWallet = function(){
		W3Main.initWallet('BTC');
		self.generateAddress();
	}

	// 
	// Transaction related Functions
	//
	
	self.response = function(success, message, data={}){
		return {
			success: success,
			message: message,
			data: data
		}
	}

	self.toBitcoin = function(amount){
		return amount / 100000000;
	}

	self.toSatoshi = function(amount){
		return Math.floor(amount * 100000000);
	}

	self.humanizeToken = function(value){
		return self.toSatoshi(value);
	}

	self.getTxLink = function(txHash){
		var url = 'https://tbch.blockdozer.com/tx/';
		return url+txHash;
	}

	self.formatTxs = function(txs){
		var transaction_data = JSON.parse(txs);
		
		console.log(transaction_data);
		
		if (transaction_data.totalItems <= 0){
			return [];
		}

		var transactions = [];
		transactions.push([ //Columns
			{ key: 'date', presentation:'', value: 'Date'},
			{ key: 'txid', presentation:'', value: 'Transaction Id' },
			{ key: 'amount', presentation:'', value: 'Amount' }
		]);

		transaction_data.items.forEach(function(transaction){
			transactions.push([ //transactions
				{ key: 'date', presentation:  '', value: new Date(transaction.time*1000).toString() },
				{ key: 'txid', presentation: '', value: transaction.txid, txLink: self.getTxLink(transaction.txid) },
				// { key: 'from', presentation:  '', value: 
				// 	[
				// 		{ key: 'from', presentation:  '', value: transaction.vin[0].addr }
				// 	]
				// },
				// { key: 'to', presentation:  '', value: 
				// 	[
				// 		{ key: 'from', presentation:  '', value: transaction.vout[0].scriptPubKey.addresses[0] }
				// 	]
				// },
				{ key: 'amount', presentation:  '', value: transaction.vout[0].value },
			]);
		});


		
		return transactions;
	}

	self.getTokenPriceInUSD = function(){
		const promise = new Promise((resolve, reject) => {
		  const request = new XMLHttpRequest();

		  request.open("GET", "https://api.cryptonator.com/api/ticker/BCH-usd?fa821dba_ipp_uid2=bVIu2I9Q4BbkhXgu%2fdCuDzYZn00VeLLBvJDy7Hw%3d%3d&fa821dba_ipp_uid1=1528968232596&fa821dba_ipp_key=1528968349984%2Fp97uT6xgX%2b0rlqfOsP2W7A%3d%3d");
		  request.onload = () => {
		    if (request.status === 200) {
		      resolve(request.response); 
		    } else {
		      reject(Error(request.statusText));
		    }
		  };

		  request.onerror = () => {
		    reject(Error("Error fetching data."));
		  };

		  request.send();
		});

		return promise;
	}


	self.getBalance = function(address){
		const promise = new Promise((resolve, reject) => {
			
			request.get('https://tbch.blockdozer.com/insight-api/addr/'+ address +'/balance', function(error, response, body){
				if (response && response.statusCode == 200 && body){
					console.log(body);

					balance = self.toBitcoin(body);

					resolve(balance);
				} else {
					console.log(response);
					console.log(error);
					console.log(body);

					reject(error);
				}
			});

		});

		return promise;
	}

	self.getTxs = function(){
		const promise = new Promise((resolve, reject) => {

			request.get('https://tbch.blockdozer.com/insight-api/addrs/'+ self.wallet.publicKey +'/txs?from=0&to=50', function(error, response, body){

				if (response && response.statusCode == 200 && body){

					txs = self.formatTxs(body);

					resolve(txs);
				} else {
					console.log(response);
					console.log(error);
					console.log(body);
					reject(error);
				}

			});

		});

		return promise;
	}

	self.validateTxParams = function(hash){
		var promise = new Promise((resolve, reject) => {
			try{
				errors = [];
				no_errors_flag = 1;

				// Update txParams values

				self.txParams = hash;

				if(hash.value){
					self.txParams.rawValue = hash.value;
					self.txParams.value = self.toSatoshi(hash.value);
				}

				if(hash.fee){
					self.txParams.fee = self.toSatoshi(hash.fee);
				}

				// Validations
				if(!self.txParams.fee){
					errors.push('Transaction fee not present!');
					no_errors_flag *= 0;
				}

				if(!self.txParams.value){
					errors.push('Amount not present!');
					no_errors_flag *= 0;
				}

				if(!self.txParams.to){
					errors.push('Recipient address not present!');
					no_errors_flag *= 0;
				}

				// Return Errors
				if (!no_errors_flag){
					reject(errors.join(', '));
				} else {
					resolve('No Errors');
				}
			} catch (error) {
				reject(`${error}`);
			}
		});

		return promise;

	}

	self.initTx = function(){
		const promise = new Promise((resolve, reject) => {
			
			var cashAddress = self.wallet.publicKey;
			var legacyAddress = self.wallet.legacyAddress;
			var privateKey = self.wallet.privateKey;

			var account = new bitcoincashjs.PrivateKey(privateKey);
			var change, txnhex, finalTxid, input = 0, inputs = [], privateKeys = [];
		
			var amount = self.txParams.value;
			var recipient = self.txParams.to;
			var miningFee = self.txParams.fee;// || MININGFEE;

			if (recipient.includes('bitcoincash') || recipient.includes('bchtest')) {
				recipient = bitcoincashjs.Address.fromString(recipient, 'testnet', 'pubkeyhash', bitcoincashjs.Address.CashAddrFormat).toString();
			}
			
			// amount = W3Main.toSatoshi(amount);
			var txn = new bitcoincashjs.Transaction(bitcoincashjs.Networks.testnet);

			request.get('https://tbch.blockdozer.com/insight-api/addr/'+cashAddress+'/utxo', function(error, response, body){
				console.log(body);
				if(body){
					var utxos = JSON.parse(body);
					for (var utx of utxos) {
						if (utx.scriptPubKey) {
							inputs.push(utx);
							privateKeys.push(account);
							input += utx.satoshis;
							if (input >= (amount + miningFee)) break;
						}
					}

					if (input <= (amount + miningFee)) {
						console.log('Bitcoin Cash transaction error: ', 'Insufficient funds');
						reject(self.response(false, 'Insufficient funds'));
					}
					else{
						change = input - (amount + miningFee);
						txn.from(inputs);
						txn.to(recipient, amount);
						if (change) {
							txn.change(legacyAddress, change);
						}
					}

					txn.sign(privateKeys);

					txnhex = txn.toString();

					console.log("Raw transaction hex: ", txnhex);

					request({
						method: 'POST',
						uri: 'https://tbch.blockdozer.com/insight-api/tx/send',
						body: {
							'rawtx': txnhex
						},
						json: true
					}, function(error, response, body){
						console.log("error: ", error);
						console.log("body: ", body);
						if (body) {
							if (body.txid) {
								finalTxid = body.txid;
								console.log("Final transaction ID: ", finalTxid);

								var response = {};
									
								response.transactionHash = finalTxid;
								response.txLink = self.getTxLink(finalTxid);
								
								resolve(self.response(true, 'Transaction sent!', response));
							} else {
								reject(self.response(false, 'No transaction Id is returned!'));
							}
						} else {
							reject(self.response(false, error || body));
						}
					});
				}
				else{
					console.log("error: ", "No unspent transactions present ")
					reject(self.response(false, 'No unspent transactions present'));
				}

			});

		});

		return promise;
	}

}

W3BitcoinCash = new W3BitcoinCash();