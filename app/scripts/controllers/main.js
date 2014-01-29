'use strict';

angular.module('angularUiFormValidationApp')

.controller('MainCtrl', function ($scope) {
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
        state: null
      },
      states: ['validState', 'InvalidState1', 'InvalidState2'],
      locallyDefinedValidations: [                  
          {
              errorMessage: 'Cannot contain the number one',
              validator: function (errorMessageElement, val){
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
