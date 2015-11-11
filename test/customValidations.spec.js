"use strict;"

describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages,
        passwordInput, confirmPasswordInput, templateRetriever;

    beforeEach(function (){
        module('directives.customvalidation.customValidationTypes');
        inject(function ($injector, $rootScope, $compile, $q, $timeout) {
            element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-field-required="true" '+
                'validation-min-length="8" ' +
                'validation-one-alphabet="true" ' +
                'validation-one-number="true" ' +
                'validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" ' +
                'validation-no-special-chars="true" ' +
                'validation-no-space="true" />'+
                '<input ng-model="user.name" type="text" id="name" name="name" ' +
                'validation-field-required="true" ' +
                'validation-one-number="true" />'+
                '</form>');
            passwordInput = element.find('#password');
            templateRetriever = $injector.get('templateRetriever');

            spyOn(templateRetriever, 'getTemplate').and.callFake(function (templateUrl){
                var template;
                if(templateUrl === 'views/errorTemplateOne.html'){
                    template = '<div class="ErrorTemplateOne" >{{errorMessage}}</div>'
                }
                if(templateUrl === 'views/errorTemplateTwo.html'){
                    template = '<div class="ErrorTemplateTwo" >{{errorMessage}}</div>'
                }
                return $q.when(template);
            });

            scope = $rootScope;

            angular.extend(scope, {
                user: {
                    name: null,
                    password: null,
                    confirmPassword: null
                }
            });
            $compile(element)(scope);
            scope.$digest();
            $timeout.flush();
            errorMessages = element.find('.CustomValidationError');
        });
    });

    it('should contain all error messages', function () {
        expect(9).toEqual(errorMessages.length);
    });

    it('should contain all hidden error messages', function () {
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

        expect(9).toEqual(hiddenErrorMessages.length);
        expect(0).toEqual(visibleErrorMessages.length);
    });

    it('should show errors one at a time per field', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual($(visibleErrorMessages[0]).html().trim());
        expect('This is a required field').toEqual($(visibleErrorMessages[1]).html().trim());
    });

    it('should show errors based on the order in the custom validations and hide resolved error messages', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

        passwordInput.val('sadffsdaadfsfDsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(7).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
    });

    describe('getValidationAttributeValue jsol reader', function () {

        it('should return value property by default', function(){
            var val1 = getValidationAttributeValue('5');
            var val2 = getValidationAttributeValue("{value: '5'}");
            expect(val1).toEqual(val2);
        });
        it('should return specified property', function () {
            var val = getValidationAttributeValue('{me:5}', 'me');
            expect(val).toEqual(5);
            var val = getValidationAttributeValue('{me:5}', 'me', true);
            expect(val).toEqual(5);
        });
        it('should default to value property if specified property does not exist and strict is not true', function () {
            var val = getValidationAttributeValue('{med:5, value: 6}', 'me');
            expect(val).toEqual(6);
        });
        it('should return undefined if strict is true and the specified property does not exist', function () {
            var val = getValidationAttributeValue('{med:5, value: 6}', 'me', true);
            expect(val).toEqual(undefined);
            var val = getValidationAttributeValue('5', 'me', true);
            expect(val).toEqual(undefined);
        });
    });

    describe('confirmPassword', function(){
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                    'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                    'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                    '<input ng-model="user.confirmPassword" type="text" id="confirmPassword" name="confirmPassword" validation-confirm-password="true" />'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain nine hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(8).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

            passwordInput.val('sadffsdaadfsSfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
        });
    });

    describe('validation false', function() {
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="false" '+
                    'validation-min-length="false" validation-one-alphabet="false" '+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain zero error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(0).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });
    });

    describe('validationFieldRequired', function() {
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<label for="password">Password</label>'+
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" '+
                    'validation-field-required="true"'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should apply requiredFieldLabel class to label', function () {
            var label, labelClass;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            label = element.find('label');
            labelClass = label.attr('class');
            expect(/requiredFieldLabel/.test(labelClass)).toBe(true);
        });
    });

    describe('object literal validation attribute value', function(){
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                    'validation-min-length="{ template:\'\', value: 8}" validation-one-alphabet="{ template:\'\', value: true}" validation-one-number="{ template:\'\', value: true}" validation-one-lower-case-letter="true" '+
                    'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                    '<input ng-model="user.confirmPassword" type="text" id="confirmPassword" name="confirmPassword" validation-confirm-password="true" />'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain nine hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(8).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

            passwordInput.val('sadffsdaadfsSfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
        });
    });

    describe('custom message', function(){
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                    'validation-min-length="{ message: \'under min length\', value: 8}" '+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('ffasdf');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('under min length').toEqual(visibleErrorMessages.html().trim());
        });
    });

    describe('custom error message template wrap', function () {
        beforeEach(function (){
            inject(function ($rootScope, $compile, $timeout){
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                    'validation-min-length="{ template:\'views/errorTemplateOne.html\', value: 8}" validation-one-alphabet="{ template:\'views/errorTemplateTwo.html\', value: true}" validation-one-number="{ template:\'views/errorTemplateTwo.html\', value: 8}" validation-one-lower-case-letter="true" '+
                    'validation-one-upper-case-letter="{ template:\'views/errorTemplateOne.html\', value: 8}" validation-no-special-chars="true" validation-no-space="true" />'+
                    '<input ng-model="user.confirmPassword" type="text" id="confirmPassword" name="confirmPassword" validation-confirm-password="true" />'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    }
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain nine hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(8).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('ErrorTemplateOne').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

            passwordInput.val('sadffsdaadfsSfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(7).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('ErrorTemplateTwo').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
        });
    });
    describe('maxlength validation', function (){
        it('should use the custom message when specified', function () {

        });
    });
    describe('error message modified by validator', function() {
        var customValidationTypes;
        beforeEach(function (){
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" '+
                    'validation-max-length="5"/>'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should be able to modify error message in validator', function () {
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(0).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Maximum of 5 characters').toEqual(visibleErrorMessages.html().trim());
        });
    });
    describe('uses custom error message when supplied', function() {
        var customValidationTypes;
        beforeEach(function () {
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5}\'/>' +
                '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });
        it('should be able to modify error message in validator', function () {
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(0).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('customMessage').toEqual(visibleErrorMessages.html().trim());
        });
    });
    describe('validation submit validate one required field', function() {
        var customValidationTypes;
        beforeEach(function () {
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password"' +
                'validation-field-required="true" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5, "validateWhileEntering": true }\'/>' +
                '<a validation-submit=\'{"formName":"form", "onSubmit":"onSubmit()"}\' >Submit</a>' +
                '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                scope.onSubmit = jasmine.createSpy('scope#onValid');
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });
        it('should have invalid submit given a pristine form with a required field', function () {
            var form = element;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(2).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
            var submit = form.find('a');
            expect(submit.hasClass('invalid')).toEqual(true);
            expect(submit.hasClass('valid')).toEqual(false);
        });
    });
    describe('validation submit validate while entering is true', function() {
        var customValidationTypes;
        beforeEach(function () {
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5, "validateWhileEntering": true }\'/>' +
                '<a validation-submit=\'{"formName":"form", "onSubmit":"onSubmit()"}\' >Submit</a>' +
                '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                scope.onSubmit = jasmine.createSpy('scope#onValid');
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });
        it('should change element class to invalid', function () {
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(0).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('customMessage').toEqual(visibleErrorMessages.html().trim());
            expect(form.hasClass('ng-invalid')).toBe(true);
            expect(form.hasClass('ng-valid')).toBe(false);
        });
        it('should change element class to valid', function () {
            passwordInput.val('asdf');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
        });
        it('should not call onSubmit when clicked', function () {
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(0).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('customMessage').toEqual(visibleErrorMessages.html().trim());
            expect(form.hasClass('ng-invalid')).toBe(true);
            expect(form.hasClass('ng-valid')).toBe(false);
            form.find('a').click();
            expect(scope.onSubmit).not.toHaveBeenCalled();
        });
        it('should call onSubmit when clicked', function () {
            passwordInput.val('asdf');
            scope.form.$setDirty();
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
            form.find('a').click();
            expect(scope.onSubmit).toHaveBeenCalled();
        });
    });
    xdescribe('validation submit validate while entering is true with multiple fields', function() {
        var customValidationTypes,
            nameInput;
        beforeEach(function () {
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5, "validateWhileEntering": true }\'/>' +
                '<input ng-model="user.name" type="text" id="name" name="name" validation-field-required="true" validation-one-number="true" />'+
                '<a validation-submit=\'{"formName":"form", "onSubmit":"onSubmit()"}\' >Submit</a>' +
                '</form>');
                passwordInput = element.find('#password');
                nameInput = element.find('#name');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                scope.onSubmit = jasmine.createSpy('scope#onValid');
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });
        it('should have invalid submit given a form with a required field and a valid dirty field', function () {
            passwordInput.val('dasaa');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(2).toEqual(hiddenErrorMessages.length);

            //runCustomValidations should not invalidate a field that is not dirty
            expect(0).toEqual(visibleErrorMessages.length);

            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
            var submit = form.find('a');
            expect(submit.hasClass('invalid')).toEqual(true);
            expect(submit.hasClass('valid')).toEqual(false);
        });
        it('should change element class to invalid', function () {
            passwordInput.val('sadffsdaadfsfsda');
            nameInput.val('nelson');
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

            nameInput.val('nelso1n');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(2).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('customMessage').toEqual(visibleErrorMessages.html().trim());
            expect(form.hasClass('ng-invalid')).toBe(true);
            expect(form.hasClass('ng-valid')).toBe(false);

            passwordInput.val('fsad');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(3).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
        });
        it('should change element class to valid', function () {
            passwordInput.val('asdf');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
        });
        it('should not call onSubmit when clicked', function () {
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.removeClass('ng-pristine');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(0).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('customMessage').toEqual(visibleErrorMessages.html().trim());
            expect(form.hasClass('ng-invalid')).toBe(true);
            expect(form.hasClass('ng-valid')).toBe(false);
            form.find('a').click();
            expect(scope.onSubmit).not.toHaveBeenCalled();
        });
        it('should call onSubmit when clicked', function () {
            passwordInput.val('asdf');
            scope.form.$setDirty();
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
            form.find('a').click();
            expect(scope.onSubmit).toHaveBeenCalled();
        });
    });
    describe('validation submit validate while entering is true when onSubmit is defined on scope model', function() {
        var customValidationTypes;
        beforeEach(function () {
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" ' +
                'validation-max-length=\'{"message":"customMessage", "value":5, "validateWhileEntering": true }\'/>' +
                '<a validation-submit=\'{"formName":"form", "onSubmit":"model.onSubmit()"}\' >Submit</a>' +
                '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                scope.model = { onSubmit: jasmine.createSpy('scope#onValid')};
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });
        it('should call onSubmit when clicked', function () {
            passwordInput.val('asdf');
            scope.form.$setDirty();
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            var form = element;
            form.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            expect(form.hasClass('ng-invalid')).toBe(false);
            expect(form.hasClass('ng-valid')).toBe(true);
            form.find('a').click();
            expect(scope.model.onSubmit).toHaveBeenCalled();
        });
    });
    describe('support selects', function() {
        var customValidationTypes;
        beforeEach(function (){
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                    '<select ng-model="user.password" name="password" id="password" ng-model="user.password"'+
                    'ng-options="option for option in selectOptions"'+
                    'validation-field-required="true"'+
                    'validation-dynamically-defined="locallyDefinedValidations"<select/>'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    selectOptions: ['validOption', 'invalidOption1'],
                    user: {
                        password: null,
                        confirmPassword: null
                    },
                    locallyDefinedValidations: [
                        {
                            errorMessage: 'Cannot contain the number one',
                            validator: function (errorMessageElement, val){
                              return /1/.test(val) !== true;
                            }
                        }
                    ]
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain 2 hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(2).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show errors when select value is changed to invalid option', function (){
            scope.user.password = 'validOption';
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(2).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);

            scope.user.password = 'invalidOption1';
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Cannot contain the number one').toEqual(visibleErrorMessages.html().trim());
        });
    });

    describe('validationDynamicallyDefined', function() {
        var customValidationTypes;
        beforeEach(function (){
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" '+
                    'validation-dynamically-defined="locallyDefinedValidations"/>'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    },
                    locallyDefinedValidations: [
                        {
                            errorMessage: 'Cannot contain the number one',
                            validator: function (errorMessageElement, val){
                              return /1/.test(val) !== true;
                            }
                        },
                        {
                          errorMessage: 'Cannot contain the number two',
                             validator: function (errorMessageElement, val){
                              return /2/.test(val) !== true;
                            }
                        }
                    ]
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should add dynamically defined validation to customvalidations', function () {
            var label, labelClass;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(1).toEqual(hiddenErrorMessages.length); //Multiple validations dynamically displayed using one error message element
            expect(0).toEqual(visibleErrorMessages.length);
        });
    });

    describe('live feedback | success', function() {
        var successSpy;

        beforeEach(function (){
            inject(function ($injector, $rootScope, $compile, $timeout) {
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" '+
                    'validation-dynamically-defined="locallyDefinedValidations"/>'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                successSpy = jasmine.createSpy('successSpy');
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    },
                    locallyDefinedValidations: [
                        {
                            errorMessage: 'Cannot contain the number one',
                            success: successSpy,
                            validator: function (errorMessageElement, val){
                              return /1/.test(val) !== true;
                            }
                        }
                    ]
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should add dynamically defined validation to customvalidations', function () {
            var label, labelClass;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            scope.user.password = 'validOption';
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();

            expect(1).toEqual(hiddenErrorMessages.length); //Multiple validations dynamically displayed using one error message element
            expect(0).toEqual(visibleErrorMessages.length);

            expect(successSpy).toHaveBeenCalled();
        });
    });

    describe('asynchronous validation', function(){
        beforeEach(function (){
            inject(function ($injector, $rootScope, $compile, $timeout, $q) {
                element = angular.element('<form name="form">' +
                    '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" '+
                    'validation-dynamically-defined="locallyDefinedValidations"/>'+
                    '</form>');
                passwordInput = element.find('#password');
                confirmPasswordInput = element.find('#confirmPassword');
                scope = $rootScope;
                angular.extend(scope, {
                    user: {
                        password: null,
                        confirmPassword: null
                    },
                    locallyDefinedValidations: [
                        {
                            errorMessage: 'Cannot contain the number one',
                            validator: function (errorMessageElement, val){
                                var deferred = $q.defer();

                                $timeout(function() {
                                    if(/1/.test(val) === true) {
                                        deferred.reject();
                                    } else {
                                        deferred.resolve();
                                    }
                                }, 1000);
                                $timeout.flush();
                                return deferred.promise;
                            }
                        },
                        {
                          errorMessage: 'Cannot contain the number two',
                             validator: function (errorMessageElement, val){
                                return /2/.test(val) !== true;
                            }
                        }
                    ]
                });
                $compile(element)(scope);
                scope.$digest();
                $timeout.flush();
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should add dynamically defined validation to customvalidations', function () {
            var label, labelClass;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(1).toEqual(hiddenErrorMessages.length); //Multiple validations dynamically displayed using one error message element
            expect(0).toEqual(visibleErrorMessages.length);
        });

        xit('should show errors when value is changed to invalid option', function (){
            scope.user.password = 'validOption';
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);

            scope.user.password = 'invalidOption1';
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(1).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Cannot contain the number one').toEqual(visibleErrorMessages.html().trim());
        });
    });
});
