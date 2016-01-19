'use strict';

angular.module('sywStyleXApp')
.controller('DiscoverCtrl', ['$scope', 'UtilityService', function($scope, UtilityService) {
  var apiLocker = false;

  $scope.loadMore = function() {
    if ($scope.shopObj.noMoreData || $scope.shopObj.pageNumber > 5) {
      return;
    }
    getSellerProducts();
  };

  var getDiscoverPosts = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;

    SortFilterService.getSellerProducts($scope.shopObj.topSellerId, $scope.shopObj.topFilter, $scope.shopObj.pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.shopObj.noMoreData = true;
          if ($scope.shopObj.pageNumber == 1) {
            $scope.shopObj.emptySearchResults = true;
          }
        } else {
          $scope.shopObj.pageNumber++;
          $scope.shopObj.noMoreData = false;
          $scope.shopObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.shopObj.products.push.apply($scope.shopObj.products, products);
        }

        apiLocker = false;
      }
    });
  };

  getShopSellers();

}]);
