/**
 * Created by weijiang on 2017/5/20.
 *
 */
var Constants = (function() {
    var actions = {
        VIEW: 'view',
        EDIT: 'edit',
        ADD: 'add',
        DELETE: 'delete'
    };
    var useConcatFiles = false;
    var useMinfiedFiles = false;
    var isPackagedAsWar = true;
    return {
        getActions: function() {
            return actions;
        },
        useConcatFiles: function() {
            return useConcatFiles;
        },
        useMinfiedFiles: function() {
            return useMinfiedFiles;
        },
        isPackagedAsWar: function() {
            return isPackagedAsWar;
        }
    };
})();

/**
 *
 * @type {{setURLS, getURLS, createUrl}}
 */
var WEBSITEURLs = (function () {
    var url = {};
    var prefix = "";
    if (!Constants.isPackagedAsWar()) {
        prefix = 'http://localhost:8080/website-backend/';
    } else {
        prefix = '../';
    }
    return {
        setURLS: function(moduleName, URLs) {
            url[moduleName] = URLs;
        },
        getURLS: function(moduleName) {
            return url[moduleName];
        },
        createUrl: function(url) {
            return prefix + url;
        }
    };
}());