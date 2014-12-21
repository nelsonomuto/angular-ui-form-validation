angular_ui_form_validations = (function(){

    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex, getValidationAttributeValue,
        getValidatorByAttribute, getCustomTemplateIfDefined, customTemplates, isCurrentlyDisplayingAnErrorMessageInATemplate,
        currentlyDisplayedTemplate, dynamicallyDefinedValidation, defaultFieldIsValidSuccessFn, $q, $timeout, $log;

    customTemplates = [];

    customValidations = [];

    var submitLink = function ($scope, $element, $attrs, ngModelController) {
        if(typeof($attrs['validationSubmit']) === 'undefined') {
            return;
        }
        var validationSubmit = getValidationAttributeValue($attrs['validationSubmit'], 'onSubmit', true);
        var formName = getValidationAttributeValue($attrs['validationSubmit'], 'formName', true);
        var form = angular.element('[name='+ formName +']');
        if(form.length === 0){
            form = $element.parents('[name=' + formName + ']');
        }
        validationSubmit = validationSubmit.substring(0, validationSubmit.indexOf('('));
        var submitFunction = $scope[validationSubmit];
        var indexOfDot = validationSubmit.indexOf('.');
        if (indexOfDot !== -1) {
            var model = validationSubmit.substring(0, indexOfDot);
            var modelFunction = validationSubmit.substring(indexOfDot + 1);
            submitFunction = $scope[model][modelFunction];
        }

        var formIsValid = false;//TODO: logic to check if form is valid ($scope.$watch $form.pristine, )

        $element.addClass('invalid');
        $element.removeClass('valid');

        var formIsSubmittable = function () {
            formIsValid = true;
            $element.addClass('valid');
            $element.removeClass('invalid');
        };

        var formIsNotSubmittable = function () {
            formIsValid = false;
            $element.addClass('invalid');
            $element.removeClass('valid');
        };

        $scope.$watch( function (scope) {
            return scope[formName].$valid && $scope[formName].$dirty === true;
        }, function (valid) {
            if (valid === true) {
                formIsSubmittable();

            } else {
                formIsNotSubmittable();
            }
        });

        $element.on('click', function () {
           if(formIsValid === true){
               submitFunction.apply($scope, []);
           }
        });
    };

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

    getValidationAttributeValue = function (attr, property, strict) {
        var value;
        if(attr === undefined) {
            return undefined;
        }
        property = property || 'value';

        value = attr;

        try{
            var json = JSOL.parse(attr);
        } catch (e) {
        }

        if(json !== null && typeof(json) === 'object'){

            if(json.hasOwnProperty(property)){
                hasProperty = true;
                value = json[property];
            } else {
                hasProperty = false;
                value = undefined;
                if(strict !== true){
                    value = json.value;
                }
            }
            return value;

        } else if(strict === true){ //strict assumes you must be passing in an object attr
            return undefined;
        }

        return value;
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

                var rawCustomValidationAttribute = $attrs[formatterArgs.customValidationAttribute];
                validationAttributeValue = getValidationAttributeValue(rawCustomValidationAttribute);
                isValidValidationAttributeValue = ( validationAttributeValue && ( validationAttributeValue !== 'undefined' )
                        && ( validationAttributeValue !== 'false' ) );

                getErrorMessageElement = function () {
                    var ifCheckboxOrRadio = '';
                    if((/checkbox|radio/).test($element[0].type)){
                        ifCheckboxOrRadio = 'checkboxradioerror ';
                    }

                    return angular.element(
                        '<span data-custom-validation-priorityIndex='+ getValidationPriorityIndex(formatterArgs.customValidationAttribute) +
                        ' data-custom-validation-attribute='+ formatterArgs.customValidationAttribute +
                        ' data-custom-field-name='+ $element.attr('name') +
                        ' class="CustomValidationError '+ ifCheckboxOrRadio + formatterArgs.customValidationAttribute + ' '+ propertyName +'property">' +
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
                                model[propertyName] = ($element.val().replace(/\s+$/, ''));
                            }
                        });
                    }
                    if (formatterArgs.customValidationAttribute === 'validationConfirmPassword') {
                        var passwordFieldSelector = '#' + $element.attr('passwordFieldId');
                        $element.add(passwordFieldSelector).on('keyup blur', function (target){
                            var passwordMatch, confirmPasswordElement, passwordElement, confirmPasswordIsDirty, passwordIsValid;

                            confirmPasswordElement =
                              this.hasAttribute('passwordFieldId') === true ? angular.element(this) : angular.element(this).siblings('[passwordFieldId='+this.id+']');

                            passwordElement = confirmPasswordElement.siblings(passwordFieldSelector);

                            confirmPasswordIsDirty = /dirty/.test(confirmPasswordElement.attr('class'));

                            if(confirmPasswordIsDirty === false) {
                                return;
                            }
                            passwordIsValid = /invalid/.test(passwordElement.attr('class')) === false;

                            passwordMatch =  $(passwordFieldSelector).val() === $element.val();

                            ngModelController.$setValidity('validationconfirmpassword', passwordMatch);
                            confirmPasswordElement.siblings('.CustomValidationError.validationConfirmPassword:first').toggle(! passwordMatch);
                            onValidationComplete(passwordMatch, passwordMatch, validationAttributeValue, $element, model, ngModelController, $scope, formatterArgs.success || function(){});
                        });
                        return;
                    }

                    if (formatterArgs.customValidationAttribute === 'validationFieldRequired') {
                        $element.parents('form').find('label[for='+$element.attr('id')+']').addClass('requiredFieldLabel');
                    }
                };

                runCustomValidations = function (eventType) {
                    var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage,
                        currentErrorMessage, currentErrorMessageIsStale,
                        currentErrorMessageValidator, currentErrorMessagePriorityIndex,
                        currentErrorMessageIsOfALowerPriority, successFn;

                    var evaluateAsValid = false;

                    //assuming non-blur events suggest a keypress/keyup/keydown/input event
                    //only blur and runCustomValidations events are always evaluated automatically regardless of validateWhileEntering
                    if(eventType !== 'blur' && eventType !== 'runCustomValidations') {
                        //validating non-blur events only when formatterArgs have specified to validateWhileEntering
                        if(formatterArgs.validateWhileEntering && formatterArgs.validateWhileEntering === true) {
                            //Do nothing continue on
                        } else {
                            //TOOD: figure out why returning here is causing the cursor to be set to last position and
                            //  slowing down UI by preventing key to be pressed while it is moved, thereby causing confusing and bad UX
                            // return;
                            evaluateAsValid = true;
                        }
                    }

                    //Do not validate if input is pristine, i.e nothing entered by user yet
                    if($element.hasClass('ng-pristine') && eventType !=='runCustomValidations'){
                        return;
                    }

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
                        var value = $element.val().replace(/\s+$/, '');

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
                            ngModelController, $scope, rawCustomValidationAttribute);
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
                        currentErrorMessageIsStale = currentErrorMessageValidator(errorMessageElement.clone(), value, $attrs[currentErrorMessage.attr('data-custom-validation-attribute')], $element, model, ngModelController, $scope, rawCustomValidationAttribute);

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

                    //TODO: using this temporarily because if we don't evaluate we have wierd UX whereby cursor moved to end of string
                    if (evaluateAsValid === true) {
                        isValid = true;
                    } else {
                        isValid = runValidation();

                    }

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
                        return runCustomValidations('input');
                    });

                    $element.on('blur', function (event) {
                        runCustomValidations(event.type);
                    });

                    $scope.$on('runCustomValidations', function () {
                        runCustomValidations('runCustomValidations');
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
                validateWhileEntering: true,
                errorMessage: 'This is a required field',
                validator: function (errorMessageElement, val){
                    return (/\S/).test(val);
                }
             })
        };
    })

    .directive('button', function (customValidationUtil) {
        return {
            restrict: 'E',
            link: submitLink
        };
    })

    .directive('a', function (customValidationUtil) {
        return {
            restrict: 'E',
            link: submitLink
        };
    })

    //shared config functions
    return {
        getValidationAttributeValue: getValidationAttributeValue
    };

})();
