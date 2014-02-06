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
                return val !== '' && (/^[^\s]+$/).test(val);
            }
         },
         {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters'; },
            validator: function (errorMessageElement, val, attr){
                return val.length >= parseInt(getValidationAttributeValue(attr), 10);    
            }   
        },
        {
            customValidationAttribute: 'validationMaxLength',            
            errorMessage: '',
            validator: function (errorMessageElement, val, attr) {                
                if (val.length <= parseInt(getValidationAttributeValue(attr), 10)) {
                    return true;
                } else {
                    errorMessageElement.html('Maximum of ' + getValidationAttributeValue(attr) + ' characters');
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