describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages;

    beforeEach(function (){
        module('directives.customvalidation.customValidations');
        inject(function ($rootScope, $compile){
            element = angular.element('<form>' +
                '<input type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" /></form>');
            input = element.find('input');
            scope = $rootScope;
            $compile(element)(scope);
            scope.$digest();
            errorMessages = element.find('.CustomValidationError');
        });
    });

    it('should contain eight error messages', function () {
        expect(8).toEqual(errorMessages.length);
    });

    it('should contain eight hidden error messages', function () {
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

        expect(8).toEqual(hiddenErrorMessages.length);
        expect(0).toEqual(visibleErrorMessages.length);
    });

    it('should show errors one at a time', function () {
        input.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(1).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());
    });

    it('should show errors based on the order in the custom validations and hide resolved error messages', function () {
        input.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(1).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

        input.val('sadffsdaadfsfDsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(1).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
    });
});