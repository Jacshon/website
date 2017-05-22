(function() {
    angular.module('app.common').service('serverAPI', serverAPI);

    serverAPI.$inject = ['$http', '$q', '$cacheFactory'];

    function serverAPI($http, $q, $cacheFactory) {
        this.postData = postData;
        this.getData = getData;
        this.getCashedData = getCashedData;
        this.clearCashedData = clearCashedData;

        function postData(url, data) {
            var deferred = $q.defer();
            return $http.post(url, data)
                .then(function(response) {
                    if (response.data.status == "ERROR") {
                        deferred.reject(response);
                        return deferred.promise;
                    }
                    deferred.resolve(response.data.data);
                    return deferred.promise;
                }, function(response) {
                    deferred.reject(response);
                    return deferred.promise;
                });
        }

        function getData(url, data) {
            var deferred = $q.defer();
            var config = {
                params: data
            };
            return $http.get(url, config)
                .then(function(response) {
                        if (response.data.status == "ERROR") {
                            deferred.reject(response);
                            return deferred.promise;
                        }
                        deferred.resolve(response.data.data);
                        return deferred.promise;
                    },
                    function(response) {
                        deferred.reject(response);
                        return deferred.promise;
                    });
        }

        function getCashedData(url, data) {
            var deferred = $q.defer();
            var config = {
                cache: true,
                params: data
            };
            return $http.get(url, config)
                .then(function(response) {
                    if (response.data.status == "ERROR") {
                        deferred.reject(response);
                        return deferred.promise;
                    }
                    deferred.resolve(response.data.data);
                    return deferred.promise;
                }, function(response) {
                    deferred.reject(response);
                    return deferred.promise;
                });
        }

        function clearCashedData(url) {
            var $httpDefaultCache = $cacheFactory.get('$http');
            $httpDefaultCache.remove(url);
        }
    }
})();
