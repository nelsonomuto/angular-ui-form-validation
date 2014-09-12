angular_ui_form_validations = (function(){
    
    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex, getValidationAttributeValue,
        getValidatorByAttribute, getCustomTemplateIfDefined, customTemplates, isCurrentlyDisplayingAnErrorMessageInATemplate,
        currentlyDisplayedTemplate, dynamicallyDefinedValidation, defaultFieldIsValidSuccessFn, $q, $timeout, $log;        

    customTemplates = [];

    customValidations = [];

    dynamicallyDefinedValidation = {
        customValidationAttribute: 'validationDynamicallyDefined',
        errorCount: 0,
        latestElement: null,
        _errorMessage: 'Field is invalid',
        _success: function () {},
        success: function () { 
            return dynamicallyDefinedValidation._success && dynamicallyDefinedValidation._success.apply(this, arguments); 
        },
        errorMessage: function () { 
            return dynamicallyDefinedValidation._errorMessage; 
        },
        validator: function (errorMessageElement, val, attr, element, model, modelCtrl, scope) {
            var valid, hydrateDynamicallyDefinedValidation, scopeValidations, 
                setErrorIdentifier, setValidity, validatorArgs, deferred;
            validatorArgs = arguments;
            scopeValidations = scope[attr];

            hydrateDynamicallyDefinedValidation = function (validation) {
                dynamicallyDefinedValidation._errorMessage = validation.errorMessage;     
                dynamicallyDefinedValidation._success = validation.success;
                return validation;  
            };

            setErrorIdentifier = function (validation, index) {
                var identifier, clone;
                identifier = 'validationdynamicallydefined';

                if(validation.identifier && validation.identifier !== '' && validation.identifier !== null) {
                    identifier += validation.identifier.charAt(0).toUpperCase() + validation.identifier.slice(1).toLowerCase();
                } else {
                    identifier += index;
                }

                clone = angular.copy(validation);
                clone.identifier = identifier;

                return clone;
            };

            setValidity = function (validation) {
                valid = validation.validator.apply(scope, validatorArgs);
                modelCtrl.$setValidity(validation.identifier, valid); 

                return valid === true;
            };

            Lazy(scopeValidations)
                .map(hydrateDynamicallyDefinedValidation)
                .map(setErrorIdentifier)
                .map(setValidity)
                .each(function(valid){
                    if(valid === false){
                        dynamicallyDefinedValidation.errorCount++;
                        dynamicallyDefinedValidation.latestElement = element;
                        return false;
                    } 
                    return true;
                });

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
        Lazy(customTemplates)
            .each(function(template){
                if(template.attr('templateUid') === inputElement.attr('templateUid')){
                    isCurrentlyDisplayingAnErrorMessageInATemplate = true;  
                    currentlyDisplayedTemplate = template;
                    return false;
                }
                return true;
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

    getCustomTemplateIfDefined = function (attr, templateRetriever) {
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

        Lazy(customValidations)
            .each(function (validation) {
                if(validation.customValidationAttribute === customValidationAttribute){
                    validator = validation.validator;
                    return false;
                }
                return true;
            });

        return validator;
    };

    getValidationPriorityIndex = function (customValidationAttribute) {
        var index;

        Lazy(customValidations)
            .each(function(validation, i){
                if(validation.customValidationAttribute === customValidationAttribute){
                    index = i;
                    return false;
                }
                return true;
            });

        return index;
    };

    createValidationFormatterLink = function (formatterArgs, templateRetriever, q, timeout, log) {
        $q = q;
        $timeout = timeout;
        $log = log;

        return function($scope, $element, $attrs, ngModelController) {
            var customErrorMessage, errorMessage, errorMessageElement, modelName, model, propertyName, runCustomValidations, validationAttributeValue, customErrorTemplate;
            
            $timeout(function() {
                var getErrorMessageElement, addWatcherForDynamicallyDefinedValidations, 
                    addWatcherToWrapErrorInCustomTemplate, isValidValidationAttributeValue,
                    getFormatterArgsErrorMessage, installErrorMessageElement, installSpecialErrorCases;

                validationAttributeValue = getValidationAttributeValue($attrs[formatterArgs.customValidationAttribute]);
                isValidValidationAttributeValue = ( validationAttributeValue && ( validationAttributeValue !== 'undefined' )
                        && ( validationAttributeValue !== 'false' ) );

                getErrorMessageElement = function () {
                    return angular.element(
                        '<span data-custom-validation-priorityIndex='+ getValidationPriorityIndex(formatterArgs.customValidationAttribute) +
                        ' data-custom-validation-attribute='+ formatterArgs.customValidationAttribute +
                        ' data-custom-field-name='+ $element.attr('name') +
                        ' class="CustomValidationError '+ formatterArgs.customValidationAttribute + ' '+ propertyName +'property">' +
                        errorMessage + '</span>');
                };

                addWatcherForDynamicallyDefinedValidations = function () {
                    $scope.$watch(function(){ return dynamicallyDefinedValidation.errorCount; }, function () {
                        if (dynamicallyDefinedValidation.errorCount === 0) {
                            return;
                        }
                        var currentElementFieldName = errorMessageElement.attr('data-custom-field-name');
                        var latestValidatedFieldName = dynamicallyDefinedValidation.latestElement.attr('name');
                        if(latestValidatedFieldName === currentElementFieldName) {
                            errorMessageElement.html(dynamicallyDefinedValidation.errorMessage());
                        }
                    });
                };

                addWatcherToWrapErrorInCustomTemplate = function (template) {
                    var errorMessageToggled;
                    customErrorTemplate = angular.element(template);
                    customErrorTemplate.html('');
                    errorMessageToggled = function () {
                        var templateUid = Math.random();
                        if(errorMessageElement.css('display') === 'inline' || errorMessageElement.css('display') === 'block') {
                            $log.log('error showing');
                            $element.attr('templateUid', templateUid);
                            customErrorTemplate.attr('templateUid', templateUid);
                            errorMessageElement.wrap(customErrorTemplate);
                            customTemplates.push(angular.element(errorMessageElement.parents()[0]));
                        } else {
                            $log.log('error NOT showing');
                            $element.removeAttr('templateUid');
                            if(errorMessageElement.parent().is('.' + customErrorTemplate.attr('class'))){
                                errorMessageElement.unwrap(customErrorTemplate);
                            }
                        }
                    };

                    $scope.$watch(function (){
                        return errorMessageElement.css('display');
                    }, errorMessageToggled);     
                    $scope.$on('errorMessageToggled', errorMessageToggled);     
                };

                getFormatterArgsErrorMessage = function () {
                    var errorMessage;

                    if(typeof(formatterArgs.errorMessage) === 'function'){
                        errorMessage = formatterArgs.errorMessage(validationAttributeValue);
                    } else {
                        errorMessage = formatterArgs.errorMessage;
                    }
                    return errorMessage;
                };

                installErrorMessageElement = function () {
                    errorMessage = getFormatterArgsErrorMessage();                    
                    
                    errorMessageElement = getErrorMessageElement();

                    $element.after(errorMessageElement);
                    
                    errorMessageElement.hide();

                    if(formatterArgs.customValidationAttribute === 'validationDynamicallyDefined') {
                        addWatcherForDynamicallyDefinedValidations();
                    }
                    
                    getCustomTemplateIfDefined($attrs[formatterArgs.customValidationAttribute], templateRetriever)
                        .then(function (template) {
                            addWatcherToWrapErrorInCustomTemplate(template);       
                        });
                    
                    customErrorMessage = getValidationAttributeByPropertyName($attrs[formatterArgs.customValidationAttribute], 'message');
                    if(customErrorMessage !== null) {
                        errorMessageElement.html(customErrorMessage);    
                    }

                };

                installSpecialErrorCases = function () {
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

                            if(passwordIsValid){
                                passwordMatch =  $('[name=password]').val() === $element.val();                        
                                
                                ngModelController.$setValidity('validationconfirmpassword', passwordMatch); 
                                confirmPasswordElement.siblings('.CustomValidationError.validationConfirmPassword:first').toggle(! passwordMatch);    
                            }                        
                        });
                        return;
                    }

                    if (formatterArgs.customValidationAttribute === 'validationFieldRequired') {
                        $element.parents('form').find('label[for='+$element.attr('id')+']').addClass('requiredFieldLabel');
                    }
                };

                runCustomValidations = function (errorMessageElement) {
                    var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage, 
                        currentErrorMessage, currentErrorMessageIsStale,
                        currentErrorMessageValidator, currentErrorMessagePriorityIndex, 
                        currentErrorMessageIsOfALowerPriority, successFn;

                    successFn = formatterArgs.success || function(){};

                    function getCurrentlyDisplayingErrorMessage () {
                        var fieldNameSelector, selector;

                        fieldNameSelector = '[data-custom-field-name="'+ $element.attr('name') +'"]';
                        selector = '.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                            '.CustomValidationError[style="display: block;"]'+fieldNameSelector;

                        if(isCurrentlyDisplayingAnErrorMessageInATemplate($element)) {
                            return currentlyDisplayedTemplate.children(selector);
                        } else {
                            return $element.siblings(selector);
                        }
                    }

                    function getElementValue() {
                        var value = $element.val().trimRight();
                    
                        if((/select/).test($element[0].type)){
                            value = $element[0].options[$element[0].selectedIndex].innerHTML;
                        }
                        if((/checkbox|radio/).test($element[0].type)){
                            value = $element[0].checked === true? 'true' : '';
                        }

                        return value;
                    }

                    function toggleRequiredLabelClass() {
                        if(value === '') {
                            $element.parents('form').find('label[for='+$element.attr('id')+']').addClass('requiredFieldLabel');
                        } else {
                            $element.parents('form').find('label[for='+$element.attr('id')+']').removeClass('requiredFieldLabel');                                
                        }
                    }

                    function runValidation() {
                        return formatterArgs.validator(errorMessageElement, 
                            value, validationAttributeValue, $element, model, 
                            ngModelController, $scope);
                    }

                    function getPropertyNameClass (pname) {
                        return pname.replace('.', '\\.');
                    }

                    function whenIsNotCurrentlyDisplayingAnErrorMessage() {
                        $log.log('is not currently displaying an error message', customValidationBroadcastArg);
                        var classNames = ".CustomValidationError."+ formatterArgs.customValidationAttribute + "." + getPropertyNameClass(propertyName) + "property:first";
                        $log.log(classNames);
                        $element.siblings(classNames).toggle(!isValid);
                    }

                    function whenIsNotCurrentlyDisplayingAnErrorMessageInATemplate(){
                        $log.log('is not currently displaying an error message in a template', customValidationBroadcastArg);
                        currentErrorMessageValidator = getValidatorByAttribute(currentErrorMessage.attr('data-custom-validation-attribute'));
                        currentErrorMessageIsStale = currentErrorMessageValidator(errorMessageElement.clone(), value, $attrs[currentErrorMessage.attr('data-custom-validation-attribute')], $element, model, ngModelController, $scope);

                        currentErrorMessagePriorityIndex = parseInt(currentErrorMessage.attr('data-custom-validation-priorityIndex'), 10);
                        currentErrorMessageIsOfALowerPriority = currentErrorMessagePriorityIndex >= getValidationPriorityIndex(formatterArgs.customValidationAttribute);

                        if (currentErrorMessageIsStale || (!currentErrorMessageIsStale && currentErrorMessageIsOfALowerPriority && !isValid)) {
                            currentErrorMessage.hide();
                            $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + getPropertyNameClass(propertyName) + 'property:first')
                                .toggle(!isValid);
                        }
                    }

                    function whenIsCurrentlyDisplayingAnErrorMessageInATemplate(){
                        $log.log('is currently displaying an error message in a template', customValidationBroadcastArg);
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
                            $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + getPropertyNameClass(propertyName) + 'property:first')
                                .toggle(!isValid);
                            $scope.$broadcast('errorMessageToggled');
                        }
                    }

                    currentErrorMessage = getCurrentlyDisplayingErrorMessage();

                    currentlyDisplayingAnErrorMessage = currentErrorMessage.length > 0;

                    value = getElementValue();

                    if (formatterArgs.customValidationAttribute === 'validationFieldRequired') {
                        toggleRequiredLabelClass();
                    }

                    isValid = runValidation();

                    ngModelController.$setValidity(formatterArgs.customValidationAttribute.toLowerCase(), isValid);

                    var status = isValid === true ? ' passed' : ' failed';

                    customValidationBroadcastArg = {
                        isValid: isValid,
                        validation: $element.attr('id') + ' ' + formatterArgs.customValidationAttribute + status,
                        model: model,
                        controller: ngModelController,
                        element: $element
                    };

                    if(! currentlyDisplayingAnErrorMessage) {
                        whenIsNotCurrentlyDisplayingAnErrorMessage();
                    } else if(! isCurrentlyDisplayingAnErrorMessageInATemplate($element)){
                        whenIsNotCurrentlyDisplayingAnErrorMessageInATemplate();
                    }

                    if(isCurrentlyDisplayingAnErrorMessageInATemplate($element)) {
                        whenIsCurrentlyDisplayingAnErrorMessageInATemplate();
                    }

                    $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);

                    onValidationComplete(!(currentlyDisplayingAnErrorMessage || isCurrentlyDisplayingAnErrorMessageInATemplate($element) || !isValid), value, validationAttributeValue, $element, model, ngModelController, $scope, successFn);

                    return value;
                };

                if (isValidValidationAttributeValue === true) {
                    modelName = $attrs.ngModel.substring(0, $attrs.ngModel.indexOf('.'));
                    propertyName = $attrs.ngModel.substring($attrs.ngModel.indexOf('.') + 1);
                    model = $scope[modelName];

                    installErrorMessageElement();
                    
                    installSpecialErrorCases();                    

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