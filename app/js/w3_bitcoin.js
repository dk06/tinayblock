// const W3Main = require("./w3_main.js");
const prompt = require('electron-prompt');
const bitcoinjs = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core');
// var MININGFEE = 67800;
var IChaKey=require('./js/IChaKey.js');
var player = require('play-sound')(opts = {});
var mIChaKey=new IChaKey();
const assert = require('assert');
var HID = require('node-hid');

const wif = require('wif');
var transactionData ;

var W3Bitcoin = function(){

	var self = this;

	self.init = function(){
		self.initBTCClient();
		self.initNetwork();
	}

	self.initNetwork = function(){
		// self.network = bitcoinjs.networks.bitcoin;
		self.network = bitcoinjs.networks.testnet;
	}

	self.initBTCClient = function(){	
		self.client = new btcClient({
			headers: true,
			network: 'testnet',
			// host: '18.223.156.234',
			host: '34.220.71.164',
			username: 'bitcoin_testnet',
			port: 18332,
			password: 'w3villa!'
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
	  // var network = bitcoinjs.networks.bitcoin
	  return bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(node.publicKey), self.network.pubKeyHash)
	}

	self.generateAddress = function(){
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
			
			self.client.listUnspent(0, 9999999, [address], (result, transactions) => {
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
		var miningFee = 0.01;// || MININGFEE;

		const promise = new Promise((resolve, reject) => {
			var account = bitcoinjs.ECPair.fromWIF(self.wallet.privateKey, self.network);
			const p2wpkh = bitcoinjs.payments.p2wpkh({ pubkey: account.publicKey, network: self.network })
			const p2sh = bitcoinjs.payments.p2sh({ redeem: p2wpkh, network: self.network })
			var finalTxid, txnhex;

			lasterror=mIChaKey.ClearTokens();
			if(lasterror!=0)
			{
				alert('Wrong device pin');
				resolve(self.response(false, 'device not active and Wrong device pin'));
			}else{
				
				var txn = new bitcoinjs.TransactionBuilder(bitcoinjs.networks.testnet);
				mIChaKey.AddKeyPairs('BTC',account,IChaKey.BTC_SIGNTYPE);
				txn.setVersion(1);
				alice = account;
				
				self.client.listUnspent(0, 99999999, [self.wallet.publicKey], (result, transactions) => {
					if (result && result.name=="RpcError") {
						W3Main.print('Bitcoin error: ', result.message);
						reject(self.response(false, result.message));
					}
					else{
						if (transactions[0].length) {
							var transactionsUsed = 0, input = 0, change;
							for(var transaction of transactions[0]){
								//addInput transaction id
								transactionData = transaction;
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
								//addOutput send to address public id
								txn.addOutput('2NG5f2jQhkfmUAsbwBLGNCapGxhBMehWa7o', amount);
								if (change){
									txn.addOutput('2N6zfNLnYd52jmKD9eF6haPjETEs9e25zrB', amount);
								}
	
								for (var i = 0; i < transactionsUsed; i++) {
									
									// txn.sign(i, account, p2sh.redeem.output, null, transaction.value);
									// txn.sign(0, account);
									
									txn.ChaKeySign(0,'BTC',true,function(lasterror,Paystatus){
										var txnhex = GetUserAction(lasterror,Paystatus,TestVerfBtc,txn)
										if(txnhex){
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
										}else{
											reject(self.response(false, '"Bitcoin Final transaction'));
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
	
										prompt({
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
	
								}
	
								// txnhex = txn.build().toHex();
								console.log('SendRawTransaction process pending');
								// W3Main.print("Bitcoin txnhex: ", txnhex);
								// resolve(self.response(true, 'Transaction sent!', 0));
							}
						}
						else{
							console.log("Bitcoin error:  No unspent transactions present")
							reject(self.response(false, 'No unspent transactions present'));
						}
					}
				});
			}
			
		});

		return promise;
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
    
    function TestVerfBtc(txb)
    {
        const tx = bitcoinjs.Transaction.fromHex(txb.build().toHex());
		
		console.log('TestVerfBtc', tx)

        const p2pkh = bitcoinjs.payments.p2pkh({
            pubkey: alice.publicKey,
            input: tx.ins[0].script
        })
    
        const ss = bitcoinjs.script.signature.decode(p2pkh.signature)
        const hash = tx.hashForSignature(0, p2pkh.output, ss.hashType)
    
		assert.strictEqual(alice.verify(hash, ss.signature), true);
		// var createObj = '[{"txid":"2a8c49b0ca1438eb67fa3e029050a8a4a8595b098a73a15226f3c0b9009ba717","vout":0}]" "[{"2N8QQVzZWBWtBZXCh7SMeB4Cs2Gsn3yPogX\":0.0001}]"'
		// create(transactionData);
		return txb.build().toHex();
        // alert("payed.");;
	}

	//"[{\"txid\":\"2a8c49b0ca1438eb67fa3e029050a8a4a8595b098a73a15226f3c0b9009ba717\",\"vout\":0}]" "[{\"2N8QQVzZWBWtBZXCh7SMeB4Cs2Gsn3yPogX\":0.0001}]"
	
	function create(transaction){
		debugger
		self.client.createRawTransaction([{ txid: transaction.txid, vout: 0 }], { '2NFFsDpNodSk5nbxKvi7SMYVr7E9R4SAwyL': 0.12592400 },(result,data)=>{
			// alert('hello', result,data)
			sign(data[0], transaction);
		});
	}

	function sign(txHa, transaction){
		self.client.signRawTransaction(txHa [
			{
				txid :transaction.txid,
				vout : transaction.vout,
				scriptPubKey:transaction.scriptPubKey,
				redeemScript: transaction.redeemScript
			}
		],[self.wallet.privateKey],(result,data)=>{
			alert('hello', result,data)
			// sendRawTransaction(data[0]);
		});	
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

// module.exports = new W3Bitcoin();
W3Bitcoin = new W3Bitcoin();