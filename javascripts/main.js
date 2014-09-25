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
                state: null,
                save: function () {
                    /**
                     * Trigger the runCustomValidations to ensure the form is evaluated before submission
                     */
                    $scope.$broadcast('runCustomValidations');

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
                    $scope.$on('customValidationComplete', function (data) {
                        //console.log(data);
                        //You may perform any business logic here based on the element validation results
                    });

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
                    }
                },
                {
                    errorMessage: 'Cannot contain the number two',
                    validator: function (errorMessageElement, val) {
                        return /2/.test(val) !== true;
                    }
                }
            ]
        });
    });
