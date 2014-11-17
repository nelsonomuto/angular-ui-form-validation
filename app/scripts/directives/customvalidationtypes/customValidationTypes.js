(function(){
    var extendCustomValidations = angular.module('directives.customvalidation.customValidationTypes', [
        'directives.customvalidation.customValidations'
    ]);

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
                var password = model.password || '';
                return password.replace(/\s+$/, '') === element.val().replace(/\s+$/, '');
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
            validateWhileEntering: true,
            validator: function (errorMessageElement, val){
                return val !== '' && (/^[^\s]+$/).test(val);
            }
         },
         {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + getValidationAttributeValue(attr) + ' characters'; },
            validator: function (errorMessageElement, val, attr) {
                return val.length >= parseInt(getValidationAttributeValue(attr), 10);
            }
        },
        {
            customValidationAttribute: 'validationMaxLength',
            errorMessage: '',
            validateWhileEntering: true,
            validator: function (errorMessageElement, val, attr, $element, model, ngModelController, $scope, rawAttr) {
                var customMessage = getValidationAttributeValue(rawAttr, 'message', true);
                attr = getValidationAttributeValue(rawAttr, 'value', true) || attr;
                if (val.length <= parseInt(getValidationAttributeValue(attr), 10)) {
                    return true;
                } else {
                    errorMessageElement.html(customMessage || 'Maximum of ' + getValidationAttributeValue(attr) + ' characters');
                    return false;
                }
            }
        },
        {
            customValidationAttribute: 'validationOnlyAlphabets',
            errorMessage: 'Valid characters are: A-Z, a-z',
            validateWhileEntering: true,
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
            validateWhileEntering: true,
            errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
            validator: function (errorMessageElement, val){
                return (/^[a-z0-9_\-\s]*$/i).test(val);
            }
        },
        {
            customValidationAttribute: 'validationDateBeforeToday',
            errorMessage: 'Must be prior to today',
            validator: function (errorMessageElement, val){
                var now, dateValue;
                now = new Date();
                dateValue = new Date(val);
                dateValue.setDate(dateValue.getDate() + 1);
                return dateValue < now;
            }
        },
        {
            customValidationAttribute: 'validationDateBefore',
            errorMessage: function (attr) { return 'Must be before ' + getValidationAttributeValue(attr); },
            validator: function (errorMessageElement, val, beforeDate){
                var dateValue = new Date(val);
                dateValue.setDate(dateValue.getDate() + 1);
                return dateValue < new Date(beforeDate);
            }
        },
        {
            customValidationAttribute: 'validationDateAfter',
            errorMessage: function (attr) { return 'Must be after ' + getValidationAttributeValue(attr); },
            validator: function (errorMessageElement, val, afterDate){
                var dateValue = new Date(val);
                dateValue.setDate(dateValue.getDate() + 1);
                dateValue.setHours(0);
                return dateValue > new Date(afterDate);
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
        extendCustomValidations.directive('textarea', function (customValidationUtil) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: customValidationUtil.createValidationLink(customValidation)
            };
        });
    });
})();
