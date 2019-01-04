const CoinList = require("./coin_list.js");
const W3Main = require("./w3_main.js");

var Boot = function(){

	var self = this;

	self.init = function(){
		self.checkForDevice();
	}

	self.checkForDevice = function(){

	}

	self.deviseConnected = function(){
		self.updateUIAfterDeviceConnected();

		W3Main.importWallets(function(err, wallets){
			if(Object.keys(W3Main.wallets).length == 0){
				console.log('No Wallets found');
				W3Main.initWallets();
			} else {
				console.log(wallets);
			}
		});
	}


	// UI related functions

	self.updateUIAfterDeviceConnected = function(){

	}

}
boot = new Boot();
boot.deviseConnected();
console.log(123123123);