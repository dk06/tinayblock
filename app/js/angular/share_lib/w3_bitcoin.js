app.factory('w3_bitcon', function(){
	var selt = {}

    self.init = function(){
		self.initBTCClient();
		self.initNetwork();
	}

	self.initNetwork = function(){
		const bitcoinjs = require('bitcoinjs-lib');
		// self.network = bitcoinjs.networks.bitcoin;
		self.network = bitcoinjs.networks.testnet;
	}

	self.initBTCClient = function(){	
		const btcClient = require('bitcoin-core')
		self.client = new btcClient({
			headers: true,
			network: 'testnet',
			host: '13.232.249.83',
			password: 'bitcoin',
			port: 18332,
			username: 'bitcoin'
		});
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

		W3Main.print('Extended public key: ', extendedPubKey)
		W3Main.print('Extended private key: ', extendedPrivKey)
	}

	self.getAddress = function(node){
		const bitcoinjs = require('bitcoinjs-lib');
	  // var network = bitcoinjs.networks.bitcoin
	  return bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(node.publicKey), self.network.pubKeyHash)
	}

	self.generateAddress = function(){
		const bitcoinjs = require('bitcoinjs-lib');
		var keyPair = new bitcoinjs.ECPair(W3Main.node.keyPair.d, null, { compressed: true, network: self.network });
		
		self.address = keyPair.getAddress();
		self.privkey = keyPair.toWIF();

		W3Main.print('BTC address: ', self.address);
		W3Main.print('BTC Private Key: ', self.privkey);

		self.client.importAddress(self.address, 'tinyblocks', (result, data) => {
			W3Main.print('result: ', result);
			W3Main.print('data: ', data);
		});

		self.wallet = {privateKey: self.privkey, publicKey: self.address}
	}
	
	self.initWallet = function(){
		W3Main.initWallet('BTC', self.network);
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

	self.toSatoshi = function(amount){
		return Math.floor(amount * 100000000);
	}

	self.humanizeToken = function(value){
		return self.toSatoshi(value);
	}

	self.getTxLink = function(txHash){
		var url = 'https://live.blockcypher.com/btc-testnet/tx/';
		return url+txHash;
	}

	self.getTokenPriceInUSD = function(){
		const promise = new Promise((resolve, reject) => {
		  const request = new XMLHttpRequest();

		  request.open("GET", "https://api.cryptonator.com/api/ticker/BTC-usd?fa821dba_ipp_uid2=bVIu2I9Q4BbkhXgu%2fdCuDzYZn00VeLLBvJDy7Hw%3d%3d&fa821dba_ipp_uid1=1528968232596&fa821dba_ipp_key=1528968349984%2Fp97uT6xgX%2b0rlqfOsP2W7A%3d%3d");
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
			
			var balance = 0;
			
			self.client.listUnspent(6, 9999999, [address], (result, transactions) => {
				W3Main.print("Result: ", result);
				W3Main.print("Transactions: ", transactions);
				
				if (result && result.name=="RpcError") {
					W3Main.print('Bitcoin error: ', result.message);
					reject(result.message);
				}
				else{
					if (transactions[0].length) {
						for(var transaction of transactions[0]){
							balance += transaction.amount;
						}
					}
					resolve(balance);
				}
				W3Main.print("Balance for address '"+address+"': ", balance )
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
		var testWIF = 'cQCcR6LGxxL8RCdKxhzEsbYbiR2YfP7kUPiGsaQFXnYSubmREcxP';
		var address = 'mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn';

		var amount = self.txParams.value;
		var recipient = self.txParams.to;
		var miningFee = self.txParams.fee;// || MININGFEE;

		const promise = new Promise((resolve, reject) => {
			const bitcoinjs = require('bitcoinjs-lib');
			var account = bitcoinjs.ECPair.fromWIF(self.wallet.privateKey, self.network);
			var finalTxid, txnhex;
			var txn = new bitcoinjs.TransactionBuilder(self.network);

			self.client.listUnspent(6, 9999999, [self.wallet.publicKey], (result, transactions) => {
				if (result && result.name=="RpcError") {
					W3Main.print('Bitcoin error: ', result.message);
					reject(self.response(false, result.message));
				}
				else{
					if (transactions[0].length) {
						var transactionsUsed = 0, input = 0, change;
						for(var transaction of transactions[0]){
							txn.addInput(transaction.txid, transaction.vout);
							input += self.toSatoshi(transaction.amount);
							transactionsUsed += 1;
							if (input>=amount) break;
						}

						if (input <= (amount + miningFee)){
							W3Main.print('Bitcoin error: ', 'Insufficient funds');
							reject(self.response(false, 'Insufficient funds'));
						}
						else{
							change = input - (amount + miningFee);
							txn.addOutput(recipient, amount);
							if (change){
								txn.addOutput(self.wallet.publicKey, change);
							}

							for (var i = 0; i < transactionsUsed; i++) {
								txn.sign(i, account);
							}

							txnhex = txn.build().toHex();
							W3Main.print("Bitcoin txnhex: ", txnhex);

							self.client.sendRawTransaction(txnhex, (result, data) => {
								if (result && result.name=="RpcError") {
									W3Main.print('transaction error: ',result.message);
									reject(self.response(false, result.message));
								}
								else{
									finalTxid = data[0];
									W3Main.print("Bitcoin Final transaction ID: ", finalTxid);

									var response = {};
									
									response.transactionHash = finalTxid;
									response.txLink = self.getTxLink(finalTxid);
									
									resolve(self.response(true, 'Transaction sent!', response));
								}
							});
						}
					}
					else{
						console.log("Bitcoin error:  No unspent transactions present")
						reject(self.response(false, 'No unspent transactions present'));
					}
				}
			});
		});

		return promise;
	}
    return self;
})