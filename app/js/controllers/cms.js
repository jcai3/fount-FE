'use strict';

angular.module('sywStyleXApp')
.controller('CmsCtrl', ['$scope', 'UtilityService', '$state', 'CmsService', 'AdminService', 'UserMediaService'
                        , function($scope, UtilityService, $state, CmsService, AdminService, UserMediaService) {
	var sellerId = 2; //user define
	var isCreate = false; //by default
	var pageNumber = 1; //load them all?
	var categoryId = 0;
	
	$scope.testdataset = [
	                      {name:"SUBCATEGORY1"},
	                      {name:"SUBCATEGORY2"},
	                      {name:"SUBCATEGORY3"}
	                  ];
	
	$scope.categoryChanged = function(category,id) {
	    var daid = "sub-1-"+id;
	    angular.element('#sub-1-'+id).show();
	}
	$scope.subcategoryChanged = function(category,id) {
	    var daid = "sub-2-"+id;
	    angular.element('#sub-2-'+id).show();
	}
	
	  
	CmsService.getSellerCategories(sellerId, isCreate, pageNumber).then(function(result){
		if(UtilityService.validate(result)) {
			console.log('get seller categories');
			$scope.sellerCategory = result.data.payload.CATEGORY;
		}
		else{
			console.log('cannot get seller categories');
		}
	});
	
	
	/*$.scope.invokeChildCategory = function(categoryId) {
		
		
		
		CmsService.getChildCategories(categoryId).then(function(result){
			if(UtilityService.validate(result)) {
				console.log('get child categories');
				$scope.childCategory = result.data.payload.XXX;
			}
			else{
				console.log('cannot get child categories');
			}
		});
	};*/
	var categoryMap = null;
	$scope.mapCategory = function() {
		CmsService.mapCategory($scope.categoryMap).then(function(result) {
	      if (UtilityService.validateResult(result)) {
	        $state.go($state.current, {}, {reload: true});
	      }
	    });
		
	 };
	
	
	 
	 var getAdminSellers = function() {
	    AdminService.getAdminSellers().then(function(res) {
	      if (UtilityService.validateResult(res)) {
	        $scope.adminSellers = res.data.payload.SELLERS;
	      }
	    });
	  };

	  $scope.updateAdminSeller = function() {
	    AdminService.updateAdminSellers($scope.adminSellers).then(function(res) {
	      if (UtilityService.validateResult(res)) {
	        $state.go($state.current, {}, {reload: true});
	      }
	    });
	  };
	  
	  $scope.showchild = function(id){
		  $window.alert("test");
	  };
	  
	
	
	 getAdminSellers();
	
}]);
