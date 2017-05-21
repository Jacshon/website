/**
 * Created by weijiang
 * data : 2017/5/20.
 * version :v1.0.0
 */
(function() {
    angular.module('app.common').directive('pageTitle', pageTitle);

    pageTitle.$inject = ['$rootScope', '$timeout'];

    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'WebSite';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = 'WebSite | ' +
                        toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    }
})();