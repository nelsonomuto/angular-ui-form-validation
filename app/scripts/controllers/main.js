'use strict';

angular.module('angularUiFormValidationApp')
 
.service('emailAddressAvailable', function ($timeout, $q) {
    return {
        run: function(errorMessageElement, val) {
            var deferred = $q.defer();

            $timeout(function() {
                if(val === 'unavailableemailaddress@gmail.com') {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            }, 1000);

            return deferred.promise;
        }
    }
})

.controller('MainCtrl', function ($scope, emailAddressAvailable, $http, $q, $timeout) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];

  angular.extend($scope, {
      user: {
        username: null,
        password: null,
        confirmPassword: null,
        email: null,
        firstName: null,
        lastName: null,
        state: '',
        isAdmin: null
      },
      states: ['', 'validState', 'invalidState1', 'invalidState2'],
      locallyDefinedValidations: [                  
          {
              errorMessage: 'Cannot contain the number one',
              validator: function (errorMessageElement, val) {
                  return /1/.test(val) !== true;    
              }
          },
          {
              errorMessage: 'Cannot contain the number two',
              validator: function (errorMessageElement, val){
                  return /2/.test(val) !== true;      
              } 
          },
          {
              errorMessage: 'Cannot contain the number three - asynchronous validation simulated with 1 second timeout',
              validator: function (errorMessageElement, val){
                  var deferred = $q.defer();

                  $timeout(function() {
                      if(/3/.test(val) === true) {
                          deferred.resolve(false);
                      } else {
                          deferred.resolve(true);
                      }
                  }, 1000);
                  return deferred.promise;   
              }
          }
      ]
  });
});
