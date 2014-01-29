'use strict';

angular.module('angularTemplateRetrieverApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'services.templateRetriever'
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
