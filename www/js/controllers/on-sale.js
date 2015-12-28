'use strict';

angular.module('sywStyleXApp')
.controller('OnSaleCtrl', ['$rootScope','$scope', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, UtilityService, SortFilterService, ProductSearchService) {
  var apiLocker = false;

  $scope.onSaleObj = {
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

  $scope.setTopFilter = function(filter) {
    if ($scope.onSaleObj.topFilter == filter) {
      return;
    }

    $scope.onSaleObj.pageNumber = 1;
    apiLocker = false;
    $scope.onSaleObj.noMoreData = false;
    $scope.onSaleObj.emptySearchResults = false;
    $scope.onSaleObj.topFilter = filter;
    $scope.onSaleObj.sellers = [{
      id: 0,
      name: 'All'
    }];
    $scope.onSaleObj.products = [];
    getShopSellers();
  };

  $scope.loadMore = function() {
    if ($scope.onSaleObj.noMoreData || $scope.onSaleObj.pageNumber > 5) {
      return;
    }
    getSellerProducts();
  };

  $scope.loadNextPage = function() {
    if ($scope.onSaleObj.noMoreData) {
      return;
    }
    getSellerProducts();
  };

  var getShopSellers = function() {
    SortFilterService.getShopSellers($scope.onSaleObj.topFilter).then(function(result) {
      if (UtilityService.validateResult(result)) {
        var sellers = result.data.payload.SELLERS;
        if (sellers.length == 0) {
          $scope.onSaleObj.enableSellerModule = false;
          $scope.onSaleObj.sellers = [];
        } else {
          $scope.onSaleObj.enableSellerModule = true;
          $scope.onSaleObj.sellers.push.apply($scope.onSaleObj.sellers, sellers);
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

    SortFilterService.getSellerProducts($scope.onSaleObj.topSellerId, $scope.onSaleObj.topFilter, $scope.onSaleObj.pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.onSaleObj.noMoreData = true;
          if ($scope.onSaleObj.pageNumber == 1) {
            $scope.onSaleObj.emptySearchResults = true;
          }
        } else {
          $scope.onSaleObj.pageNumber++;
          $scope.onSaleObj.noMoreData = false;
          $scope.onSaleObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.onSaleObj.products.push.apply($scope.onSaleObj.products, products);
        }

        apiLocker = false;
      }
    });
  };

  $rootScope.$on('event.setTopSeller', function(event, data) {
    $scope.onSaleObj.pageNumber = 1;
    apiLocker = false;
    $scope.onSaleObj.topSellerId = data.id;
    $scope.onSaleObj.noMoreData = false;
    $scope.onSaleObj.emptySearchResults = false;
    $scope.onSaleObj.products = [];

    getSellerProducts();
  });

  $rootScope.$on('event.setTopFilter', function(event, data) {
    $scope.setTopFilter(data.filter);
  });

  getShopSellers();

}]);
