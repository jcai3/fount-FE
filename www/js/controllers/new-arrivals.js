'use strict';

angular.module('sywStyleXApp')
.controller('NewArrivalsCtrl', ['$rootScope','$scope', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, UtilityService, SortFilterService, ProductSearchService) {
  var apiLocker = false;

  $scope.newArrivalsObj = {
    topFilter: 'ARRIVALS',
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
    if ($scope.newArrivalsObj.topFilter == filter) {
      return;
    }

    $scope.newArrivalsObj.pageNumber = 1;
    apiLocker = false;
    $scope.newArrivalsObj.noMoreData = false;
    $scope.newArrivalsObj.emptySearchResults = false;
    $scope.newArrivalsObj.topFilter = filter;
    $scope.newArrivalsObj.sellers = [{
      id: 0,
      name: 'All'
    }];
    $scope.newArrivalsObj.products = [];
    getShopSellers();
  };

  $scope.loadMore = function() {
    if ($scope.newArrivalsObj.noMoreData || $scope.newArrivalsObj.pageNumber > 5) {
      return;
    }
    getSellerProducts();
  };

  $scope.loadNextPage = function() {
    if ($scope.newArrivalsObj.noMoreData) {
      return;
    }
    getSellerProducts();
  };

  var getShopSellers = function() {
    SortFilterService.getShopSellers($scope.newArrivalsObj.topFilter).then(function(result) {
      if (UtilityService.validateResult(result)) {
        var sellers = result.data.payload.SELLERS;
        if (sellers.length == 0) {
          $scope.newArrivalsObj.enableSellerModule = false;
          $scope.newArrivalsObj.sellers = [];
        } else {
          $scope.newArrivalsObj.enableSellerModule = true;
          $scope.newArrivalsObj.sellers.push.apply($scope.newArrivalsObj.sellers, sellers);
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

    SortFilterService.getSellerProducts($scope.newArrivalsObj.topSellerId, $scope.newArrivalsObj.topFilter, $scope.newArrivalsObj.pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.newArrivalsObj.noMoreData = true;
          if ($scope.newArrivalsObj.pageNumber == 1) {
            $scope.newArrivalsObj.emptySearchResults = true;
          }
        } else {
          $scope.newArrivalsObj.pageNumber++;
          $scope.newArrivalsObj.noMoreData = false;
          $scope.newArrivalsObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.newArrivalsObj.products.push.apply($scope.newArrivalsObj.products, products);
        }

        apiLocker = false;
      }
    });
  };

  $rootScope.$on('event.setTopSeller', function(event, data) {
    $scope.newArrivalsObj.pageNumber = 1;
    apiLocker = false;
    $scope.newArrivalsObj.topSellerId = data.id;
    $scope.newArrivalsObj.noMoreData = false;
    $scope.newArrivalsObj.emptySearchResults = false;
    $scope.newArrivalsObj.products = [];

    getSellerProducts();
  });

  $rootScope.$on('event.setTopFilter', function(event, data) {
    $scope.setTopFilter(data.filter);
  });

  getShopSellers();

}]);
