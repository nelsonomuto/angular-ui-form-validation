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
    <!-- The ability to specify a template will be there in the next release -->
    <input type="text" id="username" name="username" ng-model="user.firstname"
      validation-min-length="{ value: 5, template: 'tooltipMessage.html' }"  
    />
                                  ...

</form>
```
## Install:
 - Either clone & build this repository
 - [or Download the release](https://github.com/nelsonomuto/angular-ui-form-validation/blob/master/dist/angular-ui-form-validation.js)
 - or via bower `$ bower install angular-ui-form-validation`

## Getting Started
>
The idea behind this component is to allow you to be able to do three things:

**(1)** Provide a list of commonly used validations that you may plug in to your form fields.

**(2)** Give you the flexibility to create your own custom validations.


**(3)** _(Available with next release)_ Create the markup for how your errors will be displayed separately in any number of isolated templates that can be easily re-used across different forms. 


For a sample example clone this repository and run the grunt serve task.
