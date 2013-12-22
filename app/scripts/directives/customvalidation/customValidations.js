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