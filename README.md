# Angular ui form validation &nbsp;[![Build Status](https://travis-ci.org/nelsonomuto/angular-ui-form-validation.png?branch=master)](https://travis-ci.org/nelsonomuto/angular-ui-form-validation)

#### A flexible approach to handling form validation and displaying field errors.
The end result is validation and error handling without convoluting your markup with a bunch of ng-show, ng-hide blocks and having to copy paste that into other forms.

![custom validation message for no space](/errorMessageNoSpace.png "validation-no-space")
```html
 <form novalidate>    
    <label for="username">Username</label>
    <input type="text" id="username" name="username" ng-model="user.username"
      validation-max-length="10"
      validation-min-length="5"
      validation-no-space="true"
      validation-field-required="true"
      validation-no-special-chars="true"
    />
    <label for="firstname">First Name</label>
    <!-- The ability to specify a template will be there in the next release -->
    <input type="text" id="firstname" name="firstname" ng-model="user.firstname"
      validation-min-length="{ value: 5, template: 'tooltipMessage.html' }"  
    />
                                  ...

</form>
```
>
The idea behind this component is to allow you to be able to do three things:

**(1)** Provide a list of commonly used validations that you may plug in to your form fields.

**(2)** Give you the flexibility to create your own custom validations.


**(3)** _(Available with next release)_ Create the markup for how your errors will be displayed separately in any number of isolated templates that can be easily re-used across different forms. 

## Getting Started

### Install:
 - Either clone & build this repository
 - [or Download the release](https://github.com/nelsonomuto/angular-ui-form-validation/blob/master/dist/angular-ui-form-validation.js)
 - or via bower `$ bower install angular-ui-form-validation`
 
 - Add the three following dependencies to your app module:
 ```javascript
    angular.module('<your_app_module_name>', [
      'directives.customvalidation.customValidations',
      'extendCustomValidations',
      'directives.invalidinputformatter.invalidInputFormatter'
    ])
 ```

*For a sample example clone this repository and run the grunt serve task.

###Creating your own custom validations

  You need to copy paste the below module, you may rename it as whatever you like. Simply add/remove to the array of validations. Ensure that you include both this module and 'directives.customvalidation.customValidations' as dependencies in your application module.

  ```js
    //To create your own validations you need to copy paste this section
    extendCustomValidationsModule = angular.module('extendCustomValidationsModule', ['directives.customvalidation.customValidations']);

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
        extendCustomValidationsModule.directive('input', function (customValidationLink) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: customValidationLink.create(customValidation)
            };
        });   
    });
    //**End section to create your own validations
  ```
####Validator method API
  The validator method takes the following arguments:

  ```javascript
    validator(value, validationAttributeValue, $element, model, ngModelController) { return true; }    
  ```
  It returns a boolean which upon the error message is toggled.