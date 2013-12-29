"use strict;"

describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages, passwordInput, confirmPasswordInput;
    
    beforeEach(function (){
        module('directives.customvalidation.customValidations');
        module('extendCustomValidations');
        inject(function ($rootScope, $compile){
            element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                '<input ng-model="user.name" type="text" id="name" name="name" validation-field-required="true" validation-one-number="true" />'+
                '</form>');
            passwordInput = element.find('#password');
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
            errorMessages = element.find('.CustomValidationError');
        });
    });

    it('should contain all error messages', function () {
        expect(10).toEqual(errorMessages.length);
    });

    it('should contain all hidden error messages', function () {
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

        expect(10).toEqual(hiddenErrorMessages.length);
        expect(0).toEqual(visibleErrorMessages.length);
    });

    it('should show errors one at a time per field', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual($(visibleErrorMessages[0]).html().trim());
        expect('This is a required field').toEqual($(visibleErrorMessages[1]).html().trim());
    });

    it('should show errors based on the order in the custom validations and hide resolved error messages', function () {
        passwordInput.val('sadffsdaadfsfsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());

        passwordInput.val('sadffsdaadfsfDsda');
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
        expect(8).toEqual(hiddenErrorMessages.length);
        expect(2).toEqual(visibleErrorMessages.length);
        expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim());
    });
    
    describe('confirmPassword', function(){
        beforeEach(function (){
            inject(function ($rootScope, $compile){
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
                errorMessages = element.find('.CustomValidationError');
            });
        });

        it('should contain nine hidden error messages', function () {
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(9).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());   

            passwordInput.val('sadffsdaadfsSfsda');
            scope.$broadcast('runCustomValidations');
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim()); 
        });        
    });

    describe('object literal validation attribute value', function(){
            beforeEach(function (){
                inject(function ($rootScope, $compile){
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
                    errorMessages = element.find('.CustomValidationError');
                });
            });

            it('should contain nine hidden error messages', function () {
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

                expect(9).toEqual(hiddenErrorMessages.length);
                expect(0).toEqual(visibleErrorMessages.length);
            });

            it('should show password errors when password is changed', function (){
                passwordInput.val('sadffsdaadfsfsda');
                scope.$broadcast('runCustomValidations');
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
                expect(8).toEqual(hiddenErrorMessages.length);
                expect(1).toEqual(visibleErrorMessages.length);
                expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());   

                passwordInput.val('sadffsdaadfsSfsda');
                scope.$broadcast('runCustomValidations');
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
                expect(8).toEqual(hiddenErrorMessages.length);
                expect(1).toEqual(visibleErrorMessages.length);
                expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim()); 
            });        
        });

        xdescribe('custom error message template wrap', function () {
            beforeEach(function (){
                inject(function ($rootScope, $compile){                    
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
                    errorMessages = element.find('.CustomValidationError');
                });
            });

            it('should contain nine hidden error messages', function () {
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

                expect(9).toEqual(hiddenErrorMessages.length);
                expect(0).toEqual(visibleErrorMessages.length);
            });

            it('should show password errors when password is changed', function (){
                passwordInput.val('sadffsdaadfsfsda');
                scope.$broadcast('runCustomValidations');
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
                expect(8).toEqual(hiddenErrorMessages.length);
                expect(1).toEqual(visibleErrorMessages.length);
                expect('ErrorTemplateOne').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));   
                expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());   

                passwordInput.val('sadffsdaadfsSfsda');
                scope.$broadcast('runCustomValidations');
                hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
                visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
                expect(8).toEqual(hiddenErrorMessages.length);
                expect(1).toEqual(visibleErrorMessages.length);
                expect('ErrorTemplateTwo').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));   
                expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim()); 
            });        
        });
});