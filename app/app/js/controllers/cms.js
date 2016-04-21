'use strict';

angular
		.module('sywStyleXApp')
		.controller(
				'CmsCtrl',
				[
						'$scope',
						'$compile',
						'$rootScope',
						'UtilityService',
						'$state',
						'CmsService',
						'AdminService',
						function($scope, $compile, $rootScope, UtilityService, $state,
								CmsService, AdminService) {
							var sellerId = 1;
							var isCreate = false;
							var pageNumber = 1;
							var categoryId = 0;
							var nextCategory;
							var currentSellerId = 0;
							$rootScope.pageIndex = 1;
							var myEl = null;

							var map = [];

							$rootScope.pageNumber = 1;
							// var mapping = $resource($scope.sellerId,
							// $scope.categoryId);

							var newCategory = null;

							var getAdminSellers = function() {
								AdminService
										.getAdminSellers()
										.then(
												function(res) {
													if (UtilityService
															.validateResult(res)) {
														$scope.adminSellers = res.data.payload.SELLERS;
													}
												});
							};				
							
							var getSellerCategory = function(sellerId,
									isCreate, pageNumber) {
								CmsService
										.getSellerCategories(sellerId,
												isCreate, pageNumber)
										.then(
												function(result) {
													/*console.log('seller id is:'+ sellerId + ', isCreate is' + isCreate + ', pageNum is'
															+ pageNumber);*/
													if (UtilityService.validateResult(result)) {
														$scope.sellerCategory = result.data.payload.CATEGORY;
													} else {
														console.log('cannot get seller categories');
													}
												});
							};

							var getChildCategorys = function(categoryId) {
								/* console.log('id=' + categoryId); */
								return CmsService
										.getChildCategories(categoryId)
										.then(
												function(result) {
													/*console
															.log('get child result'
																	+ result);*/
													if (UtilityService
															.validateResult(result)) {
														console
																.log('get child categories');
														$scope.result = result.data.payload.CATEGORY;
													} else {
														console
																.log('cannot get child categories');
													}
												});
							};
					
							
							var rootIndex = 0;
							// show child category upon selecting from category
							$scope.columns = [];
							$scope.addChildCategory = function(index, Id, currentLevel) {
								if (currentLevel == 0) {
									$scope.rootIndex = index;
									/*console.log(index);*/
								} else {
									index = $scope.rootIndex;
								}
								console.log('$rootIndex is:' + rootIndex);
								// clear previous sub category
								$scope.columns.splice(currentLevel, 100);

								getChildCategorys(Id).then(
										function(result) {
											/*console.log('result'
													+ $scope.result);
											// expand
											console.log('called dropdown');
											console.log('current level'
													+ currentLevel);*/
											$scope.columns.push({
												level : currentLevel + 1,
												dropdown : $scope.result
											});
											/*console.log('colums:::'
													+ $scope.columns);*/
										});

								console.log('key:'
										+ $scope.sellerCategory[index].id);
								$scope.currentSellerId =  $scope.sellerCategory[index].id;
								console.log('value:' + Id);
								CmsService.mapCategory($scope.sellerCategory[index].id, Id).then(function(result) {
													console.log(result);
													if (UtilityService.validateResult(result)) {
														console.log('category.id is: ' + $scope.category.id);
														angular.element('#sellerCategory-' + $scope.category.id).css('color','#66ccff');
													}
												});
							};

							$scope.$watch(
											'one',
											function(newVal, oldVal) {
												if ($scope.one) {													
													/*console.log('changing seller...');
													console.log('seller id is:'	+ $scope.one.id);*/
													$scope.sellerId = $scope.one.id;
													$rootScope.pageIndex = 1;
													pageNumber = 1;
													var myEll = angular.element( document.querySelector('.ss') );
													myEll.css('color','#000000');
													//$scope.myEl.css('color','#000000');
													$scope.myEl = angular.element( document.querySelector('#t-'+$scope.currentSellerId) );
													$scope.myEl.css('color','#000000');
													$scope.visibility2 = true;
													CmsService.getSellerCategories($scope.one.id,true,pageNumber).then(function(result) {
														$scope.sellerCategory = result.data.payload.CATEGORY;
														     });
												}
											});

							$scope.visibility2 = true;
							// next page method
							$scope.$watch('two',function() {$scope.nextPage = function() {
								$scope.visibility = true;
								pageNumber = pageNumber + 1;
								console.log('next function working...');
								
								try{$scope.sellerId = $scope.one.id}
								catch(e){ 
									$scope.sellerId=1;
								}
								
								console.log('sellerId is: '+ $scope.sellerId+' next pagenumber is: '+ pageNumber);
												
								$rootScope.pageIndex = pageNumber;							
								
								$scope.myEl = angular.element( document.querySelector('#t-'+$scope.currentSellerId) );
								$scope.myEl.css('color','#000000');

								CmsService.getSellerCategories($scope.sellerId,true,pageNumber).then(function(result) {
													$scope.sellerCategory = result.data.payload.CATEGORY;
												});
								
								var nextPage = pageNumber + 1;
								console.log('detect next next pages number: '+ nextPage);
								CmsService.getSellerCategories($scope.sellerId,true,nextPage).then(function(result)
										{$scope.nextCategory = result.data.payload.CATEGORY;
												});
								console.log('sellerCategory length is'+ $scope.sellerCategory.length);
								console.log('nextCategory'+ $scope.nextCategory.length);
								if ($scope.nextCategory.length == 0) {
									console.log('this is the end');
									$scope.visibility2 = false;
								}						
								
							
								//prev function
								$scope.previousPage = function() {
									console.log('prev cta, pageNumber :'+ pageNumber);
									$scope.visibility2 = true;
									if (pageNumber == 1) {$scope.visibility = false;} 
									else 
									{
										$scope.visibility = true;
										console.log('pageNumber before click: '+ pageNumber);
										pageNumber = pageNumber - 1;
										if (pageNumber == 1) {$scope.visibility = false;
										}
										console.log('pageNumber after click: '+ pageNumber);
										$rootScope.pageIndex = pageNumber;
										
										try{$scope.sellerId = $scope.one.id}
										catch(e){ 
											$scope.sellerId=1;
										}
										/*console.log('selleId is:'+ $scope.sellerId);*/
										$scope.myEl = angular.element( document.querySelector('#t-'+$scope.currentSellerId) );
										$scope.myEl.css('color','#000000');
										CmsService.getSellerCategories($scope.sellerId,true,pageNumber)
												.then(function(result) {
													$scope.sellerCategory = result.data.payload.CATEGORY;
												});
									 	}
								}
							}
						});

						
						
							
							$scope.update = function(){
								console.log('id is'+$scope.currentSellerId);
								$scope.myEl = angular.element( document.querySelector('#t-'+$scope.currentSellerId) );
								$scope.myEl.css('color','#66ccff');
							};
							
							

							getAdminSellers();
							CmsService
									.getChildCategories(0)
									.then(
											function(result) {

												if (UtilityService
														.validateResult(result)) {
													/*console
															.log('get root categories');*/
													$scope.rootCategory = result.data.payload.CATEGORY;
												} else {
													console
															.log('cannot get child categories');
												}
											});
							//getChildCategorys(0);
							//initiao load of seller content
							getSellerCategory(sellerId, isCreate, pageNumber);


						} ]);