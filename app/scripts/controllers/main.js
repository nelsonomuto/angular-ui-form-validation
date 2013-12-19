'use strict';

angular.module('angularUiFormValidationApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    angular.extend($scope, {
    	user: new (function () {
    		angular.extend(this, {
    			username: null,
    			password: null,
    			confirmPassword: null,
    			email: null,
    			firstName: null,
    			lastName: null
    		});
    	})()
    });
  });
