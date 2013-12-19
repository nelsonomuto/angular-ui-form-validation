angular.module('directives.progressbar.progressBar', [
    'ui.bootstrap.progressbar'
])

.directive('appProgressBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'admin/user/progressBar.tpl.html'//,//Temporarily placed in admin folder until moved out to common location
        //TODO: map common folder - Discuss with team so template can be in directives folder as package
//        templateUrl: 'common/directives/progressbar/progressBar.tpl.html'//,
    };
});