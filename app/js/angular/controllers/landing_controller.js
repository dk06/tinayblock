var TinyBlockControllerModule = angular.module('TinyBlock.controllers');

var LandingController = function($scope) {

	$scope.steps = {
		waiting: {id: 1, key: 'waiting', title: 'Waiting for the device'},
		recovery: {id: 3, key: 'recovery', title: 'Recovery'},
		import: {id: 4, key: 'import', title: 'Import Wallets'},
		generate: {id: 4, key: 'generate', title: 'Generate Wallets'},
	};

	$scope.currentStep = $scope.steps['waiting'];

	$scope.goBack = function(step){
		$scope.currentStep = $scope.steps[step];

		// ****IMPORTANT****
		// Add callbacks function for each step
	};
	
	$scope.deviceConnected = function(){
		$scope.currentStep = angular.copy($scope.steps['import']);
		refreshAngular();
		
		console.log($scope.currentStep);
		
		importWallets();
	};

	var importWallets = function(){
		$scope.currentStep.showLoading = true;

		W3Main.importWalletsFromDevice(function(wallets){

			$scope.currentStep.showLoading = false;
			
			var walletsCount = Object.keys(W3Main.wallets).length;

			if(walletsCount== 0){
				$scope.currentStep.message = {text: 'Sorry! No wallet found!', type: 'danger'};
				$scope.currentStep.showGenerateButton = true;
			} else {
				$scope.currentStep.message = {text: 'Great! Wallet found with '+walletsCount+' account(s)', type: 'success'};
			}
			refreshAngular();
		});
	};

	$scope.generateWallets = function(){
		$scope.currentStep = $scope.steps['generate'];
		W3Main.generateMnemonic();
		$scope.currentStep.mnemonic = W3Main.mnemonic;

		$scope.currentStep.message = {text: 'Hold on! Generating your wallet...', type: 'secondary'};
		$scope.currentStep.showLoading = true;
		W3Main.initWallets();
		$scope.currentStep.showLoading = false;
		$scope.currentStep.message = {text: 'Yay! Your wallet is generated!', type: 'success'};

	};

	$scope.clearWallet = function(){
		ipc.send('OnSetSecStringBnt', '0', '');
		W3Main.wallets = {};
		$scope.deviceConnected();
	}

	$scope.goToWalletRecovery = function(){
		$scope.currentStep = $scope.steps['recovery'];
	};

	$scope.recoverWallet = function(){
		W3Main.mnemonic = $scope.currentStep.mnemonic;

		$scope.currentStep.message = {text: 'Hold on! Recovering your wallet...', type: 'secondary'};
		$scope.currentStep.showLoading = true;
		
		W3Main.initWallets();

		$scope.currentStep.showLoading = false;
		$scope.currentStep.message = {text: 'Cheer Up! Your wallet is recovered!', type: 'success'};
		$scope.currentStep.walletGenerated = true;
	};

	var refreshAngular = function(){
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	};

	// DEVICE EVENTS

	ipc.send('onFindChaKey');

	ipc.on('ErrMsg', function (event, error) {
		console.warn(error);
		// $scope.currentStep = $scope.steps['waiting'];
		$scope.$apply();

		if (error == 'ChaKey was out of system.'){
	  	$scope.currentStep = $scope.steps['waiting'];
	  	refreshAngular();
	  }
	});

	ipc.on('Msg', function (event, data) {
		if (data == "Cha Key was Inserted. And Pin was opened."){
			$scope.deviceConnected();	
		} else if (data == "ChaKey was out of system."){
			console.warn(data);
			$scope.currentStep = $scope.steps['waiting'];
			$scope.$apply();
		} else {
			console.warn(data);
		}
	});

};

TinyBlockControllerModule.controller('LandingController', [ '$scope', LandingController]);