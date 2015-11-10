/* global alert */
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
                usernameTwo: null,
                lastFourSSN: null,
                password: null,
                confirmPassword: null,
                email: null,
                firstName: null,
                lastName: null,
                state: '',
                isAdmin: null,
                birthdate: new Date(),
                hasKids: null,
                save: function () {
                    /**
                     * Trigger the runCustomValidations to ensure the form is evaluated before submission
                     */
                    $scope.$broadcast('runCustomValidations', {
                        forms: ['demoForm']
                    });

                    /**
                     * The customValidationComplete event will fire for each evaluated property of user
                     *
                     * @param {Object} data = {
             *       isValid: {Boolean},
             *       validation: {string} $element.attr('id') + ' ' + formatterArgs.customValidationAttribute + status,
             *       model: {Object},
             *       controller: {Object} ngModelController,
             *       element: {Object} $element //DOM element
             *   };
                     */
                        // jshint ignore:start
                    $scope.$on('customValidationComplete', function (data) {
                        //console.log(data);
                        //You may perform any business logic here based on the element validation results
                    });
                    // jshint ignore:end
                    /*
                     * The custom validations will display errors after evaluation performed by runCustomValidations is triggered above on line 46.
                     * This will also ensure that the $scope.demoForm.$valid is updated based upon aforementioned evaluation.
                     */
                    if ($scope.demoForm.$valid) {
                        alert('Congratulations, the form is valid and ready to be submitted for further processing!');
                        //Submit for further processing
                    } else {
                        //do nothing or whatever business logic you require
                    }
                }
            },
            states: ['', 'validState', 'invalidState1', 'invalidState2'],
            cities: ['', 'validCity', 'invalidCity1', 'invalidCity2'],
            locallyDefinedValidations: [
                {
                    identifier: 'noOnes',
                    errorMessage: 'Cannot contain the number one',
                    validator: function (errorMessageElement, val) {
                        return /1/.test(val) !== true;
                    },
                    validateWhileEntering: true
                },
                {
                    errorMessage: 'Cannot contain the number two',
                    validator: function (errorMessageElement, val) {
                        return /2/.test(val) !== true;
                    },
                    validateWhileEntering: true
                }
            ]
        });
    });
