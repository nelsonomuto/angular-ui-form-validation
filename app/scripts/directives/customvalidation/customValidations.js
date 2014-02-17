angular_ui_form_validations = (function(){
    
    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex, getValidationAttributeValue,
        getValidatorByAttribute, getCustomTemplate, customTemplates, isCurrentlyDisplayingAnErrorMessageInATemplate,
        currentlyDisplayedTemplate, dynamicallyDefinedValidation, callValidator, customValidationIsValid;     

    customTemplates = [];

    customValidations = [];

    customValidationIsValid = function (errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope, asynchronousIsValid, runCustomValidations, formatterArgs) {
        var isValid;

        if (typeof(asynchronousIsValid) !== 'undefined') {
            if(formatterArgs.validator === asynchronousIsValid.validator) {
                isValid = true; //should always be true if asynchronousIsValid is defined
            }
        } else {
            isValid = formatterArgs.validator(errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope);
        }
        
        if(typeof(isValid.then) !== 'undefined') {
            //then isValid is a promise
            (function(validationPromise){
                validationPromise.success(valid);
                    $log.log('asynchronous validation success, isValid:', valid);
                    if(valid === true){
                        runCustomValidations(errorMessageElement, {validator: formatterArgs.validator});
                    }
                validationPromise.error(function(error){
                    $log.error('asynchronous validation error', error);
                });
            })(isValid);
            isValid  = false;
        }

        return isValid;
    };

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
        } else if(typeof(validatorReturnValue) === 'boolean'){
            callback(validatorReturnValue);
        } else {
            throw('validator must return a promise or a boolean');
        }
    };

    dynamicallyDefinedValidation = {
        customValidationAttribute: 'validationDynamicallyDefined',
        errorCount: 0,
        _errorMessage: 'Field is invalid',
        _success: function () {},
        success: function () { 
            return dynamicallyDefinedValidation._success && dynamicallyDefinedValidation._success.apply(this, arguments); 
        },
        errorMessage: function () { 
            return dynamicallyDefinedValidation._errorMessage; 
        },
        validator: function (errorMessageElement, val, attr, element, model, modelCtrl, scope) {
            var valid, i, validation;            

            for(i = 0; i < scope[attr].length; i++ ){
                validation = scope[attr][i];
                dynamicallyDefinedValidation._errorMessage = validation.errorMessage;     
                dynamicallyDefinedValidation._success = validation.success;     
                valid = validation.validator.apply(scope, arguments);
                if(valid === false){
                    dynamicallyDefinedValidation.errorCount++;
                    break;
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

    isCurrentlyDisplayingAnErrorMessageInATemplate = function (inputElement) {
        var isCurrentlyDisplayingAnErrorMessageInATemplate = false;
        angular.forEach(customTemplates, function (template){
            if(template.parent().is(inputElement.parents('form'))){
                isCurrentlyDisplayingAnErrorMessageInATemplate = true;  
                currentlyDisplayedTemplate = template;
            }
        });
        return isCurrentlyDisplayingAnErrorMessageInATemplate;
    }

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

                    if(formatterArgs.customValidationAttribute === 'validationDynamicallyDefined') {
                        $scope.$watch(function(){ return dynamicallyDefinedValidation.errorCount; }, function () {
                            errorMessageElement.html(dynamicallyDefinedValidation.errorMessage());
                        });
                    }
                    
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

                    runCustomValidations = function (errorMessageElement, asynchronousIsValid) {
                        var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage, 
                            currentErrorMessage, currentErrorMessageIsStale,
                            currentErrorMessageValidator, currentErrorMessagePriorityIndex, 
                            currentErrorMessageIsOfALowerPriority, successFn, fieldNameSelector;


                         

                        fieldNameSelector = '[data-custom-field-name="'+ $element.attr('name') +'"]';

                        successFn = formatterArgs.success || function(){};

                        currentErrorMessage = isCurrentlyDisplayingAnErrorMessageInATemplate($element) ?
                            currentlyDisplayedTemplate.children('.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                                '.CustomValidationError[style="display: block;"]'+fieldNameSelector)
                            : $element.siblings('.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                                '.CustomValidationError[style="display: block;"]'+fieldNameSelector);

                        currentlyDisplayingAnErrorMessage = currentErrorMessage.length > 0;

                        value = $element.val().trimRight();
                        
                        if((/select/).test($element[0].type)){
                            value = $element[0].options[$element[0].selectedIndex].innerHTML;
                        }

                        if (formatterArgs.customValidationAttribute === 'validationFieldRequired') {
                            if(value === '') {
                                $element.parents('form').find('label[for='+$element.attr('id')+']').addClass('requiredFieldLabel');
                            } else {
                                $element.parents('form').find('label[for='+$element.attr('id')+']').removeClass('requiredFieldLabel');                                
                            }
                        }

                        //TODO: create interceptor to check if validator returns a promise, in which case replace it with a function returning true and if the promise resolves
                        //as false(invalid) then re-run validations but now with a function returning false.
                        //use closure to check whether value changed before returning false if promise resolve as false, if value changed return true as promise resolves again
                        //think about performance and how often server calls will be made: ex for email check only make unique check call if email is valid   

                        isValid = customValidationIsValid(errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope, asynchronousIsValid, runCustomValidations, formatterArgs);

                        // if(typeof(asynchronousIsValid) !== 'undefined'){
                        //     if(formatterArgs.validator === asynchronousIsValid.validator) {
                        //         isValid = true; //should always be true if asynchronousIsValid is defined
                        //     }
                        // } else {
                        //     isValid = formatterArgs.validator(errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope);
                        // }
                        
                        // if(typeof(isValid.then) !== 'undefined') {
                        //     //then isValid is a promise
                        //     (function(validationPromise){
                        //         validationPromise.success(valid);
                        //             $log.log('asynchronous validation success, isValid:', valid);
                        //             if(valid === true){
                        //                 runCustomValidations(errorMessageElement, {validator: formatterArgs.validator});
                        //             }
                        //         validationPromise.error(function(error){
                        //             $log.error('asynchronous validation error', error);
                        //         });
                        //     })(isValid);
                        //     isValid  = false;
                        // }


                        ngModelController.$setValidity(formatterArgs.customValidationAttribute.toLowerCase(), isValid);

                        customValidationBroadcastArg = {
                            isValid: isValid,
                            validation: formatterArgs.customValidationAttribute,
                            model: model,
                            controller: ngModelController,
                            element: $element
                        };

                        
                        callValidator(formatterArgs.validator, $scope, [errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope], function (isValid) {                         
                            
                            if(! currentlyDisplayingAnErrorMessage) {
                                $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                                    .toggle(!isValid);
                            } else if(! isCurrentlyDisplayingAnErrorMessageInATemplate($element)){ 
                                currentErrorMessageValidator = getValidatorByAttribute(currentErrorMessage.attr('data-custom-validation-attribute'));
                                currentErrorMessageIsStale = currentErrorMessageValidator(errorMessageElement.clone(), value, $attrs[currentErrorMessage.attr('data-custom-validation-attribute')], $element, model, ngModelController, $scope);
                                
                                currentErrorMessagePriorityIndex = parseInt(currentErrorMessage.attr('data-custom-validation-priorityIndex'), 10);
                                currentErrorMessageIsOfALowerPriority = currentErrorMessagePriorityIndex >= getValidationPriorityIndex(formatterArgs.customValidationAttribute);
                                
                                if (currentErrorMessageIsStale || (!currentErrorMessageIsStale && currentErrorMessageIsOfALowerPriority && !isValid)) {
                                    currentErrorMessage.hide();
                                    $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                                        .toggle(!isValid);                        
                                }                      
                            }

                            if(isCurrentlyDisplayingAnErrorMessageInATemplate($element)) {
                                currentErrorMessageValidator = getValidatorByAttribute(currentErrorMessage.attr('data-custom-validation-attribute'));
                                currentErrorMessageIsStale = currentErrorMessageValidator(
                                    errorMessageElement,
                                    value, 
                                    getValidationAttributeValue($attrs[currentErrorMessage.attr('data-custom-validation-attribute')]), 
                                    $element, model, ngModelController
                                );
                                
                                currentErrorMessagePriorityIndex = parseInt(currentErrorMessage.attr('data-custom-validation-priorityIndex'), 10);
                                currentErrorMessageIsOfALowerPriority = currentErrorMessagePriorityIndex >= getValidationPriorityIndex(formatterArgs.customValidationAttribute);
                                
                                if (currentErrorMessageIsStale || (!currentErrorMessageIsStale && currentErrorMessageIsOfALowerPriority && !isValid 
                                    && currentlyDisplayedTemplate.children().attr('class').indexOf(formatterArgs.customValidationAttribute) === -1)) {
                                    currentErrorMessage.hide();
                                    $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                                        .toggle(!isValid);                              
                                    $scope.$broadcast('errorMessageToggled');
                                }                      
                            }

                            $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);
                            return value;
                        });

                        $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);

                        onValidationComplete(!(currentlyDisplayingAnErrorMessage || isCurrentlyDisplayingAnErrorMessageInATemplate($element) || !isValid), value, validationAttributeValue, $element, model, ngModelController, $scope, successFn);

                        return value;
                    };

                    ngModelController.$parsers.push(function() {
                        return runCustomValidations(errorMessageElement);
                    });

                    $scope.$on('runCustomValidations', function () {
                        runCustomValidations(errorMessageElement);
                    });
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
        getValidationAttributeValue: getValidationAttributeValue
    };

})();