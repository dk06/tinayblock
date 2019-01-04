const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");
const bitcoinjsETH = require('bitcoinjs-lib');
const wifETH = require('wif');
const promptAlert = require('electron-prompt');

var IChaKey=require('./js/IChaKey.js');
var mIChaKey=new IChaKey();

var W3Ether = function(){

	var self = this;
	self.infura_ley = '5GZBABYhPzfctlTOIiXu'
	self.networkUrl = 'https://ropsten.infura.io/'+self.infura_ley;

	self.print = function(name, message=''){
		console.log('');
		console.log(name, message);
		console.log('');
	}

	self.init = function(){
		self.initWeb3();
		self.initTxParams();
	}

	self.initWeb3 = function(){
		// var web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8546");
		self.web3 = new Web3(new Web3.providers.HttpProvider(self.networkUrl));
	}

	self.initTxParams = function(){
		self.txParams = {
			gasPrice: self.web3.utils.toHex(5000000000),
		  gasLimit: self.web3.utils.toHex(25000),
		  chainId: 3
		};
	}

	// 
	// Wallet Generation related Functions
	// 
	
	self.wallet = {
		privateKey: '', 
		publicKey: ''
	}

	self.generateAddress = function(){
		pubKey = ethUtil.privateToPublic(W3Main.node.privateKey);
		self.print('pubKey:', pubKey);

		addr = ethUtil.publicToAddress(pubKey).toString('hex');
		self.print('addr:', addr);

		self.publicKey = ethUtil.toChecksumAddress(addr);
		self.print('Public Address:', self.publicKey);

		self.wallet = {privateKey: W3Main.node.privateKey.toString('hex'), publicKey: self.publicKey}
	}

	self.initWallet = function(){
		W3Main.initWallet('ETH');
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

	self.toHex = function(value){
		return self.web3.utils.toHex(value);
	}

	self.toEther = function(value){
		return self.web3.utils.fromWei(value, 'ether');
	}

	self.toWei = function(value){
		return self.web3.utils.toWei(value, 'ether');
	}

	self.humanizeToken = function(value){
		return self.toEther(value);
	}

	self.getTxLink = function(txHash){
		var url = 'https://ropsten.etherscan.io/tx/';
		return url+txHash;
	}

	self.formatTxs = function(txs){
		var transaction_data = JSON.parse(txs).result;
		
		console.log(transaction_data);
		
		if (transaction_data.length <= 0){
			return [];
		}

		var transactions = [];
		transactions.push([ //Columns
			{ key: 'date', presentation:'', value: 'Date'},
			{ key: 'txid', presentation:'', value: 'Transaction Id' },
			{ key: 'amount', presentation:'', value: 'Amount (ETH)' }
		]);

		transaction_data.forEach(function(transaction){
			transactions.push([ //transactions
				{ key: 'date', presentation:  '', value: new Date(transaction.timeStamp*1000).toString() },
				{ key: 'txid', presentation: '', value: transaction.hash, txLink: self.getTxLink(transaction.hash) },
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
				{ key: 'amount', presentation:  '', value: "ETH " + self.humanizeToken(transaction.value) },
			]);
		});


		
		return transactions;
	}

	self.getTokenPriceInUSD = function(){
		const promise = new Promise((resolve, reject) => {
		  const request = new XMLHttpRequest();

		  request.open("GET", "https://api.cryptonator.com/api/ticker/ETH-usd?fa821dba_ipp_uid2=bVIu2I9Q4BbkhXgu%2fdCuDzYZn00VeLLBvJDy7Hw%3d%3d&fa821dba_ipp_uid1=1528968232596&fa821dba_ipp_key=1528968349984%2Fp97uT6xgX%2b0rlqfOsP2W7A%3d%3d");
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
		// return $.get('https://api.cryptonator.com/api/ticker/ETH-usd?fa821dba_ipp_uid2=bVIu2I9Q4BbkhXgu%2fdCuDzYZn00VeLLBvJDy7Hw%3d%3d&fa821dba_ipp_uid1=1528968232596&fa821dba_ipp_key=1528968349984%2Fp97uT6xgX%2b0rlqfOsP2W7A%3d%3d');
	}

	self.getBalance = function(public_address){
		const promise = new Promise((resolve, reject) => {
			self.web3.eth.getBalance(public_address).then((data) => {
				var balance = self.toEther(data);
				resolve(balance);
			}, (err) => {
				reject(error)
			});
		});
		return promise;
	}

	self.getTxCount = function(public_address){
		return self.web3.eth.getTransactionCount(public_address);
	}

	self.getTxs = function(){
		const promise = new Promise((resolve, reject) => {
		  const request = new XMLHttpRequest();

		  request.open("GET", "http://api-ropsten.etherscan.io/api?module=account&action=txlist&address="+self.wallet.publicKey+"&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken");
		  request.onload = () => {
		    if (request.status === 200) {
		    	var txs = self.formatTxs(request.response);
		      resolve(txs); 
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

	self.validateTxParams = function(hash){
		var promise = new Promise((resolve, reject) => {
			try{
				errors = [];
				no_errors_flag = 1;

				// Update txParams values
				if(hash.gasPrice){
					self.txParams.gasPrice = self.toHex(hash.gasPrice);
				} 

				if(hash.gasLimit){
					self.txParams.gasLimit = self.toHex(hash.gasLimit);
				}

				if(hash.value){
					self.txParams.rawValue = hash.value;
					self.txParams.value = self.toHex(self.toWei(hash.value));
				}

				if(hash.chainId){
					self.txParams.chainId = hash.chainId;
				}

				if(hash.to){
					self.txParams.to = hash.to;
				}

				// Validations
				if(!self.txParams.gasPrice){
					errors.push('Gas price not present!');
					no_errors_flag *= 0;
				}

				if(!self.txParams.gasLimit){
					errors.push('Gas limit not present!');
					no_errors_flag *= 0;
				}

				if(!self.txParams.chainId){
					errors.push('Chain Id not present!');
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

	self.sendTx = function(){ // Deprecated. Do not use this. Check initTx.

		var txPromise = new Promise((resolve, reject) => {
			self.print('Tx Params:', self.txParams);

			var tx = new ethTx(self.txParams);
			var privateKey = Buffer.from(self.wallet.privateKey, 'hex')

			tx.sign(privateKey);
			var serializedTx = tx.serialize()

			self.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
			.then(
				function(response){
					console.log(response);
				}, function(error){
					console.log(`${error}`);
				}
			);
		});

		return txPromise;
	}

	self.initTx = function(){
		var txPromise = new Promise((resolve, reject) => { // Transaction Promise
			lasterror=mIChaKey.ClearTokens();
			if(lasterror!=0)
			{
				alert('Wrong device pin');
				resolve(self.response(false, 'device not active and Wrong device pin'));
			}else{
				self.getTxCount(self.wallet.publicKey).then(function(data){ // Get Tx Count for nonce
					try{
						self.print('Transaction count:', data);
						self.txParams.nonce = self.toHex(data);;
						
						self.print('Tx Params:', self.txParams);
						
						var TokensCount=mIChaKey.GetTokensCount();
						const privKey = Buffer.from(self.wallet.privateKey, 'hex')
						var PriKey=wifETH.encode(128,privKey,true);
						const alice = bitcoinjsETH.ECPair.fromWIF(PriKey)
						// tx.sign(privateKey);
						lasterror=mIChaKey.AddKeyPairs('ETH',alice,IChaKey.ETH_SIGNTYPE);
					

						web3 = new Web3(Web3.currentProvider);
     
						const txParams = {
						nonce: self.txParams.nonce,
						gasPrice: self.txParams.gasPrice, 
						gasLimit: self.txParams.gasLimit,
						to: self.txParams.to, 
						rawValue: self.txParams.rawValue,
						value: '1', 
						// value:web3.utils.toWei('1', 'ether'),
						// data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
						// EIP 155 chainId - mainnet: 1, ropsten: 3
						chainId: self.txParams.chainId
						}
						
						var tx = new ethTx(txParams)

						// var tx = new ethTx(self.txParams);
						
						var privateKey = Buffer.from(self.wallet.privateKey, 'hex')

						tx.ChaKeySign('ETH',true,function(lasterror,Paystatus){
							var serializedTx = GetUserAction(lasterror,Paystatus,TestVerEth,tx)
							if(serializedTx){
								self.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`).then( // Sending Transaction
									function(response){
										
										response.txLink = self.getTxLink(response.transactionHash);
										resolve(self.response(true, 'Transaction Sent!', response));
									
									}, function(error){
										reject(self.response(false, `${error}`));
									}
								);
							}else{
								reject(self.response(false, 'Failed transaction'));
							}
						});

						if (lasterror!=0) 
						{
							alert("err sign");  return ;
						}
						else
						{
							alert("pls confirm on ChaKey.");
							var ErrShowVerfCodeInfo="There is a error when show verification code,.errcode is:";
							lasterror=mIChaKey.ChaKeyShowVerfCode();
							if( lasterror !=0 ) {
								SendErrMsgEx(event,ErrShowVerfCodeInfo);return;
							}

							promptAlert({
								title: 'Input Unique Number',
								label: 'Input Unique Number:',
								value: '123456',
								inputAttrs: {
									type: 'url'
								}
							})
							.then((r) => {
								if(r === null) {
									console.log('user cancelled');
									resolve(self.response(true, 'Transaction failed!', 0));
								} else {
									getValue(r);
									console.log('result', r);
								}
							})
							.catch(console.error);
						}

						// var serializedTx = tx.serialize()

						// self.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`).then( // Sending Transaction
						// 	function(response){
								
						// 		response.txLink = self.getTxLink(response.transactionHash);
						// 		resolve(self.response(true, 'Transaction Sent!', response));
							
						// 	}, function(error){
						// 		reject(self.response(false, `${error}`));
						// 	}
						// );
					} catch (error){
						reject(self.response(false, error.message));
					}
				}, function(error){
					reject(self.response(false, `${error}`));
				});
			}
		
		});

		return txPromise;
	}


	function getValue(VerfCode) {
		var VerfCode = VerfCode;
		if(VerfCode){
			var ErrShowVerfCodeInfo="There is a error when show verification code,.errcode is:";
			var ErrTooFewInfo="Verification code is too few,pls input again.";
			var Tips="already show verfication code on ChaKey,Pls input this code and pay again.";
			// var SuccessTips="Already pay.";
			var ErrConfirmInfo="There was a error when confirm pay,error code is:";
			if(VerfCode.length<1)
			{
				//show verification code to ChaKey's screen and wait for the user input this code.
				//out : Err==0 //sucess else error
				lasterror=mIChaKey.ChaKeyShowVerfCode();
				if( lasterror !=0 ) {SendErrMsgEx(event,ErrShowVerfCodeInfo);return;}
				SendMsg(event,Tips);
				return  ;
			}
			else
			{
				//lenght of verfication code == IChaKey.CHAKEY_PWD_LEN ?
				if(VerfCode.length <  IChaKey.CHAKEY_PWD_LEN){
					SendErrMsg(evnet,ErrTooFewInfo);return ;
				}
		
				lasterror=  mIChaKey.ChaKeyConFirmPay(VerfCode)
				if(lasterror != 0 )
				{
					SendErrMsgEx(event,ErrConfirmInfo);
					return false;
				}
			}
		}
	 }

	////////////////////sub function of pay/////////
    function GetUserAction(lasterror ,Paystatus,CB,txb)
    {
        if(Paystatus.CountDown>0 && lasterror==IChaKey._WAITFOR_USER_ACTION)
        {
            player.play('./Windows Ding.wav', (err) => {
                if (err) console.log(`Could not play sound: ${err}`);
            });
            
        }
        if(lasterror!=0)return;
        if(Paystatus.Status== IChaKey.CONFIRM)//pay 
        {
			return CB(txb);
            //    return true;
        }
        else 
        {  
            if(Paystatus.Status== IChaKey.CANCEL)//cancel pay be user
            {
                alert("The user cancel to pay.")
            }
            else//over  pay time. 
            {
                alert("over pay time , cancel to pay.")
            }
            return false;
        }
                
    }
    
    function TestVerEth(tx)
    {
        const serializedTx = tx.serialize()
    
        var infura_ley = '5GZBABYhPzfctlTOIiXu'
        var networkUrl = 'https://ropsten.infura.io/'+infura_ley;
        web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
        return serializedTx;
	} 
	
	function SendErrMsg(event,ErrMsg)
	{
		event.sender.send('ErrMsg', ErrMsg)
	}

	function SendMsg(event,Msg)
	{
		event.sender.send('Msg', Msg)
	}

	function SendErrMsgEx(event,ErrMsg)
	{
		mIChaKey.myErrMsgbox(ErrMsg,lasterror,event);
	}



}
W3Ether = new W3Ether();