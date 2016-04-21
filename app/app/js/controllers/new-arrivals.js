'use strict';

angular.module('sywStyleXApp')
.controller('NewArrivalsCtrl', ['$rootScope', '$scope', '$timeout', 'UtilityService', 'SortFilterService', 'ProductSearchService', function($rootScope, $scope, $timeout, UtilityService, SortFilterService, ProductSearchService) {
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
          initializeSellerCarousel();
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
          if (result.data.payload.PRODUCTS.length === 20) {
            $scope.newArrivalsObj.pageNumber++;
            $scope.newArrivalsObj.noMoreData = false;
          } else {
            $scope.newArrivalsObj.noMoreData = true;
          }
          $scope.newArrivalsObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          $scope.newArrivalsObj.products.push.apply($scope.newArrivalsObj.products, products);
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
    if ($scope.newArrivalsObj.topSellerId == id) {
      return;
    }

    apiLocker = false;
    $scope.newArrivalsObj.topSellerId = id;
    $scope.newArrivalsObj.pageNumber = 1;
    $scope.newArrivalsObj.noMoreData = false;
    $scope.newArrivalsObj.emptySearchResults = false;
    $scope.newArrivalsObj.products = [];

    getSellerProducts();
  };

  getShopSellers();
  UtilityService.updateTopFilter('ARRIVALS');
}]);
