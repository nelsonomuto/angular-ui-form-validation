(function(self) {
  /**
   JSOL stands for JavaScript Object Literal which is a string representing
   an object in JavaScript syntax.

   For example:

   {foo:"bar"} is equivalent to {"foo":"bar"} in JavaScript. Both are valid JSOL.

   Note that {"foo":"bar"} is proper JSON[1] therefore you can use one of the many
   JSON parsers out there like json2.js[2] or even the native browser's JSON parser,
   if available.

   However, {foo:"bar"} is NOT proper JSON but valid Javascript syntax for
   representing an object with one key, "foo" and its value, "bar".
   Using a JSON parser is not an option since this is NOT proper JSON.

   You can use JSOL.parse to safely parse any string that reprsents a JavaScript Object Literal.
   JSOL.parse will throw an Invalid JSOL exception on function calls, function declarations and variable references.

   Examples:

   JSOL.parse('{foo:"bar"}');  // valid

   JSOL.parse('{evil:(function(){alert("I\'m evil");})()}');  // invalid function calls

   JSOL.parse('{fn:function() { }}'); // invalid function declarations

   var bar = "bar";
   JSOL.parse('{foo:bar}');  // invalid variable references

   [1] http://www.json.org
   [2] http://www.json.org/json2.js
   */
  if (!self.JSOL) {
    self.JSOL = {};
  }
  // Used for trimming whitespace
  var trim =  /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
  if (typeof self.JSOL.parse !== "function") {
    self.JSOL.parse = function(text) {
      // make sure text is a "string"
      if (typeof text !== "string" || !text) {
        return null;
      }
      // Make sure leading/trailing whitespace is removed
      text = text.replace(trim, "");

      //****Invalid JSOL modification to allow for single quoted strings: TODO rename JSOL variable and file to something else, no longer valid JSOL
      text = text.replace(/'/g, '"');

      // Make sure the incoming text is actual JSOL (or Javascript Object Literal)
      // Logic borrowed from http://json.org/json2.js
      if ( /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
           .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
           .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
           /** everything up to this point is json2.js **/
           /** this is the 5th stage where it accepts unquoted keys **/
           .replace(/\w*\s*\:/g, ":")) ) {
        return (new Function("return " + text))();
      }
      else {
        throw("Invalid JSOL: " + text);
      }
    };
  }
})(window);

angular.module('services.templateRetriever',[])

