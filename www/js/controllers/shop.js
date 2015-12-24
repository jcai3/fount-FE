'use strict';

angular.module('sywStyleXApp')
.controller('ShopCtrl', ['$rootScope','$scope', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, UtilityService, SortFilterService, ProductSearchService) {
  var apiLocker = false;

  $scope.shopObj = {
    topFilter: 'SALE',
    topSellerId: 0,
    noMoreData: false,
    pageNumber: 1,
    emptySearchResults: false,
    enableSellerModule: true,
    products: [],
    sellers: [{
      id: 0,
      name: 'All'
    }]
  };

  $scope.getMyCtrlScope = function() {
    return $scope;
  };

  $scope.setTopFilter = function(filter) {
    if ($scope.shopObj.topFilter == filter) {
      return;
    }

    $scope.shopObj.pageNumber = 1;
    apiLocker = false;
    $scope.shopObj.noMoreData = false;
    $scope.shopObj.emptySearchResults = false;
    $scope.shopObj.topFilter = filter;
    $scope.shopObj.sellers = [{
      id: 0,
      name: 'All'
    }];
    $scope.shopObj.products = [];
    getShopSellers();
  };

  $scope.loadMore = function() {
    if ($scope.shopObj.noMoreData || $scope.shopObj.pageNumber > 5) {
      return;
    }
    getSellerProducts();
  };

  $scope.loadNextPage = function() {
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

  $rootScope.$on('event.setTopSeller', function(event, data) {
    $scope.shopObj.pageNumber = 1;
    apiLocker = false;
    $scope.shopObj.topSellerId = data.id;
    $scope.shopObj.noMoreData = false;
    $scope.shopObj.emptySearchResults = false;
    $scope.shopObj.products = [];

    getSellerProducts();
  });

  $rootScope.$on('event.setTopFilter', function(event, data) {
    $scope.setTopFilter(data.filter);
  });

  getShopSellers();

}]);
