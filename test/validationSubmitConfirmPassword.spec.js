"use strict;"

describe('directives.customvalidation.validationSubmitConfirmPassword', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages,
        passwordInput, confirmPasswordInput;

    beforeEach(function (){
        module('directives.customvalidation.customValidationTypes');
        inject(function ($injector, $rootScope, $compile, $q, $timeout) {
            element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5, "validateWhileEntering": true }\'/>' +

                '<input ng-model="user.confirmPassword" type="text" id="confirmPassword" name="confirmPassword" ' +
                'validation-field-required="true" validation-confirm-password="true"/>'+

                '<a class="btn-primary" validation-submit="{onSubmit:\'onSubmit()\', formName:\'form\'}" type="submit">Submit</a>'+
                '</form>');
            passwordInput = element.find('#password');
            confirmPasswordInput = element.find('#confirmPassword');

            scope = $rootScope;

            scope.onSubmit = jasmine.createSpy('scope#onValid');

            angular.extend(scope, {
                user: {
                    name: null,
                    password: null,
                    confirmPassword: null,
                    save: function () {

                    }
                }
            });
            $compile(element)(scope);
            scope.$digest();
            $timeout.flush();
            errorMessages = element.find('.CustomValidationError');
        });
    });

    it('should contain all error messages', function () {
        expect(3).toEqual(errorMessages.length);
    });

    it('should disable the submit button', function () {
        passwordInput.val('sadffsdaadfsfsda');
        element.scope().$apply();
        scope.$broadcast('runCustomValidations');
        element.scope().$apply();
        var form = element;
        form.removeClass('ng-pristine');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(1).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('customMessage').toEqual(visibleErrorMessages.html().trim());
        expect(form.hasClass('ng-invalid')).toBe(true);
        expect(form.hasClass('ng-valid')).toBe(false);
        form.find('a').click();
        expect(scope.onSubmit).not.toHaveBeenCalled();
    });

    it('should enable the submit button', function () {
        var form = element;
        form.removeClass('ng-pristine');
        passwordInput.val('asd');
        confirmPasswordInput.val('asd');
        form.addClass('ng-dirty');

        confirmPasswordInput.addClass('ng-dirty');
        passwordInput.addClass('ng-dirty');
        confirmPasswordInput.removeClass('ng-pristine');
        passwordInput.removeClass('ng-pristine');

        passwordInput.keyup();

        element.scope().$apply();
        scope.$broadcast('runCustomValidations');
        element.scope().$apply();

        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(3).toEqual(hiddenErrorMessages.length);
        expect(0).toEqual(visibleErrorMessages.length);
        expect(form.hasClass('ng-invalid')).toBe(false);
        expect(form.hasClass('ng-valid')).toBe(true);
        form.find('a').click();
        expect(scope.onSubmit).toHaveBeenCalled();
    });
});
