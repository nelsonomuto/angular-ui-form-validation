"use strict;"

describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages, 
        passwordInput, confirmPasswordInput, templateRetriever;
    
    beforeEach(function (){
        module('directives.customvalidation.customValidationTypes');        
        inject(function ($injector, $rootScope, $compile, $q, $timeout) {
            element = angular.element('<form name="form">' +
                '<input ng-model="user.password" type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" />'+
                '<input ng-model="user.name" type="text" id="name" name="name" validation-field-required="true" validation-one-number="true" />'+
                '</form>');
            passwordInput = element.find('#password');
            templateRetriever = $injector.get('templateRetriever');

            spyOn(templateRetriever, 'getTemplate').andCallFake(function (templateUrl){
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

        it('should toggle requiredFieldLabel class on label based on whether there is a field value or not', function () {
            var label, labelClass;
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(1).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
            label = element.find('label');
            labelClass = label.attr('class');
            expect(/requiredFieldLabel/.test(labelClass)).toBe(true);

            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            label = element.find('label');
            labelClass = label.attr('class');
            expect(/requiredFieldLabel/.test(labelClass)).toBe(false);

            passwordInput.val('');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
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

            expect(9).toEqual(hiddenErrorMessages.length);
            expect(0).toEqual(visibleErrorMessages.length);
        });
        
        it('should show password errors when password is changed', function (){
            passwordInput.val('sadffsdaadfsfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('ErrorTemplateOne').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));   
            expect('Must contain at least one uppercase letter').toEqual(visibleErrorMessages.html().trim());   

            passwordInput.val('sadffsdaadfsSfsda');
            element.scope().$apply();
            scope.$broadcast('runCustomValidations');
            element.scope().$apply();
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');
            expect(8).toEqual(hiddenErrorMessages.length);
            expect(1).toEqual(visibleErrorMessages.length);
            expect('ErrorTemplateTwo').toEqual(angular.element(visibleErrorMessages[0]).parents('div').attr('class'));   
            expect('Must contain at least one number').toEqual(visibleErrorMessages.html().trim()); 
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
            hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
            visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"], .CustomValidationError[style="display: block;"]');

            expect(1).toEqual(hiddenErrorMessages.length); //Multiple validations dynamically displayed using one error message element
            expect(0).toEqual(visibleErrorMessages.length);
        });

        it('should show errors when value is changed to invalid option', function (){
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