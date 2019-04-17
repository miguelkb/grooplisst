app.factory('LisstService', function($resource) {
		return $resource('api/lissts/:lisstId', {}, {
			query: { method: 'GET', params: { lisstId: '' }, isArray: true },
			update: { method: 'PUT' }
		});
	});

app.factory('LisstSocket', function($rootScope) {
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				})
			}
		};
	});

 