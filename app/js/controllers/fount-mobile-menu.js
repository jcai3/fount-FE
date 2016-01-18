'use strict';

angular.module('sywStyleXApp')
.controller('FountMobileMenuCtrl', ['$rootScope','$scope', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, UtilityService, SortFilterService, ProductSearchService) {
  var pageNumber = 1;
  var apiLocker = false;

  $scope.shopObj = {
    topFilter: 'SALE',
    topSellerId: 0,
    noMoreData: false,
    emptySearchResults: false,
    enableSellerModule: true,
    products: [],
    sellers: [{
      id: 0,
      name: 'All'
    }]
  };

  $scope.loadMore = function() {
    console.log('load more');
    if ($scope.shopObj.noMoreData) {
      return;
    }
    getSellerProducts();
  };

  var getShopSellers = function() {
    SortFilterService.getShopSellers($scope.shopObj.topFilter).then(function(result) {
      if (UtilityService.validateResult(result)) {
        var sellers = result.data.payload.SELLERS;
        if (sellers.length == 0) {
          $scope.shopObj.enableSellerModule = false;
          $scope.shopObj.sellers = [];
        } else {
          $scope.shopObj.enableSellerModule = true;
          $scope.shopObj.sellers.push.apply($scope.shopObj.sellers, sellers);
          getSellerProducts();
        }
      }
    });
  };

  var getSellerProducts = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;

    SortFilterService.getSellerProducts($scope.shopObj.topSellerId, $scope.shopObj.topFilter, pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.shopObj.noMoreData = true;
          if (pageNumber == 1) {
            $scope.shopObj.emptySearchResults = true;
          }
        } else {
          pageNumber++;
          $scope.shopObj.noMoreData = false;
          $scope.shopObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.shopObj.products.push.apply($scope.shopObj.products, products);
        }

        apiLocker = false;
      }
    });
  };

  $rootScope.$on('event.setTopSeller', function(event, data) {
    pageNumber = 1;
    apiLocker = false;
    $scope.shopObj.topSellerId = data.id;
    $scope.shopObj.noMoreData = false;
    $scope.shopObj.emptySearchResults = false;
    $scope.shopObj.products = [];

    getSellerProducts();
  });

  getShopSellers();

}]);
