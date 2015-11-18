(function () {
    var extendCustomValidations = angular.module('directives.customvalidation.customValidationTypes', [
        'directives.customvalidation.customValidations'
    ]);

    extendCustomValidations.provider('myValidations', function () {

        getValidationAttributeValue = angular_ui_form_validations.getValidationAttributeValue;
        var outOfBoxValidations = [
            {
                customValidationAttribute: 'validationFieldRequired',
                errorMessage: 'This is a required field',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationRequired', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    var valid = (/\S/).test(val);

                    if(valid === false) {
                        console.trace('--- field required is false');
                    }

                    return valid;
                }
            },
            {
                customValidationAttribute: 'validationConfirmPassword',
                errorMessage: 'Passwords do not match.',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationConfirmPassword', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return true; //will be validated on keyup & blur event in directive
                }
            },
            {
                customValidationAttribute: 'validationEmail',
                errorMessage: 'Please enter a valid email',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationEmail', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^.*@.*\..*[a-z]$/i).test(val);
                }
            },
            {
                customValidationAttribute: 'validationNoSpace',
                errorMessage: 'Cannot contain any spaces',
                validateWhileEntering: true,
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationNoSpace', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    if (typeof(val) !== 'undefined' && val.trim() === '') {
                        return true;
                    }
                    return val !== '' && (/^[^\s]+$/).test(val);
                }
            },
            {
                customValidationAttribute: 'validationSetLength',
                errorMessage: '',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationSetLength', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    var customMessage = getValidationAttributeValue(rawAttr, 'message', true);
                    if (val.length === parseInt(getValidationAttributeValue(rawAttr), 10)) {
                        return true;
                    } else {
                        errorMessageElement.html(customMessage || 'Set number of characters allowed is ' + getValidationAttributeValue(rawAttr));
                        return false;
                    }
                }
            },
            {
                customValidationAttribute: 'validationMinLength',
                errorMessage: function (attr) {
                    console.trace('--- validationMinLength errorMessage function');
                    return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters';
                },
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationMinLength', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return val.length >= parseInt(getValidationAttributeValue(attr), 10);
                }
            },
            {
                customValidationAttribute: 'validationMaxLength',
                errorMessage: '',
                validateWhileEntering: true,
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationMaxLength', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });

                    var customMessage = getValidationAttributeValue(rawAttr, 'message', true);
                    var validationAttributeValue = parseInt(getValidationAttributeValue(rawAttr), 10);
                    var valid = val.length < validationAttributeValue;
                    var errorMessage = customMessage || 'Maximum of ' + getValidationAttributeValue(rawAttr) + ' characters';

                    console.debug('--- customValidationTypes#validationMaxLength', {
                        validationAttributeValue: validationAttributeValue,
                        errorMessage: errorMessage,
                        validPassed: valid
                    });

                    if (valid) {
                        return true;
                    } else {
                        errorMessageElement.html(errorMessage);
                        return false;
                    }
                }
            },
            {
                customValidationAttribute: 'validationOnlyAlphabets',
                errorMessage: 'Valid characters are: A-Z, a-z',
                validateWhileEntering: true,
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationOnlyAlphabets', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^[a-z]*$/i).test(val);
                }
            },
            {
                customValidationAttribute: 'validationOneUpperCaseLetter',
                errorMessage: 'Must contain at least one uppercase letter',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationOnlyUpperCaseLetter', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^(?=.*[A-Z]).+$/).test(val);
                }
            },
            {
                customValidationAttribute: 'validationOnlyNumbers',
                errorMessage: 'Must contain only numbers',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationOnlyNumbers', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^[0-9]*$/i).test(val);
                }
            },
            {
                customValidationAttribute: 'validationOneNumber',
                errorMessage: 'Must contain at least one number',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationOneNumber', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^(?=.*[0-9]).+$/).test(val);
                }
            },
            {
                customValidationAttribute: 'validationOneAlphabet',
                errorMessage: 'Must contain at least one alphabet',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationOneAlphabet', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^(?=.*[a-z]).+$/i).test(val);
                }
            },
            {
                customValidationAttribute: 'validationNoSpecialChars',
                validateWhileEntering: true,
                errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationNoSpecialChars', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    return (/^[a-z0-9_\-\s]*$/i).test(val);
                }
            },
            {
                customValidationAttribute: 'validationDateBeforeToday',
                errorMessage: 'Must be prior to today',
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    console.debug('Entering customValidationTypes#validationDateBeforeToday', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr
                    });
                    var now, dateValue;
                    now = new Date();
                    dateValue = new Date(val);
                    dateValue.setDate(dateValue.getDate() + 1);
                    return dateValue < now;
                }
            },
            {
                customValidationAttribute: 'validationDateBefore',
                errorMessage: function (attr) {
                    return 'Must be before ' + getValidationAttributeValue(attr);
                },
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    var beforeDate = attr;
                    console.debug('Entering customValidationTypes#validationSetLength', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr,
                        beforeDate: beforeDate
                    });
                    var dateValue = new Date(val);
                    dateValue.setDate(dateValue.getDate() + 1);
                    return dateValue < new Date(beforeDate);
                }
            },
            {
                customValidationAttribute: 'validationDateAfter',
                errorMessage: function (attr) {
                    return 'Must be after ' + getValidationAttributeValue(attr);
                },
                validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                    var afterDate = attr;
                    console.debug('Entering customValidationTypes#validationSetLength', {
                        errorMessageElement: errorMessageElement,
                        val: val,
                        attr: attr,
                        $element: $element,
                        model: model,
                        ngModelController: ngModelController,
                        $scope: $scope,
                        rawAttr: rawAttr,
                        afterDate: afterDate
                    });
                    var dateValue = new Date(val);
                    dateValue.setDate(dateValue.getDate() + 1);
                    dateValue.setHours(0);
                    return dateValue > new Date(afterDate);
                }
            }
        ];

        var userCustomValidations = [];

        this.addCustomValidations = function (validations) {
            userCustomValidations = userCustomValidations.concat(validations);
        };

        var compileProvider;

        this.setCompileProvider = function (cp) {
            compileProvider = cp;
        };

        var Validations = function () {
            this.compileDirective = function (name, constructor) {
                compileProvider.directive.apply(null, [name, constructor]);
            };

            this.fetch = function () {
                return userCustomValidations.concat(outOfBoxValidations);
            };
        };

        this.$get = function () {
            return new Validations();
        };
    });

    extendCustomValidations.config(function ($compileProvider, myValidationsProvider) {
        myValidationsProvider.setCompileProvider($compileProvider);
    });

    extendCustomValidations.run(function (myValidations) {
        angular.forEach(myValidations.fetch(),

            function (customValidation) {
                myValidations.compileDirective('input', function (customValidationUtil) {
                    return {
                        require: '?ngModel',
                        restrict: 'E',
                        link: customValidationUtil.createValidationLink(customValidation)
                    };
                });
                myValidations.compileDirective('textarea', function (customValidationUtil) {
                    return {
                        require: '?ngModel',
                        restrict: 'E',
                        link: customValidationUtil.createValidationLink(customValidation)
                    };
                });
            });
    });


})();