.factory('templateRetriever', function ($http, $q){
	return {
		getTemplate: function (templateUrl, tracker) {
			var deferred = $q.defer();

			$http({
				url: templateUrl,
				method: 'GET',
				headers: {'Content-Type': 'text/html'},
				tracker: tracker || 'promiseTracker'
			})
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data, status, headers, config){
				deferred.reject({
					data: data,
					status: status,
					headers: headers,
					config: config
				});
			});

			return deferred.promise;
		}
	}
});
angular_ui_form_validations = (function(){
    
    var customValidations, createValidationFormatterLink, customValidationsModule, getValidationPriorityIndex, getValidationAttributeValue,
        getValidatorByAttribute, getCustomTemplate, customTemplates, isCurrentlyDisplayingAnErrorMessageInATemplate,
        currentlyDisplayedTemplate, dynamicallyDefinedValidation;        

    customTemplates = [];

    customValidations = [];

    dynamicallyDefinedValidation = {
        customValidationAttribute: 'validationDynamicallyDefined',
        errorCount: 0,
        _errorMessage: 'Field is invalid',
        errorMessage: function () { return dynamicallyDefinedValidation._errorMessage; },
        validator: function (errorMessageElement, val, attr, element, model, modelCtrl, scope) {
            var valid, i, validation;            

            for(i = 0; i < scope[attr].length; i++ ){
                validation = scope[attr][i];
                valid = validation.validator.apply(scope, arguments);
                dynamicallyDefinedValidation._errorMessage = validation.errorMessage;     
                if(valid === false){
                    dynamicallyDefinedValidation.errorCount++;
                    break;
                }                
            };
            
            return valid;
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

    createValidationFormatterLink = function (formatterArgs, templateRetriever, $q, $timeout, $log) {
        
        return function($scope, $element, $attrs, ngModelController) {
            var errorMessage, errorMessageElement, modelName, model, propertyName, runCustomValidations, validationAttributeValue, customErrorTemplate;
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

                    runCustomValidations = function (errorMessageElement) {
                        var isValid, value, customValidationBroadcastArg, currentlyDisplayingAnErrorMessage, 
                            currentErrorMessage, currentErrorMessageIsStale,
                            currentErrorMessageValidator, currentErrorMessagePriorityIndex, 
                            currentErrorMessageIsOfALowerPriority, fieldNameSelector;

                        fieldNameSelector = '[data-custom-field-name="'+ $element.attr('name') +'"]';

                        currentErrorMessage = isCurrentlyDisplayingAnErrorMessageInATemplate($element) ?
                            currentlyDisplayedTemplate.children('.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                                '.CustomValidationError[style="display: block;"]'+fieldNameSelector)
                            : $element.siblings('.CustomValidationError[style="display: inline;"]'+fieldNameSelector+', '+
                                '.CustomValidationError[style="display: block;"]'+fieldNameSelector);

                        currentlyDisplayingAnErrorMessage = currentErrorMessage.length > 0;

                        value = $element.val().trimRight();

                        isValid = formatterArgs.validator(errorMessageElement, value, validationAttributeValue, $element, model, ngModelController, $scope);

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
(function(){
    var extendCustomValidations = angular.module('directives.customvalidation.customValidationTypes', [
        'directives.customvalidation.customValidations'
    ])

    getValidationAttributeValue = angular_ui_form_validations.getValidationAttributeValue;

    angular.forEach([        
         {        
            customValidationAttribute: 'validationFieldRequired',
            errorMessage: 'This is a required field',
            validator: function (errorMessageElement, val){
                return (/\S/).test(val);    
            }
         },
         {
            customValidationAttribute: 'validationConfirmPassword',
            errorMessage: 'Passwords do not match.',
            validator: function (errorMessageElement, val, attr, element, model, modelCtrl) {
                return model.password.trimRight() === element.val().trimRight();
            }
         },
         {
            customValidationAttribute: 'validationEmail',
            errorMessage: 'Please enter a valid email',
            validator: function (errorMessageElement, val){
                return (/^.*@.*\..*[a-z]$/i).test(val);
            }
         },
         {
            customValidationAttribute: 'validationNoSpace',
            errorMessage: 'Cannot contain any spaces',
            validator: function (errorMessageElement, val){
                return (/^[^\s]+$/).test(val);
            }
         },
         {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters'; },
            validator: function (errorMessageElement, val, attr){
                return val.length >= parseInt(attr, 10);    
            }   
        },
        {
            customValidationAttribute: 'validationMaxLength',            
            errorMessage: '',
            validator: function (errorMessageElement, val, attr) {                
                if (val.length <= parseInt(attr, 10)) {
                    return true;
                } else {
                    errorMessageElement.html('Maximum of ' + attr + ' characters');
                    return false;
                }
            }   
        },
        {
            customValidationAttribute: 'validationOnlyAlphabets',
            errorMessage: 'Valid characters are: A-Z, a-z',
            validator: function (errorMessageElement, val){
                return (/^[a-z]*$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneUpperCaseLetter',
            errorMessage: 'Must contain at least one uppercase letter',
            validator: function (errorMessageElement, val){
                return (/^(?=.*[A-Z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneLowerCaseLetter',
            errorMessage: 'Must contain at least one lowercase letter',
            validator: function (errorMessageElement, val){
                return (/^(?=.*[a-z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneNumber',
            errorMessage: 'Must contain at least one number',
            validator: function (errorMessageElement, val){
                return (/^(?=.*[0-9]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneAlphabet',
            errorMessage: 'Must contain at least one alphabet',
            validator: function (errorMessageElement, val) {
                return (/^(?=.*[a-z]).+$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationNoSpecialChars',
            errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
            validator: function (errorMessageElement, val){
                return (/^[a-z0-9_\-\s]*$/i).test(val);
            }
        }
    ], 

    function(customValidation) {
        extendCustomValidations.directive('input', function (customValidationUtil) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: customValidationUtil.createValidationLink(customValidation)
            };
        });   
    });    
})()
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