var app = angular.module('groopLisst', ['ui.router', 'ngResource', 'ngToast', 'wu.masonry', 'pascalprecht.translate']);

app.factory('httpRequestInterceptor', function ($q, $window, $location, ngToast, TokenService) {

	return {
		request: function (config) {
			var currentUser = TokenService.getCurrentUser();
			var currentUser = TokenService.getCurrentUser();
			if (currentUser) {
				config.headers['Authorization'] = 'Bearer ' + currentUser.token;
			}
			config.headers['Accept'] = 'application/json';
			return config;
		},
		response: function(response) {
			return response || $q.when(response);
		},
		responseError: function(response) {
			if (response.status === 401) {
				$location.path('/login');
				ngToast.danger('Session Expired');
				return $q.reject(resp);
			}
			return response || $q.when(response);
		}
	};		
});

app.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, ngToastProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');

	$stateProvider
		.state('login', { url: '/login', templateUrl: 'partials/auth/login.html', controller: 'AuthController' })
		.state('register', { url: '/register', templateUrl: 'partials/auth/register.html', controller: "RegisterController" })
		.state('profile', { url: '/profile', templateUrl: 'partials/auth/profile.html', controller: "ProfileController" })
		.state('lissts', { url: '/lissts', templateUrl: 'partials/lissts/list.html', controller: "LisstListController" })
		.state('lisst-item', { url: '/lissts/:lisstId', templateUrl: 'partials/lissts/item.html', controller: "LisstItemController" });

	$urlRouterProvider.otherwise("/lissts");

	$translateProvider
		.useStaticFilesLoader({
		    prefix: '/langs/locale-',
		    suffix: '.json'
		})
		.preferredLanguage('es');

	
	ngToastProvider.configure({
		animation: 'slide'
	});

	
});

app.run(function($rootScope, $state, ngToast, TokenService) {
	$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

		if(toState.name === "login"){
			return;
		}

		var currentUser = TokenService.getCurrentUser();

		if(!currentUser) {
			e.preventDefault();
			ngToast.danger('Session Expired');
			$state.go('login');
		}
	});
});