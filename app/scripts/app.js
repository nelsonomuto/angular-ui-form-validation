'use strict';

angular.module('angularUiFormValidationApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'directives.customvalidation.customValidations',
  'directives.invalidinputformatter.invalidInputFormatter'
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
