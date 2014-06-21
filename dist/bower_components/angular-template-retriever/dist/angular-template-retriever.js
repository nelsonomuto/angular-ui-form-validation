angular.module('services.templateRetriever',[])

.factory('templateRetriever', function ($http, $q){
	return {
		getTemplate: function (templateUrl, tracker) {
			var deferred = $q.defer();

			$http({
				url: templateUrl,
				method: 'GET',
				headers: {'Content-Type': 'text/html'},
				tracker: tracker || 'promiseTracker'
			})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data, status, headers, config){
				deferred.reject({
					data: data,
					status: status,
					headers: headers,
					config: config
				});
			});

			return deferred.promise;
		}
	}
});