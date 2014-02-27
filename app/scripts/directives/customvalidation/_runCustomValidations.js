

function _isCurrentlyDisplayingAnErrorMessageInATemplate (inputElement, currentlyDisplayedTemplate, customTemplates) {
    var isCurrentlyDisplayingAnErrorMessageInATemplate = false;
    angular.forEach(customTemplates, function (template){
        if(template.parent().is(inputElement.parents('form'))){
            isCurrentlyDisplayingAnErrorMessageInATemplate = true;  
            currentlyDisplayedTemplate = template;
        }
    });
    return isCurrentlyDisplayingAnErrorMessageInATemplate;
}

function _customValidationIsValid (customValidationIsValidArgs) {
    var isValid,
    	//BEGIN customValidationIsValidArgs
    	errorMessageElement, value, validationAttributeValue, $element, model, ngModelController,
    	$scope, asynchronousIsValid, runCustomValidations, formatterArgs, propertyName;
    	//END customValidationIsValidArgs

    $element = customValidationIsValidArgs.$element;
    errorMessageElement = customValidationIsValidArgs.errorMessageElement;
    value = $element.val();
    validationAttributeValue = customValidationIsValidArgs.validationAttributeValue;
    model = customValidationIsValidArgs.model;
    ngModelController = customValidationIsValidArgs.ngModelController;
    $scope = customValidationIsValidArgs.$scope;
    asynchronousIsValid = customValidationIsValidArgs.asynchronousIsValid;
    runCustomValidations = customValidationIsValidArgs.runCustomValidations;
    formatterArgs = customValidationIsValidArgs.formatterArgs;
    propertyName = customValidationIsValidArgs.propertyName;

    if (typeof(asynchronousIsValid) !== 'undefined') {
        if(formatterArgs.validator === asynchronousIsValid.validator) {
            isValid = true; //should always be true if asynchronousIsValid is defined
        }
    } else {
        isValid = formatterArgs.validator(errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope, asynchronousIsValid, runCustomValidations, formatterArgs, propertyName);
    }
    
    if(isValid && typeof(isValid.then) !== 'undefined' && formatterArgs.customValidationAttribute !== 'validationDynamicallyDefined') {
        //then isValid is a validationPromise                   
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
}

function _runCustomValidations (errorMessageElement, runCustomValidationArgs, asynchronousIsValid) {
    var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage, 
        currentErrorMessage, currentErrorMessageIsStale,
        currentErrorMessageValidator, currentErrorMessagePriorityIndex, 
        currentErrorMessageIsOfALowerPriority, successFn, fieldNameSelector, currentlyDisplayedTemplate,
        //BEGIN runCustomValidationArgs
        $element, formatterArgs, isCurrentlyDisplayingAnErrorMessageInATemplate, 
        customValidationIsValid, validationAttributeValue, model, ngModelController, $scope, propertyName, customTemplates,
        getValidatorByAttribute, $attrs, getValidationPriorityIndex, getValidationAttributeValue, onValidationComplete;
        //END runCustomValidationArgs

    $element = runCustomValidationArgs.$element;
    formatterArgs = runCustomValidationArgs.formatterArgs;
    isCurrentlyDisplayingAnErrorMessageInATemplate = runCustomValidationArgs.isCurrentlyDisplayingAnErrorMessageInATemplate;
    validationAttributeValue = runCustomValidationArgs.validationAttributeValue;
    model = runCustomValidationArgs.model;
    ngModelController = runCustomValidationArgs.ngModelController;
    $scope = runCustomValidationArgs.$scope;
    $attrs = runCustomValidationArgs.$attrs;
    customTemplates = customTemplates;
    propertyName = runCustomValidationArgs.propertyName;
    getValidatorByAttribute = runCustomValidationArgs.getValidatorByAttribute;
    getValidationAttributeValue = runCustomValidationArgs.getValidationAttributeValue;
    getValidationPriorityIndex = runCustomValidationArgs.getValidationPriorityIndex;
    onValidationComplete = runCustomValidationArgs.onValidationComplete;

    fieldNameSelector = '[data-custom-field-name="'+ $element.attr('name') +'"]';

    successFn = formatterArgs.success || function(){};

    currentErrorMessage = _isCurrentlyDisplayingAnErrorMessageInATemplate($element, currentlyDisplayedTemplate, customTemplates) ?
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
    isValid = _customValidationIsValid(angular.extend(runCustomValidationArgs, {errorMessageElement: errorMessageElement}));

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
                            
    // callValidator(formatterArgs.validator, $scope, [errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope], function (isValid) {                         
    (function (isValid) {                         
        
        if(! currentlyDisplayingAnErrorMessage) {
            $element.siblings('.CustomValidationError.'+ formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                .toggle(!isValid);
        } else if(! _isCurrentlyDisplayingAnErrorMessageInATemplate($element, currentlyDisplayedTemplate, customTemplates)){ 
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

        if(_isCurrentlyDisplayingAnErrorMessageInATemplate($element, currentlyDisplayedTemplate, customTemplates)) {
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
    })(formatterArgs.validator.apply($scope, [errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope]));
    
    $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);

    onValidationComplete(!(currentlyDisplayingAnErrorMessage || _isCurrentlyDisplayingAnErrorMessageInATemplate($element, currentlyDisplayedTemplate, customTemplates) || !isValid), value, validationAttributeValue, $element, model, ngModelController, $scope, successFn);

    return value;
}