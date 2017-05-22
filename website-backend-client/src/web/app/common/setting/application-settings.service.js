(function() {
    angular.module('app.common').service('applicationSettings', applicationSettings);

    function applicationSettings() {
        var settings = {
            language: window.localStorage.lang || 'en_US'
        };

        function getSettings() {
            return settings;
        }
        return {
            getSettings: getSettings
        };
    }

})();
