# Angular ui form validation

#### A flexible approach to handling form validation and displaying field errors.

## Install:
 - Either clone & build this repository
 - [or Download the release](https://github.com/nelsonomuto/angular-ui-form-validation/blob/master/dist/angular-ui-form-validation.js)
 - or via bower `$ bower install angular-ui-form-validation'

## Getting Started
>
The idea behind this component is to allow you to be able to do three things:

**(1)** Provide a list of commonly used validations that you may plug in to your form fields.

**(2)** Give you the flexibility to create your own custom validations.

**(3)** Create the markup for how your errors will be displayed separately in any number of isolated templates that can be easily re-used across different forms. 

The end result is validation and error handling without convoluting your markup with a bunch of ng-show, ng-hide blocks and having to copy paste that into other forms.

```html
 <form novalidate>    
    <label for="username">Username</label>
    <input type="text" id="username" name="username" ng-model="user.username"
      validation-min-length="5" 
      validation-no-space="true"
      validation-field-required="true"
      validation-max-length="10"
      validation-no-special-chars="true"
    />
    <span class="help-block">username | validates min char = 5, max = 10, no special chars</span>alidation-no-space="true"
    />
</form>
>
```

For a sample example clone this repository and run the grunt serve task.
