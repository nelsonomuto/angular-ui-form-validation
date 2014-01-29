# Angular ui form validation &nbsp;[![Build Status](https://travis-ci.org/nelsonomuto/angular-ui-form-validation.png?branch=master)](https://travis-ci.org/nelsonomuto/angular-ui-form-validation)&nbsp;[![Dependencies status](https://david-dm.org/nelsonomuto/angular-ui-form-validation.png)](https://david-dm.org/nelsonomuto/angular-ui-form-validation)&nbsp;[![devDependency Status](https://david-dm.org/nelsonomuto/angular-ui-form-validation/dev-status.png)](https://david-dm.org/nelsonomuto/angular-ui-form-validation#info=devDependencies)

[MIT LICENSE](/LICENSE.txt)

**Supports angular versions 1.0.7 and greater.** Because there are no dependencies other than angular, we are able to be backwards compatible with angular all the way to version 1.0.7. Note that the **dev-**dependencies are not used nor present in the release.

Fully unit tested, see [customValidationTypes.spec.js](/app/scripts/directives/customvalidation/customValidations.spec.js)

### [Plunker Demo](http://plnkr.co/edit/eDgcM0X0R2z0P8q1BGVK?p=preview) ###

## Getting Started
>
The idea behind this component is to encourage code reuse and eliminate boilerplate redundancy by doing three basic things:

**(1)** Provides a list of 12 commonly used validations that you may plug in to your form fields.

**(2)** Gives you the flexibility to add your own custom validations. Either locally on your view/template controller or in a centralized customValidationTypes where you can re-use them across your application.

**(3)** Allows you to create the markup for how your errors will be displayed separately in any number of isolated templates that can be easily re-used across different forms.

The end result is validation and error handling without convoluting your markup with a bunch of ng-show, ng-hide blocks and having to copy paste that into other forms.


### 2-step Install:
 1. a. Either clone & build this repository
    b. [or Download the release](https://raw.github.com/nelsonomuto/angular-ui-form-validation/master/dist/angular-ui-form-validation.js)
    c. or via bower `$ bower install angular-ui-form-validation` (current release is 0.0.2)
 
 2. Add the following single dependency to your app module:
 ```javascript
    angular.module('<your_app_module_name>', [
      'directives.customvalidation.customValidationsTypes',
    ])
 ```

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
    
    <input type="text" id="firstname" name="firstname" ng-model="user.firstname"
      validation-min-length="{ value: 5, template: 'ErrorTemplateOne.html' }"  
      validation-max-length="10"
      validation-no-special-chars="true"
    />
                                  ...

</form>
```

### API

#### Custom validation types

Look at [customValidationTypes.js](/app/scripts/directives/customvalidationtypes/customValidationTypes.js)
 
Here's an example of what a validation object looks like. It has three properties, the **customValidationAttribute** is the name that will be used to construct the directive for the validation, the **errorMessage** and **validator** are self-descriptive:

  ```javascript
    {
            customValidationAttribute: 'validationConfirmPassword',
            errorMessage: 'Passwords do not match.',
            validator: function (errorMessageElement, val, attr, element, model, modelCtrl) {
                return model.password.trimRight() === element.val().trimRight();
            }
    },  
  ```
##### Validation order of priority

The order of priority is given first to any validations defined locally on the validationDynamicallyDefined directive and thereafter based on the index position of the validation object in the array where it is defined. Ex: in [customValidationTypes.js](/app/scripts/directives/customvalidationtypes/customValidationTypes.js) validationFieldRequired is given priority over validationConfirmPassword, therefore in the case that both are invalid then validationFieldRequired message is the one displayed.

##### Adding custom validation types

To add your own custom validation types you will need to create a module that mirrors [directives.customvalidation.customValidationsTypes](/app/scripts/directives/customvalidationtypes/customValidationTypes.js) except for ofcourse you will have your own validations and simply add this module as a dependency to your app in addition to directives.customvalidation.customValidationsTypes

##### Locally defined custom validation - validationDynamicallyDefined

The validation-dynamically-defined directive gives you the ability to define a validation local to the scope alone.

[Here's a plunker with an example of how to accomplish this.](http://plnkr.co/edit/owd9I1eNgFmQieaCg8Y8?p=preview)
