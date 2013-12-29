(function(){
    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex,
        getValidatorByAttribute, getCustomTemplate;
    
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
        }//,
        // {
        //     customValidationAttribute: 'validationMinLength',
        //     errorMessage: function (attr) { return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters'; },
        //     validator: function (val, attr){
        //         return val.length > parseInt(attr, 10);    
        //     }   
        // },
        // {
        //     customValidationAttribute: 'validationMaxLength',
        //     errorMessage: function (attr) { return 'Maximum of ' + getValidationAttributeValue(attr) + ' characters'; },
        //     validator: function (val, attr){
        //         return val.length < parseInt(attr, 10);
        //     }   
        // },
        // {
        //     customValidationAttribute: 'validationOnlyAlphabets',
        //     errorMessage: 'Valid characters are: A-Z, a-z',
        //     validator: function (val){
        //         return (/^[a-z]*$/i).test(val);    
        //     }
        // },
        // {
        //     customValidationAttribute: 'validationOneUpperCaseLetter',
        //     errorMessage: 'Must contain at least one uppercase letter',
        //     validator: function (val){
        //         return (/^(?=.*[A-Z]).+$/).test(val);    
        //     }
        // },
        // {
        //     customValidationAttribute: 'validationOneLowerCaseLetter',
        //     errorMessage: 'Must contain at least one lowercase letter',
        //     validator: function (val){
        //         return (/^(?=.*[a-z]).+$/).test(val);    
        //     }
        // },
        // {
        //     customValidationAttribute: 'validationOneNumber',
        //     errorMessage: 'Must contain at least one number',
        //     validator: function (val){
        //         return (/^(?=.*[0-9]).+$/).test(val);    
        //     }
        // },
        // {
        //     customValidationAttribute: 'validationOneAlphabet',
        //     errorMessage: 'Must contain at least one alphabet',
        //     validator: function (val) {
        //         return (/^(?=.*[a-z]).+$/i).test(val);    
        //     }
        // },
        // {
        //     customValidationAttribute: 'validationNoSpecialChars',
        //     errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
        //     validator: function (val){
        //         return (/^[a-z0-9_\-\s]*$/i).test(val);
        //     }
        // }
    ];

    getValidationAttributeValue = function (attr) {
        var value, property;

        property = property || 'value';

        value = attr;

        try{
            value = JSOL.parse(attr)[property];
        } catch (e) {
        }

        return value || attr;
    };

    getCustomTemplate = function (attr, templateRetriever, $q) {
        var deferred, templateUrl, promise;

        deferred = $q.defer();

        promise = deferred.promise;

        try{
            templateUrl = JSOL.parse(attr)['template'];
            if(templateUrl === undefined || templateUrl === null || templateUrl === '') {
                deferred.reject('No template url specified.');                
            } else {
                promise = templateRetriever.getTemplate(templateUrl);
            }

        } catch (e) {
            deferred.reject('Error retrieving custom error template: ' + e);
        }

        return promise;
    };
    
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

    createValidationFormatterLink = function (formatterArgs, templateRetriever, $q) {
        
        return function($scope, $element, $attrs, ngModelController) {
            var errorMessage, errorMessageElement, modelName, model, propertyName, runCustomValidations, validationAttributeValue, customErrorTemplate;

            validationAttributeValue = getValidationAttributeValue($attrs[formatterArgs.customValidationAttribute]);

            if (validationAttributeValue) {
                modelName = $attrs.ngModel.substring(0, $attrs.ngModel.indexOf('.'));
                propertyName = $attrs.ngModel.substring($attrs.ngModel.indexOf('.') + 1);
                model = $scope[modelName];
                if(typeof(formatterArgs.errorMessage) === 'function'){
                    errorMessage = formatterArgs.errorMessage(validationAttributeValue);
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
                
                // getCustomTemplate($attrs[formatterArgs.customValidationAttribute], templateRetriever, $q).then(function (template) {
                //     customErrorTemplate = angular.element(template);
                //     customErrorTemplate.html('');
                //     $scope.$watch(function (){
                //         return errorMessageElement.css('display');
                //     }, function(){
                //         if(errorMessageElement.css('display') === 'inline' || errorMessageElement.css('display') === 'block') {
                //             console.log('error showing');
                //             errorMessageElement.wrap(customErrorTemplate);
                //         } else {
                //             console.log('error NOT showing');
                //             if(errorMessageElement.parent().is('.' + customErrorTemplate.attr('class'))){
                //                 errorMessageElement.unwrap(customErrorTemplate);
                //             }
                //         }
                //     });                    
                // });

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

                            // $scope.$apply(function () { //TODO: deprecate after further test cases prove unnecessary 
                                ngModelController.$setValidity('validationconfirmpassword', passwordMatch); 
                                   confirmPasswordElement
                                    .siblings('.CustomValidationError.validationConfirmPassword:first')
                                        .toggle(! passwordMatch);                                              
                            // });
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

                    isValid = formatterArgs.validator(value, validationAttributeValue, $element, model, ngModelController);

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
    
    customValidationsModule = angular.module('directives.customvalidation.customValidations', ['services.templateRetriever'])

    .factory('customValidationLink', function (templateRetriever, $q) {
        return {
            create: function (customValidation) {
                customValidations.push(customValidation);
                return createValidationFormatterLink(customValidation, templateRetriever, $q)
            }
        }
    });
    
    angular.forEach(customValidations, function(customValidation){
        customValidationsModule.directive('input', function (templateRetriever, $q) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: createValidationFormatterLink(customValidation, templateRetriever, $q)
            };
        });   
    });

    //To create your own validations you need to copy paste this section
    extendCustomValidations = angular.module('extendCustomValidations', ['directives.customvalidation.customValidations']);

    angular.forEach([
         {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters'; },
            validator: function (val, attr){
                return val.length > parseInt(attr, 10);    
            }   
        },
        {
            customValidationAttribute: 'validationMaxLength',
            errorMessage: function (attr) { return 'Maximum of ' + getValidationAttributeValue(attr) + ' characters'; },
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
            validator: function (val) {
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
    ], 

    function(customValidation){
        extendCustomValidations.directive('input', function (customValidationLink) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: customValidationLink.create(customValidation)
            };
        });   
    });
    //**End section to create your own validations

})();