angular_ui_form_validations = (function(){
    
    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex, getValidationAttributeValue,
        getValidatorByAttribute, getCustomTemplate, customTemplates,
        currentlyDisplayedTemplate, dynamicallyDefinedValidation, callValidator;     

    customTemplates = [];

    customValidations = [];

    callValidator = function (validator, scope, args, callback) {
        var validatorReturnValue;

        validatorReturnValue = validator.apply(scope, args);

        if(validatorReturnValue && typeof(validatorReturnValue.then) === 'function') {
            validatorReturnValue.then(function (){
                callback(true);
            })
            .catch(function(){
                callback(false);
            });
        } else if(typeof(validatorReturnValue) === 'boolean') {
            callback(validatorReturnValue);
        } else {
            throw('validator must return a promise or a boolean');
        }
    };

    dynamicallyDefinedValidation = {
        customValidationAttribute: 'validationDynamicallyDefined',
        errorCount: 0,
        toggleErrorMessage: function (isValid, validatorArguments) {
            var errorMessage, modelCtrl;

            errorMessage = validatorArguments[0];
            modelCtrl = validatorArguments[5];
            
            console.debug('toggling errorMessage', errorMessage, ! isValid);
            errorMessage.toggle(! isValid); 

            errorMessage.html(dynamicallyDefinedValidation.errorMessage());

            if (isValid === true) {
                dynamicallyDefinedValidation.success.apply(this, validatorArguments);
            }
        },
        _errorMessage: 'Field is invalid',
        _success: function () {},
        success: function () { 
            return dynamicallyDefinedValidation._success && dynamicallyDefinedValidation._success.apply(this, arguments); 
        },
        errorMessage: function () { 
            return dynamicallyDefinedValidation._errorMessage; 
        },
        validator: function (errorMessageElement, val, attr, inputElement, model, modelCtrl, scope, asynchronousIsValid, runCustomValidations, formatterArgs, propertyName) {
            var valid, i, validation, validatorArguments;            

            validatorArguments = arguments;

            for(i = 0; i < scope[attr].length; i++ ){
                validation = scope[attr][i];
                dynamicallyDefinedValidation._errorMessage = validation.errorMessage;     
                dynamicallyDefinedValidation._success = validation.success;     
                valid = validation.validator.apply(scope, arguments);

                if(valid && typeof(valid.then) === 'function') {//validator returns a promise
                    valid.then(function (errorMessage, success) { 
                        return function (isValid){
                            if(inputElement.val() === val) {//value we made the asynch request with did not change
                                dynamicallyDefinedValidation._errorMessage = errorMessage;  
                                dynamicallyDefinedValidation.toggleErrorMessage(isValid, validatorArguments);
                            } else {//re-do validation with new value

                            }
                        }
                    }(validation.errorMessage, validation.success))
                    .catch(function(){
                        console.log('asynchronous validator deferred rejected');
                    });
                } else {//validator returns a boolean
                    if(valid === false){
                        dynamicallyDefinedValidation.toggleErrorMessage(valid, validatorArguments);
                        break;
                    }  
                }              
            };
            
            return valid;
        }
    };    

    onValidationComplete = function (fieldIsValid, value, validationAttributeValue, $element, model, ngModelController, $scope, customOnSuccess) {
        if(fieldIsValid) {
            $element.addClass('ValidationLiveSuccess');
            customOnSuccess.call(this, value, validationAttributeValue, $element, model, ngModelController, $scope);
        } else {
            $element.removeClass('ValidationLiveSuccess');
        }
    };

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

    getValidationAttributeByPropertyName = function (attr, property) {
        var value;

        try{
            value = JSOL.parse(attr)[property];
        } catch (e) {
            value = null;
        }

        return value;
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
        var i, index;

        for(i = 0; i < customValidations.length; i++ ){
            if(customValidations[i].customValidationAttribute === customValidationAttribute){
                index = i;
                break;
            }
        }

        return index;
    };

    createValidationFormatterLink = function (formatterArgs, templateRetriever, $q, $timeout, $log) {
        
        return function($scope, $element, $attrs, ngModelController) {
            var customErrorMessage, errorMessage, errorMessageElement, modelName, model, propertyName, runCustomValidations, validationAttributeValue, customErrorTemplate;
            $timeout(function() {
                validationAttributeValue = getValidationAttributeValue($attrs[formatterArgs.customValidationAttribute]);

                if (validationAttributeValue && validationAttributeValue !== 'undefined' && validationAttributeValue !== 'false' ) {
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
                    
                    getCustomTemplate($attrs[formatterArgs.customValidationAttribute], templateRetriever, $q).then(function (template) {
                        var errorMessageToggled;
                        customErrorTemplate = angular.element(template);
                        customErrorTemplate.html('');
                        errorMessageToggled = function () {
                            if(errorMessageElement.css('display') === 'inline' || errorMessageElement.css('display') === 'block') {
                                $log.log('error showing');
                                errorMessageElement.wrap(customErrorTemplate);
                                customTemplates.push(angular.element(errorMessageElement.parents()[0]));
                            } else {
                                $log.log('error NOT showing');
                                if(errorMessageElement.parent().is('.' + customErrorTemplate.attr('class'))){
                                    errorMessageElement.unwrap(customErrorTemplate);
                                }
                            }
                        };

                        $scope.$watch(function (){
                            return errorMessageElement.css('display');
                        }, errorMessageToggled);     
                        $scope.$on('errorMessageToggled', errorMessageToggled);            
                    });
                    
                    customErrorMessage = getValidationAttributeByPropertyName($attrs[formatterArgs.customValidationAttribute], 'message');
                    if(customErrorMessage !== null) {
                        errorMessageElement.html(customErrorMessage);    
                    }

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

                            // if(confirmPasswordIsDirty && passwordIsValid){
                            if(passwordIsValid){
                                passwordMatch =  $('[name=password]').val() === $element.val();                        
                                
                                ngModelController.$setValidity('validationconfirmpassword', passwordMatch); 
                                   confirmPasswordElement
                                    .siblings('.CustomValidationError.validationConfirmPassword:first')
                                        .toggle(! passwordMatch);    
                            }                        
                        });
                        return;
                    }

                    if (formatterArgs.customValidationAttribute === 'validationFieldRequired') {
                        $element.parents('form').find('label[for='+$element.attr('id')+']').addClass('requiredFieldLabel');
                    }

                    runCustomValidations = function () {
                        _runCustomValidations(errorMessageElement, {
                            $element: $element,
                            formatterArgs: formatterArgs,
                            validationAttributeValue: validationAttributeValue,
                            model: model,
                            ngModelController: ngModelController,
                            $scope: $scope,
                            $attrs: $attrs,
                            customTemplates: customTemplates,
                            propertyName: propertyName,
                            getValidatorByAttribute: getValidatorByAttribute,
                            getValidationAttributeValue: getValidationAttributeValue,
                            getValidationPriorityIndex: getValidationPriorityIndex,
                            onValidationComplete: onValidationComplete
                        });
                    }

                    ngModelController.$parsers.push(runCustomValidations);

                    $scope.$on('runCustomValidations', runCustomValidations);
                }    

            });
        };    
    };
    
    customValidationsModule = angular.module('directives.customvalidation.customValidations', [
        'directives.invalidinputformatter.invalidInputFormatter',
        'services.templateRetriever'
    ])

    .factory('customValidationUtil', function (templateRetriever, $q, $timeout, $log) {
        return {
            createValidationLink: function (customValidation) {
                customValidations.push(customValidation);
                return createValidationFormatterLink(customValidation, templateRetriever, $q, $timeout, $log)
            }
        }
    })

    .directive('input', function (customValidationUtil) {
        return {
            require: '?ngModel',
            restrict: 'E',            
            link: customValidationUtil.createValidationLink(dynamicallyDefinedValidation)
        };
    })

    .directive('select', function (customValidationUtil) {
        return {
            require: '?ngModel',
            restrict: 'E',            
            link: customValidationUtil.createValidationLink(dynamicallyDefinedValidation)
        };
    })

    .directive('select', function (customValidationUtil) {
        return {
            require: '?ngModel',
            restrict: 'E',            
            link: customValidationUtil.createValidationLink({        
                customValidationAttribute: 'validationFieldRequired',
                errorMessage: 'This is a required field',
                validator: function (errorMessageElement, val){
                    return (/\S/).test(val);    
                }
             })
        };
    });


    //shared config functions
    return {
        getValidationAttributeValue: getValidationAttributeValue,
        debounce: function (func, delay) {
            var now, lastCall;
            lastCall = null;
            return function () {
                now = new Date();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return func.apply(this, arguments);
                }
            }
        }
    };

})();