(function(){
    var customValidations, toggleValidationMessage, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex,
        getValidatorByAttribute;
    
    customValidations = [
        {
            customValidationAttribute: 'validationFieldRequired',
            errorMessage: 'This is a required field',
            validator: function (val){
                return (/\S/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationConfirmPassword',
            errorMessage: 'Passwords do not match.',
            validator: function (val, attr, element, model, ctrl){
                return model.password.trimRight() === element.val().trimRight();
            }
        },
        {
            customValidationAttribute: 'validationEmail',
            errorMessage: 'Please enter a valid email',
            validator: function (val){
                return (/^.*@.*\..*[a-z]$/i).test(val);
            }
        },
        {
            customValidationAttribute: 'validationNoSpace',
            errorMessage: 'Cannot contain any spaces',
            validator: function (val){
                return (/^[^\s]+$/).test(val);
            }
        },
        {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + attr + ' characters'; },
            validator: function (val, attr){
                return val.length > parseInt(attr, 10);    
            }   
        },
        {
            customValidationAttribute: 'validationMaxLength',
            errorMessage: function (attr) { return 'Maximum of ' + attr + ' characters'; },
            validator: function (val, attr){
                return val.length < parseInt(attr, 10);
            }   
        },
        {
            customValidationAttribute: 'validationOnlyAlphabets',
            errorMessage: 'Valid characters are: A-Z, a-z',
            validator: function (val){
                return (/^[a-z]*$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneUpperCaseLetter',
            errorMessage: 'Must contain at least one uppercase letter',
            validator: function (val){
                return (/^(?=.*[A-Z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneLowerCaseLetter',
            errorMessage: 'Must contain at least one lowercase letter',
            validator: function (val){
                return (/^(?=.*[a-z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneNumber',
            errorMessage: 'Must contain at least one number',
            validator: function (val){
                return (/^(?=.*[0-9]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneAlphabet',
            errorMessage: 'Must contain at least one alphabet',
            validator: function (val, attr, controller) {
                return (/^(?=.*[a-z]).+$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationNoSpecialChars',
            errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
            validator: function (val){
                return (/^[a-z0-9_\-\s]*$/i).test(val);
            }
        }
    ];
    
    getValidatorByAttribute = function (customValidationAttribute) {
        var validator;
        angular.forEach(customValidations, function (validation, idx) {
            if(validation.customValidationAttribute === customValidationAttribute){
                validator = validation.validator;
            }
        });
        return validator;
    };

    getValidationPriorityIndex = function (customValidationAttribute) {
        var index;
        angular.forEach(customValidations, function (validation, idx) {
            if(validation.customValidationAttribute === customValidationAttribute){
                index = idx;
            }
        });
        return index;
    };

    createValidationFormatterLink = function (formatterArgs, $timeout) {
        
        return function($scope, $element, $attrs, ngModelController) {
            var errorMessage, errorMessageElement, modelName, model, propertyName, runCustomValidations;
            
            if($attrs[formatterArgs.customValidationAttribute]){
                modelName = $attrs.ngModel.substring(0, $attrs.ngModel.indexOf('.'));
                propertyName = $attrs.ngModel.substring($attrs.ngModel.indexOf('.') + 1);
                model = $scope[modelName];
                if(typeof(formatterArgs.errorMessage) === 'function'){
                    errorMessage = formatterArgs.errorMessage($attrs[formatterArgs.customValidationAttribute]);
                } else {
                    errorMessage = formatterArgs.errorMessage;
                }
                
                errorMessageElement = angular.element(
                    '<span data-custom-validation-priorityIndex='+ getValidationPriorityIndex(formatterArgs.customValidationAttribute) +
                    ' data-custom-validation-attribute='+ formatterArgs.customValidationAttribute +
                    ' data-custom-field-name='+ $element.attr('name') +
                    ' class="CustomValidationError '+ formatterArgs.customValidationAttribute + ' '+ propertyName +'property">' +
                    errorMessage + '</span>');
                
                $element.after(errorMessageElement);
                errorMessageElement.hide();
                
                if (formatterArgs.customValidationAttribute === 'validationNoSpace') {
                    $element.keyup(function (event){
                        if (event.keyCode === 8) {
                            model[propertyName] = ($element.val().trimRight());
                        }
                    });
                }

                if (formatterArgs.customValidationAttribute === 'validationConfirmPassword') {
                    $element.add('[name=password]').on('keyup blur', function (){
                        var passwordMatch, confirmPasswordElement, passwordElement, confirmPasswordIsDirty, passwordIsValid;     

                        confirmPasswordElement = 
                            this.name === 'confirmPassword'? angular.element(this) : angular.element(this).siblings('[name=confirmPassword]'); 

                        passwordElement = confirmPasswordElement.siblings('[name=password]');

                        confirmPasswordIsDirty = /dirty/.test(confirmPasswordElement.attr('class'));
                        passwordIsValid = /invalid/.test(passwordElement.attr('class')) === false;

                        if(confirmPasswordIsDirty && passwordIsValid){
                            passwordMatch =  $('[name=password]').val() === $element.val();                        

                            $scope.$apply(function () {
                                ngModelController.$setValidity('validationconfirmpassword', passwordMatch); 
                                   confirmPasswordElement
                                    .siblings('.CustomValidationError.validationConfirmPassword:first')
                                        .toggle(! passwordMatch);                                              
                            });
                        }                        
                    });
                    return;
                }

                runCustomValidations = function () {
                    var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage, currentErrorMessage, currentErrorMessageIsStale,
                        currentErrorMessageValidator, currentErrorMessagePriorityIndex, currentErrorMessageIsOfALowerPriority, fieldNameSelector;

                    fieldNameSelector = '[data-custom-field-name="'+ $element.attr('name') +'"]';

                    currentErrorMessage = 
                        $element.siblings('.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                            '.CustomValidationError[style="display: block;"]'+fieldNameSelector);

                    currentlyDisplayingAnErrorMessage = currentErrorMessage.length > 0;

                    value = $element.val().trimRight();

                    isValid = formatterArgs.validator(value, $attrs[formatterArgs.customValidationAttribute], $element, model, ngModelController);

                    ngModelController.$setValidity(formatterArgs.customValidationAttribute.toLowerCase(), isValid);

                    customValidationBroadcastArg = {
                        isValid: isValid,
                        validation: formatterArgs.customValidationAttribute,
                        model: model,
                        controller: ngModelController,
                        element: $element
                    };
                    

                    if(! currentlyDisplayingAnErrorMessage) {
                        $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                            .toggle(!isValid);
                    } else { 
                        currentErrorMessageValidator = getValidatorByAttribute(currentErrorMessage.attr('data-custom-validation-attribute'));
                        currentErrorMessageIsStale = currentErrorMessageValidator(value, $attrs[currentErrorMessage.attr('data-custom-validation-attribute')], $element, model, ngModelController);
                        
                        currentErrorMessagePriorityIndex = parseInt(currentErrorMessage.attr('data-custom-validation-priorityIndex'), 10);
                        currentErrorMessageIsOfALowerPriority = currentErrorMessagePriorityIndex >= getValidationPriorityIndex(formatterArgs.customValidationAttribute);
                        
                        if (currentErrorMessageIsStale || (!currentErrorMessageIsStale && currentErrorMessageIsOfALowerPriority && !isValid)) {
                            currentErrorMessage.hide();
                            $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                                .toggle(!isValid);                        
                        }                      
                    }

                    $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);
                    return value;
                };

                ngModelController.$parsers.push(function() {
                    return runCustomValidations();
                });

                $scope.$on('runCustomValidations', function () {
                    runCustomValidations();
                });
            }    
        };    
    };
    
    customValidationsModule = angular.module('directives.customvalidation.customValidations', []);
    
    angular.forEach(customValidations, function(customValidation){
        customValidationsModule.directive('input', function ($timeout) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: createValidationFormatterLink(customValidation, $timeout)
            };
        });   
    });
    
})();
describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages, passwordInput, confirmPasswordInput;

    beforeEach(function (){
        module('directives.customvalidation.customValidations');
        inject(function ($rootScope, $compile){
            element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                '<input ng-model="user.name" type="text" id="name" name="name" validation-field-required="true" validation-one-number="true" />'+
                '</form>');
            passwordInput = element.find('#password');
            scope = $rootScope;
            angular.extend(scope, {
                user: {
                    name: null,
                    password: null,
                    confirmPassword: null
                }
            });
            $compile(element)(scope);
            scope.$digest();
            errorMessages = element.find('.CustomValidationError');
        });
    });

    it('should contain all error messages', function () {
        expect(10).toEqual(errorMessages.length);
    });

    it('should contain all hidden error messages', function () {
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

        expect(10).toEqual(hiddenErrorMessages.length);
        expect(0).toEqual(visibleErrorMessages.length);
    });

    it('should show errors one at a time per field', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual($(visibleErrorMessages[0]).html().trim());
        expect('This is a required field').toEqual($(visibleErrorMessages[1]).html().trim());
    });

    it('should show errors based on the order in the custom validations and hide resolved error messages', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

        passwordInput.val('sadffsdaadfsfDsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
    });
    
    describe('confirmPassword', function(){
        beforeEach(function (){
            inject(function ($rootScope, $compile){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                    'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                    'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                    '<input ng-model="user.confirmPassword" type="text" id="confirmPassword" name="confirmPassword" validation-confirm-password="true" />'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain nine hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(9).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());   

            passwordInput.val('sadffsdaadfsSfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim()); 
        });        
    });
});
angular.module('directives.invalidinputformatter.invalidInputFormatter', [])
.directive('input', function() { 
    /**
     * Improving inconsistencies in how AngularJS parses data entry
     * See: http://blog.jdriven.com/2013/09/how-angularjs-directives-renders-model-value-and-parses-user-input/
     * 
     * AngularJS doesn’t show invalid model values bound to an <input/>
     * There is also an open bug report about this: issue #1412 – input not showing invalid model values.
     * Bug report link: https://github.com/angular/angular.js/issues/1412
     */
    
    return {
        require: '?ngModel',
        restrict: 'E',
        link: function($scope, $element, $attrs, ngModelController) {
            var inputType = angular.lowercase($attrs.type);
            
            if (!ngModelController || inputType === 'radio' || inputType === 'checkbox') {
                return;
            }
            
            ngModelController.$formatters.unshift(function(value) {
                if (ngModelController.$invalid && angular.isUndefined(value) && typeof ngModelController.$modelValue === 'string') {
                    return ngModelController.$modelValue;
                } else {
                    return value;
                }
            });
        }
    };
});
angular.module('directives.progressbar.progressBar', [
    'ui.bootstrap.progressbar'
])

.directive('appProgressBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'admin/user/progressBar.tpl.html'//,//Temporarily placed in admin folder until moved out to common location
        //TODO: map common folder - Discuss with team so template can be in directives folder as package
//        templateUrl: 'common/directives/progressbar/progressBar.tpl.html'//,
    };
});