xdescribe('templateRetriever', function () {
	var $htttpBackend, templateRetriever;

	beforeEach(function(){
		module('services.templateretriever.templateRetriever');
		inject(function($injector){
			$htttpBackend = $injector.get('$htttpBackend');
			templateRetriever = $injector.get('templateRetriever');
		});		
	});

	it('should get the correct template', function(){
		// $httpBackend.expectGET('/views/templateOne.html').respond();	
	});
});