/**
 * Created by WWJ on 2017/5/18.
 */
(function () {
    angular.module('website-backend').controller("MainCtrl",MainCtrl);
    MainCtrl.$inject = ['$scope'];
    function MainCtrl($scope) {
        var vm = this;
        vm.name = 'weijiang';
    }
})();