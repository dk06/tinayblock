var TinyBlockControllerModule = angular.module('TinyBlock.controllers');

var HomeController = function($scope, $http, $routeParams, $uibModal,w3_bitcon) {
	$scope.coin = CoinList[$routeParams.coin];
	console.log($scope.coin);

	var balanceRefreshRate = 60000;
	$scope.txParams = {};
	$scope.transaction = {};

	$scope.error = {};

	$scope.isArray = Array.isArray;

	var coin_library = window[$scope.coin.library];
	// coin_library = coin_library ? coin_library : w3_bitcon
	if(coin_library){
		coin_library.init();
		coin_library.wallet = $scope.coin.wallet;

		$scope.getCoinBalance = function(){
			coin_library.getBalance($scope.coin.wallet.publicKey).then(
				function(data){
					// console.log('balance:', coin_library.toEther(data));
					$scope.coin.balance = data;
					refreshAngular();
				}, 
				function(error){
					console.log(`${error}`);
				}
			);
		}
		$scope.getCoinBalance();


	var refreshBalance = setInterval(function(){
		console.log('refreshBalance');
		$scope.getCoinBalance();
	}, balanceRefreshRate);

	$scope.coin.token_price_in_usd = 0;
	coin_library.getTokenPriceInUSD().then(
		function(response){
			$scope.coin.token_price_in_usd = JSON.parse(response).ticker.price;
		},
		function(error){
			console.log(error);
		}
	);

	$scope.getTxs = function(){
		if (!coin_library.hasOwnProperty('getTxs')){
			$scope.coin.txs = [];
			return;
		}
		coin_library.getTxs().then(
			function(data){
				console.log(data);
				$scope.coin.txs = data;
				refreshAngular();
			},
			function(error){
				console.log(error);
			}
		);
	};
	$scope.getTxs();

	$scope.sendTokens = function(){
		$scope.disableFormFields();
		console.log($scope.txParams);
		coin_library.validateTxParams($scope.txParams).then(
			function(response){
				$scope.enableFormFields();
				console.log(coin_library.txParams);
				$scope.initTransaction();
				refreshAngular();
				// $scope.authenticateTxFromDevise();
			},
			function(error){
				$scope.enableFormFields();
				console.log(error);
				$scope.error.messages = error;
				refreshAngular();
			}
		);
	}
	}else{
		
		w3_bitcon.init();
		w3_bitcon.wallet = $scope.coin.wallet;

		$scope.getCoinBalance = function(){
			w3_bitcon.getBalance($scope.coin.wallet.publicKey).then(
				function(data){
					// console.log('balance:', w3_bitcon.toEther(data));
					$scope.coin.balance = data;
					refreshAngular();
				}, 
				function(error){
					console.log(`${error}`);
				}
			);
		}
		$scope.getCoinBalance();


	var refreshBalance = setInterval(function(){
		console.log('refreshBalance');
		$scope.getCoinBalance();
	}, balanceRefreshRate);

	$scope.coin.token_price_in_usd = 0;
	w3_bitcon.getTokenPriceInUSD().then(
		function(response){
			$scope.coin.token_price_in_usd = JSON.parse(response).ticker.price;
		},
		function(error){
			console.log(error);
		}
	);

	$scope.getTxs = function(){
		if (!w3_bitcon.hasOwnProperty('getTxs')){
			$scope.coin.txs = [];
			return;
		}
		w3_bitcon.getTxs().then(
			function(data){
				console.log(data);
				$scope.coin.txs = data;
				refreshAngular();
			},
			function(error){
				console.log(error);
			}
		);
	};
	$scope.getTxs();

	$scope.sendTokens = function(){
		$scope.disableFormFields();
		console.log($scope.txParams);
		w3_bitcon.validateTxParams($scope.txParams).then(
			function(response){
				$scope.enableFormFields();
				console.log(w3_bitcon.txParams);
				$scope.initTransaction();
				refreshAngular();
				// $scope.authenticateTxFromDevise();
			},
			function(error){
				$scope.enableFormFields();
				console.log(error);
				$scope.error.messages = error;
				refreshAngular();
			}
		);
	}
	};

	$scope.authenticateTxFromDevise = function(){
		displayOnDevice("Send " + coin_library.txParams.rawValue + $scope.coin.symbol, "To " + coin_library.txParams.to);
		ipc.send('onConfirmPayBnt', '');

		// $scope.authen

	}

	$scope.initTransaction = function(){
		$scope.disableFormFields();
		$scope.showLoading();
		coin_library.initTx().then(
			function(response){
				$scope.enableFormFields();
				$scope.hideLoading();
				console.log(response);
				$scope.transaction = response;
				$scope.clearTxParams();
				refreshAngular();
			},
			function(error){
				$scope.enableFormFields();
				$scope.hideLoading();
				console.log(error);
				$scope.error.messages = error.message;
				refreshAngular();
			}
		);
	};

	$scope.clearTxParams = function(){
		angular.forEach($scope.coin.form_fields.send, function(form_field, index){
			$scope.txParams[form_field.key] = form_field.default;
		});
	};

	$scope.clearTransaction = function(){
		$scope.clearTxParams();
		$scope.transaction = {};
		$('#send-money').modal('hide');
	};

	$scope.humanizeToken = function(rawValue){
		return coin_library.humanizeToken(rawValue);
	};

	$scope.enableFormFields = function(){
		$scope.coin.form_fields.disabled = false;
	};

	$scope.disableFormFields = function(){
		$scope.coin.form_fields.disabled = true;
	};

	$scope.showLoading = function(){
		$scope.coin.loading = true;
	};

	$scope.hideLoading = function(){
		$scope.coin.loading = false;
	};

	var refreshAngular = function(){
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	};

	$scope.openLink = function(link){
		window.openLink(link);
	};

	$scope.$on('$destroy',function(){
    clearInterval(refreshBalance);
    $scope.coin = {};
    coin_library = {};
	});

	// Modals
	
	// $scope.openModal = function(){
	// 	$uibModal.open({
	// 		animation : true,
	// 		// controller : 'shareStoryModalController',
	// 		templateUrl : 'templates/modals/send.html'
	// 	});
	// };
};

TinyBlockControllerModule.controller('HomeController', [ '$scope', '$http', '$routeParams', '$uibModal','w3_bitcon', HomeController]);