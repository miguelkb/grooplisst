app.factory('TokenService', function($window) {
		var saveToken = function (token) {
			$window.localStorage['mean-token'] = token;
		};

		var getToken = function () {
			return $window.localStorage['mean-token'];
		};

		var logout = function() {
			$window.localStorage.removeItem('mean-token');
		};

		var getCurrentUser = function() {

			var token = getToken();
			if (token) {
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				if(payload.exp > Date.now() / 1000){
					return {
						token: token,
						email : payload.email,
						name : payload.name
					};
				}
			}

			return null;
		};

		return {
			saveToken : saveToken,
			getToken : getToken,
			logout : logout,
			getCurrentUser: getCurrentUser
		};
	});

app.factory('AuthService', function($http, $window, TokenService) {
			
		var register = function(usser) {
			return $http.post('/api/ussers/register', usser);
		};

		var login = function(usser) {
			return $http.post('/api/ussers/login', usser);
		};

		var getProfile = function () {
			return $http.get('/api/ussers/profile', {
				headers: {
					Authorization: 'Bearer '+ TokenService.getToken()
				}
			});
		};

		return {
			getCurrentUser: TokenService.getCurrentUser,	
			register: register,
			login: login,
			getProfile: getProfile
		};
	});
