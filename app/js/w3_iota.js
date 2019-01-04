const IOTA       = require('iota.lib.js');
const BigNumber  = require("bignumber.js");
const iotaCrypto = require("./js/handlers/iota-converter.js");
const coinConfig = CoinList["IOTA"];

/********************* Custom handler Functions for this coin *********************/
const toTrytes = function(mnemonic, passphrase) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('The Mnemonic you provided is not valid!: ' + mnemonic);
  }
	const pass      = passphrase ? passphrase.toString() : undefined
	const seedHex   = bip39.mnemonicToSeedHex(mnemonic, pass);
	const seedDec   = new BigNumber(parseInt(seedHex, 16), 10);
	const seedTrits = iotaCrypto.fromValue(seedDec);
  return iotaCrypto.trytes(seedTrits);
}

const toSeed = function(mnemonic, passphrase) {
  return toTrytes(mnemonic, passphrase).slice(0, 81);
}

/********************* Coin object (library) *********************/
var W3Iota = function(){
	var self = this;
	self.init = function(){
		self.initNetwork();
	}

	self.initNetwork = function(){
		self.iota = new IOTA({provider: coinConfig.provider});
	}

	/********************* Wallet Generation related Functions *********************/

	// Generate transaction params for IOTA
	// Address: recipient address, value: amount of coin, message: any message for transaction
	self.generateTransParams = function(address, value = 0, message = 'No message passed!') {
		return [{value: value, address: address, message: self.iota.utils.toTrytes(message)}];
	}

	// Create first blank transaction to register address in IOTA Tangle (https://thetangle.org/)
	function createFirstBlankTransaction(self) {
		let transParams = self.generateTransParams(self.wallet.publicKey, 0, 'The blank transaction to register address!');
		self.iota.api.sendTransfer(self.wallet.publicKey, 3, 9, transParams, (error, response) => {
	    if (error) {
	    	console.log(error);
	    } else {
	    	console.log('Register address transaction details:');
	      console.log(response);
	    }
		});
	}

	// Check if address exists in Tangle of IOTA else create new
	function isAddressExists(cb) {
		self.iota.api.getAccountData(self.seed, {}, function(error, response) {
			if(!!response && !!response.addresses && response.addresses.length > 0) {
				cb({success: true});
			} else {
				cb({success: false});
			}
		});
	}

	// Register this address with IOTA Tangle if not already exists
	function registerAddress() {
		isAddressExists(function(isExists) {
  		if(!isExists.success) {
  			createFirstBlankTransaction(self);
  		}
  	});
	}

	// Generate address for IOTA using mnemonics, convert custom seed (https://iota.readme.io/docs/securely-generating-a-seed) for IOTA before create
	self.generateAddress = function(){
		console.log('W3main mnemonic: ' + W3Main.mnemonic);
		self.seed = toTrytes(W3Main.mnemonic); // Custom seed generation for IOTA coin
		self.iota.api.getNewAddress(self.seed, {total: 1},  (error, address) => { // return address in array form
	    if(error){
	    	console.log(error)
	    } else {
	    	self.wallet = {privateKey: self.seed, publicKey: address[0]};
	    	registerAddress();
			}
		});
	}
	
	self.initWallet = function(){
		W3Main.initWallet('IOTA');
		self.generateAddress();
	}

	/********************* Transaction related Functions *********************/

	self.response = function(success, message, data={}){
		return {
			success: success,
			message: message,
			data: data
		}
	}

	// Generate external link for transaction and return full path
	// Devnet: https://devnet.thetangle.org/transaction/KYT9GQVQCMYWMXHXYMGYN9FQJW9NYEGFAGEZH9YAYHM9SVQO9YC9RJMMPYSMLWDOCDHAGLDAEZD99A999
	self.getTxLink = function(txHash){
		return coinConfig.devNetUrl+txHash;
	}

	// Get the transactions and format as expected by Angular controller for transaction list UI
	self.formatTxs = function(transactions){
		if (transactions[0].length <= 0){ // No transaction present
			return [];
		}

		let formattedTransaction = [];
		formattedTransaction.push([ //Columns to be shown in transaction list
			{ key: 'date', presentation:'', value: 'Date'},
			{ key: 'txid', presentation:'', value: 'Transaction Id' },
			{ key: 'amount', presentation:'', value: 'Amount' }
		]);

		transactions.forEach(function(transaction){
			// console.log('Processing transaction: ' + JSON.stringify(transaction[0]));
			formattedTransaction.push([ // start pushing data for columns in transaction list
				{ key: 'date', presentation:  '', value: new Date(transaction[0].timestamp*1000).toString() },
				{ key: 'txid', presentation: '', value: transaction[0].hash, txLink: self.getTxLink(transaction[0].hash) },
				{ key: 'amount', presentation:  '', value: transaction[0].value },
			]);
		});
		return formattedTransaction;
	}

	// Get coin rate in USD
	// Response format: {ticker: {price: 0.98457}}
	self.getTokenPriceInUSD = function(){
		const promise = new Promise((resolve, reject) => {
		  const request = new XMLHttpRequest();
		  request.open("GET", coinConfig.rateUrl);
		  request.onload = () => { // Success
		    if (request.status === 200) {
		    	var response = JSON.parse(request.response);
		    	response["ticker"]["price"] = response.ticker.high;
		    	console.log("Coin rate response: ", response);
		      resolve(JSON.stringify(response)); 
		    } else {
		      reject(Error(request.statusText));
		    }
		  };
		  request.onerror = () => { // Error
		    reject(Error("Error fetching coin market rate data."));
		  };
		  request.send();
		});
		return promise;
	}

	// Get the balance of current address for this coin
	// Response: the value of balance
	self.getBalance = function(address){
		const promise = new Promise((resolve, reject) => {
			self.iota.api.getBalances([address], 100, (error, response) => {
				console.error('Error IOTA getBalance: ' + error);
				console.log('Success IOTA getBalance: ' + JSON.stringify(response));
				if (!!response && response.balances && response.balances.length > 0){
					resolve(response.balances[0]);
				} else {
					reject(error);
				}
			});
		});
		return promise;
	}

	// Get all transaction for current coin
	// Format transaction using formatTxs function before sending back as response
	self.getTxs = function(){
		console.log('Getting transaction for IOTA!');
		const promise = new Promise((resolve, reject) => {
			console.log('Seed for IOTA: ' + (self.wallet.privateKey));
			self.iota.api.getTransfers(self.wallet.privateKey.toString(), {}, (error, response) => {
				console.log('IOTA transaction response: ' + JSON.stringify(response));
				console.error('IOTA transaction error: ' + JSON.stringify(error));
				if(!!response) {
					response = self.formatTxs(response);
					resolve(response);
				} else {
					reject(error);
				}
			});
		});
		return promise;
	}

	// Validate if the transaction parameters are present with proper type and value validation
	self.validateTxParams = function(hash){
		var promise = new Promise((resolve, reject) => {
			try{
				let errors = [];
				let no_errors_flag = 1;
				// Update txParams values
				self.txParams = hash;
				console.log('txParams: ' + JSON.stringify(self.txParams));

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

	// Initiate transaction for IOTA tangle
	self.initTx = function(){
		console.log('About to start transaction!');
		const promise = new Promise((resolve, reject) => {
			console.log('Params: ' + JSON.stringify(self.txParams));
			var transfers = self.generateTransParams(self.txParams.to, parseInt(self.txParams.value), 'The transaction of amount.')
			// console.log('transfer object: ' + JSON.stringify(transfers));
			self.iota.api.sendTransfer(self.wallet.publicKey, 3, 9, transfers, (error, response) => {
				console.log('Transaction response: ' + JSON.stringify(response));
				console.error('Transaction error: ' + JSON.stringify(error));
		    if(error) {
		      console.log(error);
		      reject(error);
		    } else {
		    	response.transactionHash = response[0]["hash"];
					response.txLink = self.getTxLink(response[0]["hash"]);
					resolve(self.response(true, 'Transaction sent!', response));
		    }
			});
		});
		return promise;
	}
}

W3Iota = new W3Iota();