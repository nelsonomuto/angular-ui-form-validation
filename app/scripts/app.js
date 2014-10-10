'use strict';

angular.module('angularUiFormValidationApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'directives.customvalidation.customValidationTypes'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
