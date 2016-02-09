'use strict';

angular.module('sywStyleXApp')
.controller('CmsCtrl', ['$scope', '$compile', 'UtilityService', '$state', 'CmsService', 'AdminService'
                        , function($scope, $compile, UtilityService, $state, CmsService, AdminService) {
	var sellerId = 1; //user define
	var isCreate = false; //by default
	var pageNumber = 1; //load them all?
	var categoryId = 0;
	var mapping = [];
	var map = new Object(); 
	    map[sellerId] = $scope.sellerId;
	    map[categoryId] = $scope.categoryId;
	
	var newCategory = null;
	
	
	/*$scope.loadcategory = function(id) {
		console.log('loadcategory');
		$scope.sellerId = id;
		
		console.log('id='+$scope.sellerId);
		getSellerCategory(sellerId, isCreate, pageNumber);
		
		$http.get('/allSeller').success(function(sellerCategory){
			 $scope.allSeller = sellerCategory;
		});
		console.log('seller category is:'+$scope.sellerCategory);
	}*/
	
	console.log('getAllSellers');
	CmsService.getAllSellers().then(function(result){
		if(UtilityService.validateResult(result)) {
			console.log('get seller categories');
			$scope.allSeller = result.data.payload.SELLERS;
		}
		else{
			console.log('cannot get sellers');
		}
	});
	
	console.log('getSellerCategory');
	 //var getSellerCategory = function(sellerId, isCreate, pageNumber){
		CmsService.getSellerCategories(sellerId, isCreate, pageNumber).then(function(result){
			console.log('after call, before validate');
			if(UtilityService.validateResult(result)) {
				console.log('get seller categories');
				$scope.sellerCategory = result.data.payload.CATEGORY;
			}
			else{
				console.log('cannot get seller categories');
			}
			});
	// };
	
	 console.log('getChildCategorys');
	var getChildCategorys = function(categoryId) {
		console.log('id='+$scope.categoryId);
		CmsService.getChildCategories(categoryId).then(function(result){
			console.log($scope.result);
			if(UtilityService.validateResult(result)) {
				console.log('get child categories');
				$scope.childCategory = result.data.payload.CATEGORY;
			}
			else{
				console.log('cannot get child categories');
			}
		});
	};
	
	
	$scope.addChildCategory = function(Id) {
		alert('test');
		console.log('addChildCategory');
		console.log('current category data:'+$scope.childCategory);
		console.log('Id='+Id);
		$scope.newChild = getChildCategorys(Id);
		console.log('newChild is'+$scope.newChild);
		//save data to db
		mapping.push($scope.sellerId ,Id);
		console.log('data saved, add element now!!');
		
	    console.log('call method in dropdown');
	    console.log($scope.childCategory);
	    if (!!$scope.newChild) {
	      console.log('next child not empty, begin to append div!!!');
	      //$scope.newChild = $scope.childCategory.category;
	      console.log('apend');	      
	      //angular.element(document.getElementById('fount-cate-child')).append($compile("<div class=\"info\"><ul><select class=\"child-category\" ng-model=\"newChild\" ng-options=\"category.name for category in newChild\" ng-change=\"addChildCategory(category.name, category.id)\"><option value=\" \">Choose category</option></select></ul></div>")($scope));
	      
	      $(".child-info").append('<ul><select class="child-category" ng-model="'+$scope.newChild+'" ng-change="addChildCategory('+$scope.category.name+', '+$scope.category.id+')" id="'+$scope.category.id+'"><option value="">Choose your category</option><option ng-repeat="category for category in '+$scope.childCategory+'" value="{{category.name}}"></option></select></ul>');
	     
	      console.log('apended');
	      // $compile(appendContent)($scope);
	      }
	      else{
	    	console.log('nextChild empty');
	      }
	    };
	    
	  
	  
	
	
	$scope.mapCategory = function() {
		console.log('update map');
		CmsService.mapCategory($scope.map).then(function(result) {
	      //if (UtilityService.validateResult(result)) {
	        $state.go($state.current, {}, {reload: true});
	      //}
	    });
	 };
	
	 
	
	 console.log('getAdminSellers');
	 var getAdminSellers = function() {
	    AdminService.getAdminSellers().then(function(res) {
	      if (UtilityService.validateResult(res)) {
	        $scope.adminSellers = res.data.payload.SELLERS;
	      }
	    });
	  };
	 
	
	 getAdminSellers();
	 
	 getChildCategorys(0);
	
}]);
