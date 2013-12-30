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
/*
 * ****NB: Nelson Omuto - I have made modifications to the parser to allow for values that are in single quoted strings so it is not 
 * entirely valid JSOL
 * 
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
;(function(self) {
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