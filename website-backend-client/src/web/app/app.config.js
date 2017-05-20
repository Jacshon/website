/**
 * Created by WWJ on 2017/5/18.
 */
(function () {
    angular.module('website-backend').config(configure);
    configure.$inject = ['$stateProvider','$urlRouterProvider'];
    function configure($stateProvider,$urlRouterProvider) {
        // For any unmatched url, redirect to /module-warpper
        $urlRouterProvider.otherwise('/home/index');
        $stateProvider.state('home',{
            url:"/home",
            templateUrl:"app/common/templates/module-wrapper.html",
            data: {
                pageTitle: 'Home'
            }
        }).state('home.index',{
            url:"/index",
            templateUrl:"app/common/templates/home.html",
            data:{
                pageTitle:'Home Page'
            }
        })
    }
})();