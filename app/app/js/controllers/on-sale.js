'use strict';

angular.module('sywStyleXApp')
.controller('OnSaleCtrl', ['$rootScope','$scope', '$timeout', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, $timeout, UtilityService, SortFilterService, ProductSearchService) {
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
          initializeSellerCarousel();
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
          if (result.data.payload.PRODUCTS.length === 20) {
            $scope.onSaleObj.pageNumber++;
            $scope.onSaleObj.noMoreData = false;
          } else {
            $scope.onSaleObj.noMoreData = true;
          }
          $scope.onSaleObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.onSaleObj.products.push.apply($scope.onSaleObj.products, products);
        }

        apiLocker = false;
      }
    });
  };

  var initializeSellerCarousel = function() {

    var startPosition = 0;

    var settings = {
      circular: true,
      infinite: true,
      responsive: true,
      width: null,
      align: 'center',
      auto: false,
      items: {
        visible: 6,
        minimum: 5,
        start: startPosition
      },
      scroll: {
        items: 1,
        duration: 50,
        pauseOnHover: true
      },
      prev: {
        button: $('#seller-carousel-prev'),
        key: "left"
      },
      next: {
        button: $('#seller-carousel-next'),
        key: "right"
      }
    };

    $timeout(function(){
      $('#seller-carousel').carouFredSel(settings);
    }, 10);
  };

  $scope.setTopSellerId = function(id) {
    if ($scope.onSaleObj.topSellerId == id) {
      return;
    }

    apiLocker = false;
    $scope.onSaleObj.topSellerId = id;
    $scope.onSaleObj.pageNumber = 1;
    $scope.onSaleObj.noMoreData = false;
    $scope.onSaleObj.emptySearchResults = false;
    $scope.onSaleObj.products = [];

    getSellerProducts();
  };

  getShopSellers();
  UtilityService.updateTopFilter('SALE');
}]);
