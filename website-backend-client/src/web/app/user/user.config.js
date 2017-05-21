/**
 * Created by weijiang on 2017/5/20.
 */
(function () {
    angular.module('app.user').config(configure);
    configure.$inject = ['$stateProvider','$urlRouterProvider'];
    function  configure($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise();
        $stateProvider.state('user',{
            url : '/user',
            templateUrl : 'app/common/templates/module-wrapper.html',
            data : {
                pageTitle : 'User'
            }
        }).state('user.user-management', {
            url : '/user-management',
            templateUrl : 'app/user/user.html',
            data : {
                pageTitle : 'User'
            },
            resolve : {
                loadDependancies: loadDependancies
            }
        })
    }

    loadDependancies.$inject = ['DataTableSettings'];

    function loadDependancies(DataTableSettings) {
        return DataTableSettings.loadDependancies();
    }

    function setURLS() {
        urls = {

        };
        WEBSITEURLs.setURLS('app.user', urls);
    }
})();