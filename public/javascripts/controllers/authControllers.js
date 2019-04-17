app.controller("AuthController", function ($scope, $state, TokenService, AuthService) {
	$scope.credentials = {
		email : "",
		password : ""
	};

	$scope.onSubmit = function () {
		AuthService
			.login($scope.credentials)
			.then(function(response){
				TokenService.saveToken(response.data.token);
				$state.go('lissts');
			});
	};

	$scope.onRegisterClicked = function() {
		$state.go('register');
	}
});

app.controller("RegisterController", function($scope, $state, AuthService, TokenService) {
	$scope.credentials = {
		name : "",
		email : "",
		password : ""
	};

	$scope.onSubmit = function () {
		AuthService
			.register($scope.credentials)
			.then(function(response){
				TokenService.saveToken(response.data.token);
				$state.go('lissts');
			});
	};
});

app.controller("ProfileController", function($scope, AuthService) {
	
	$scope.user = {};
	
	AuthService.getProfile()
		.then(function(response) {
			$scope.user = response.data;
		});
});
