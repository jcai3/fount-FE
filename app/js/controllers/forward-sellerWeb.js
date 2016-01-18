'use strict';

angular.module('sywStyleXApp')
.controller('ForwardSellerWebCtrl', ['$scope', '$state','$stateParams', '$ionicLoading', '$timeout', 'UtilityService', 'localStorageService',  function($scope, $state, $stateParams, $ionicLoading, $timeout, UtilityService, localStorageService) {
  UtilityService.gaTrackAppView('Forward Seller Website Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var productDetail = localStorageService.get('productDetail');
  console.log(productDetail);
  $scope.websiteName = productDetail.xapp.seller.name;
  console.log(UtilityService.cjProductUrlParser(productDetail.xapp.buyURL))
  $timeout(function(){
    // UtilityService.openSellerSite('https://www.ssense.com', 'ssense', 'product-detail', productDetail.xapp.id);
      UtilityService.openSellerSite(UtilityService.cjProductUrlParser(productDetail.xapp.buyURL), $scope.websiteName, 'product-detail', productDetail.xapp.id);
  }, 3000);


  $scope.backToPrev = function() {
    if(!!productDetail) {
      $state.go('product', {productId: productDetail.xapp.id});
    }
  }

}]);
