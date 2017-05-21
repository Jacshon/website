/**
 * Created by WWJ on 2017/5/18.
 */
(function () {
    angular.module('website-backend').controller("MainCtrl",MainCtrl);

    MainCtrl.$inject = ['$ocLazyLoad', '$state,', '$scope', '$window'];

    function MainCtrl($ocLazyLoad, $state, $scope, $window) {
        var vm = this;
        vm.name = 'weijiang';
        vm.navigate = navigate;

        /**
         *
         * @param moduleName
         * @param status
         * @returns {*}
         */
        function navigate(moduleName, status) {
            return $ocLazyLoad.load([{
                serie: true,
                name: moduleName,
                files: ICMDBFileLoader.getFiles(moduleName)
            }]).then(function() {
                $state.go(status);
            }, function(error) {
                console.log(error);
                $window.location.reload();
            });
        }

    }
})();