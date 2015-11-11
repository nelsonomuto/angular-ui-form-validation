
# Angular ui form validation 
Perform your form validation using re-usable directives and API to create your own validation types and avoid boilerplate code.

![demo gif](https://raw.githubusercontent.com/nelsonomuto/angular-ui-form-validation/master/app/images/formValidation.gif)


[Interactive Demo.](http://nelsonomuto.github.io/angular-ui-form-validation)

Fully unit tested [customValidationTypes.spec.js](/test/customValidations.spec.js) 

[![Build Status](https://travis-ci.org/nelsonomuto/angular-ui-form-validation.svg?branch=master)](https://travis-ci.org/nelsonomuto/angular-ui-form-validation)

[![Dependencies status](https://david-dm.org/nelsonomuto/angular-ui-form-validation.svg?style=flat)](https://david-dm.org/nelsonomuto/angular-ui-form-validation)
[![devDependency Status](https://david-dm.org/nelsonomuto/angular-ui-form-validation/dev-status.svg?style=flat&breakCache=0)](https://david-dm.org/nelsonomuto/angular-ui-form-validation#info=devDependencies)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nelsonomuto/angular-ui-form-validation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
<br />
<span class="badge-npmversion"><a href="https://npmjs.org/package/angular-ui-form-validation" title="View this project on NPM"><img src="https://img.shields.io/npm/v/angular-ui-form-validation.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/angular-ui-form-validation" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/angular-ui-form-validation.svg" alt="NPM downloads" /></a></span>


### Install

[See Youtube Install Video](https://www.youtube.com/watch?v=jU3_58nOoeI)

[See Youtube how to create your own re-usable custom validation types](https://www.youtube.com/watch?v=R-5loy9X6KE&feature=youtu.be)

 1. a.) Either clone & build this repository
 
    b.) [or Download the release](https://raw.github.com/nelsonomuto/angular-ui-form-validation/master/dist/angular-ui-form-validation.js)

    c.) or via bower `$ bower install angular-ui-form-validation`
    
    d.) or via npm `$ npm install angular-ui-form-validation`
 
 2. Ensure jquery (any version >= 1.6.0) is loaded before your angular (any version >= 1.0.7) app is loaded.
 3. Add jquery as a dependency before the angular script tag. Example ```<script src="bower_components/jquery/jquery.js"></script>``` or from wherever you are pulling jquery. 
 4. Add a script the validation dependency script tag to the source after the angular script tag, if you used bower install it will be ```<script src="bower_components/angular-ui-form-validation/dist/angular-ui-form-validation.js"></script>```
    with npm install it will be ```<script src="node_modules/angular-ui-form-validation/dist/angular-ui-form-validation.js"></script>```
 5. Add the following single dependency to your app module:
 ```javascript
    angular.module('<your_app_module_name>', [
      'directives.customvalidation.customValidationTypes',
    ])
 ```


### [Interactive Preview Demo](http://nelsonomuto.github.io/angular-ui-form-validation) on github page ###

(Plunker load times are slow)

[Plunker Demo](http://plnkr.co/edit/z0DTSV?p=preview) 

[Plunker Demo for select support](http://plnkr.co/edit/7Ct3X1?p=preview)

#### Multi-form support included
`            <a class="btn-primary" validation-submit="{onSubmit:'user.save()', formName:'demoFormTwo'}" type="submit">Submit</a>
`
![multi form](https://raw.githubusercontent.com/nelsonomuto/angular-ui-form-validation/master/app/images/multiFormExample.png)

## Getting Started
>
The idea behind this component is to encourage code reuse and eliminate boilerplate redundancy by doing five basic things:

**(1)** Provides a list of more than 12 commonly used validations that you may plug into your form fields.

**(2)** Gives you the flexibility to add your own custom validations. Either locally on your view/template controller or in a centralized customValidationTypes where you can re-use them across your application.

**(3)** Allows you to create the markup for how your errors will be displayed separately in any number of isolated templates that can be easily re-used across different forms.

**(4)** Enables you to have multiple validations on a single input element and lets you determine the order in which they are applied.

**(5)** Exposes the controller scope to your validator function, so you have full access to its models and all its functions.
```
locallyDefinedValidations: [                  
          {
              errorMessage: 'Cannot contain the number one',
              validator: function (errorMessageElement, val, attr, element, model, modelCtrl){
                  /**
                   * The model and modelCtrl(scope) are exposed in the validator function
                   * */
                  return /1/.test(val) !== true;    
              }
          },
          {
              errorMessage: 'Cannot contain the number two',
              validator: function (errorMessageElement, val, attr, element, model, modelCtrl){
                  return /2/.test(val) !== true;      
              } 
          }
      ]
});

```
The end result is validation and error handling without convoluting your markup with a bunch of ng-show, ng-hide blocks and having to copy paste that into other forms.


![custom validation message for no space](/errorMessageNoSpace.png "validation-no-space")

### API

#### Custom validation types

Look at [customValidationTypes.js](/app/scripts/directives/customvalidationtypes/customValidationTypes.js)
 
Here's an example of what a validation object looks like. It has three properties, the **customValidationAttribute** is the name that will be used to construct the directive for the validation, the **errorMessage** and **validator** are self-descriptive:

  ```javascript
    {
            customValidationAttribute: 'validationConfirmPassword',
            errorMessage: 'Passwords do not match.',
            validator: function (errorMessageElement, val, attr, element, model, modelCtrl) {
                return model.password.trim() === element.val().trim();
            }
    },  
  ```
##### Validation order of priority

The order of priority is given first to any validations defined locally on the validationDynamicallyDefined directive and thereafter based on the index position of the validation object in the array where it is defined. Ex: in [customValidationTypes.js](/app/scripts/directives/customvalidationtypes/customValidationTypes.js) validationFieldRequired is given priority over validationConfirmPassword, therefore in the case that both are invalid then validationFieldRequired message is the one displayed.

##### Adding custom validation types

To add your own custom validation types you will need to create a module that mirrors [directives.customvalidation.customValidationTypes](/app/scripts/directives/customvalidationtypes/customValidationTypes.js) except for ofcourse you will have your own validations and simply add this module as a dependency to your app in addition to directives.customvalidation.customValidationTypes

##### Locally defined custom validation - validationDynamicallyDefined

The validation-dynamically-defined directive gives you the ability to define a validation local to the scope alone.

[Here's a plunker with an example of how to accomplish this.](http://plnkr.co/edit/LDoYUM?p=preview)

###### Declare your own custom validation classes

Use these attributes for live validation success and fail, **validation-live-success-cls, validation-live-fail-cls**
Ex: 
```
    <input validation-live-success-cls="text-success" validation-live-fail-cls="text-error" type="text" id="username" name="username" ng-model="user.username" validation-min-length="{template:'/views/errorTemplateOne.html', value:5}" validation-no-space="{message:'no space - custom message', value: true}" >

```

### Comparison with similar projects

There are 2 other angularjs validation plugins right now with a similar goal of reducing boilerplate code to ease the work of developers. One is Huei Tan's https://github.com/huei90/angular-validation and the other is kelp404's https://github.com/kelp404/angular-validator.

I have forked both of these repos and analyzed them. Both Huei and Kelp's implementation are quite similar, down to the organization of the source code. I believe the former was heavily influenced by the latter. 

There are a few important distinctions in my implementation, the **first** major difference is I am providing the developer with an api for creating directives (NOT a single validation directive - this greatly reduces the amount of code the developer has to write in his controller and encourages re-usability by forcing him to use a directive instead. However, I also provide leeway for edge cases with 'validationDynamicallyDefined' directive which allows the developer to create a validator on the fly and have the logic centralized in a controller). 

The **second** is that I provide out of the box a library of over 20 commonly used validators to get you started asap. You may expand the library with the validations you deem shareable across your app as well. There is an extension point for this explained in the wiki.

**Thirdly** and most importantly I believe is the flexibility through which my validator directives expose their dom element(for instance you can access the input and its error message element within your validator function if you needed to add special logic) and attribute values (for instance you can configure the max-length validator with an arbitrary value in the html directives for any number of inputs that may require a different max length, so instead of creating a new config object in your controller as you would be forced to do with other plugins, you would simply re-use the max-length validator and pass in a new max length). Support for having multiple validators in a single input was a top priority while designing my implementation and you will find that it is robust and well thought through, for example it contains as well the ability for the developer to not only define multiple validators on an input but also to determine the order of priority that they are applied. 
 

**Supports and tested on angular versions from 1.0.7 through the latest snapshot 1.3.0-build.2810** 

**Provides out of the box more than 20 commonly used validations that are easily configured using attributes on the directive**

**Enables users with the capacity to add to the library of re-usable validations**

**Supports multiple validation rules on one input element**

**Supports custom error message strings**

**Supports custom error message templates as well for additional styling requirements**

**Supports adding your own validation types**

**For edge cases, supports dynamically defining validation logic in the controller for complex business logic rules**

```html
 <form novalidate>    
    <label for="username">Username</label>
    <input type="text" id="username" name="username" ng-model="user.username"
      validation-min-length="{template:'/views/errorTemplateOne.html', value:5}" 
      validation-no-space="{message:'no space - custom message', value: true}"
      validation-field-required="true"
      validation-max-length="10"
      validation-no-special-chars="true"
      validation-dynamically-defined="locallyDefinedValidations"
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
