angular.module('angularUiFormValidationApp', [
  'directives.customvalidation.customValidationTypes'
])

.controller('MainCtrl', function ($scope) {

  angular.extend($scope, {
      user: {
        username: null,
        password: null,
        confirmPassword: null,
        email: null,
        firstName: null,
        lastName: null,
        city: null,
        state: null
      },
      states: ['', 'validState', 'invalidState1', 'invalidState2'],
      cities: ['', 'validCity', 'invalidCity1', 'invalidCity2'],
      locallyDefinedValidations: [
          {
              identifier: 'noOnes',
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
