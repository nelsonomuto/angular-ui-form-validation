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