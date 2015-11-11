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
                'validation-one-number="true" />' +
                '<a class="btn-primary" validation-submit="{onSubmit:\'user.save()\', formName:\'form\'}" type="submit">Submit</a>'+
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

    xit('should contain all error messages', function () {
        expect(9).toEqual(errorMessages.length);
    });
    xit('should disable the submit button', function () {
        debugger;
    });
});
