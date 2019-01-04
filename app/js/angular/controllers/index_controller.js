var TinyBlockControllerModule = angular.module('TinyBlock.controllers');

var IndexController = function($scope) {

	$scope.coinList = CoinList;
	console.log($scope.coinList);

	angular.forEach($scope.coinList, function(coin, key){
		console.log('Getting balance for ', coin.library);
		
		var coin_library = window[coin.library];
		if(coin_library){
			coin_library.init();

			coin_library.getBalance(coin.wallet.publicKey).then(function(data){
				// console.log('balance:', coin_library.toEther(data));
				// coin.balance = coin_library.humanizeToken(data.toString());
				coin.balance = data;
				$scope.$apply();
			});
		}
	});

	$scope.$on('$destroy',function(){
    $scope.coinList = {};
	});
	
};

TinyBlockControllerModule.controller('IndexController', [ '$scope', IndexController]);