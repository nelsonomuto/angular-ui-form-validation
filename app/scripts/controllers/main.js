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

.controller('MainCtrl', function ($scope, emailAddressAvailable, $http) {
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
        state: ''
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
          }
      ]
  });
});
