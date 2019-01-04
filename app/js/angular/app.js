angular.module('TinyBlock.controllers',[]);
angular.module('TinyBlock.services',[]);
angular.module('TinyBlock.directives',[]);
var app = angular.module('TinyBlock', [
	'TinyBlock.services',
	'TinyBlock.controllers',
	'TinyBlock.directives',
	'ngRoute',
	'ngAnimate',
	'ngMask',
	'ui.bootstrap'
	// 'ngResource',
	// 'ngMaterial'
]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "templates/pages/landing.html",
      controller: 'LandingController'
    })
    .when("/cha", {
      templateUrl : "templates/extra/cha_landing.html"
    })
    .when("/index", {
      templateUrl : "templates/pages/index.html",
      controller: 'IndexController',
      reload: true
    })
    .when("/home/:coin", {
      templateUrl : "templates/pages/home.html",
      controller: 'HomeController',
      reload: true
    });

    // $locationProvider.html5Mode(true);

    // $locationProvider.html5Mode({
    //   enabled:true,
    //   requireBase: false
    // });
});

// app.config([
// 	'$stateProvider', 
// 	'$urlRouterProvider', 
// 	'$locationProvider', 
// 	function($stateProvider, $urlRouterProvider){
// 		$urlRouterProvider.otherwise('/');
// 	 	$stateProvider
// 	 	.state('login', {
//  			url: '/',
// 			templateURL: './templates/login.html',
// 		});
// 	 // 	.state('app.sign_up', {
// 		// 	url: 'sign_up',
// 		// 	templateUrl: 'users/sign_up.html',
// 		// 	controller: 'SignupController'
// 		// })
// 		// .state('app.sign_in', {
// 		// 	url: 'sign_in',
// 		// 	templateUrl: 'users/sign_in.html',
// 		// 	controller: 'SigninController'
// 		// })
// 		// .state('dashboard', {
// 		// 	abstract: true,
// 		// 	url: '/dashboard',
// 		// 	templateUrl: 'dashboard/layout.html',
// 		// 	controller: 'DashboardController',
// 		// 	resolve: {
// 		// 		currentUser: ['$q','$http',function($q, $http) {
// 		// 			return $http.get("/api/v1/users/me.json");
// 		// 		}],
// 		// 		unAuthorized: ['currentUser', '$q', function(currentUser, $q){
// 		// 			console.log(currentUser.data);
// 		// 			if (!currentUser.data || !currentUser.data.id){
// 		// 				return $q.reject("Not Authorized");
// 		// 			}
// 		// 		}] 
// 		// 	}
// 		// })
// 		// .state('dashboard.index', {
// 		// 	url: '/index',
// 		// 	templateUrl: 'dashboard/index.html',
// 		// 	controller: 'DashboardController',
// 		// })
// 		// .state('dashboard.new', {
// 		// 	url: '/new',
// 		// 	templateUrl: 'dashboard/new.html',
// 		// 	controller: 'DashboardController',
// 		// })
// 		$urlRouterProvider.when('', '/');
	 	
// 		// $locationProvider.html5Mode({
// 		// 	 enabled:true,
// 		// 	 requireBase: false
// 		//  });
// }]);

// // app.run(['$transitions', '$state', function ($transitions, $state) {  
// //   // $transitions.onStart({}, ()=>{
// //   //     authorizeUser();
// //   // });  

// //   $transitions.onError({}, ($transition$) => {
// //   	console.log($transition$._error.detail == 'Not Authorized');
// //   	if ($transition$._error.detail == 'Not Authorized') {
// //       $state.go('app.sign_in');
// //     }
// //   });

// //   $transitions.onSuccess({}, function(transition) {
// //   	w3 = new W3();
// // 	  w3.init_when_ready();
// // 	  w3.init_after_load();
// // 	});
// // }]);