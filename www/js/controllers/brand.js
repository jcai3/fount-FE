'use strict';

angular.module('sywStyleXApp')
.controller('BrandCtrl', ['$rootScope', '$scope', '$state','$stateParams', '$timeout', 'ngDialog', 'UtilityService', 'CartService', 'localStorageService', 'ProductDetailService', 'SortFilterService', function($rootScope, $scope, $state, $stateParams, $timeout, ngDialog, UtilityService, CartService, localStorageService, ProductDetailService, SortFilterService) {
  var filteredProductsPageNumber = 1;
  var filteredProductsApiLocker = false;
  var filters = {
    brandIds: [
      $stateParams.brandId
    ],
    sellerIds: [],
    sortBy: 'relevancy',
    filterRequest: ''
  };

  $scope.productsCount = 0;
  $scope.filteredProductsHasMoreData = true;
  $scope.brandName = '';
  $scope.filteredProducts = [];

  var getFilteredProducts = function() {
    if (filteredProductsApiLocker) {
      return;
    }

    filteredProductsApiLocker = true;

    SortFilterService.getFilteredProducts(filters.brandIds, filters.sellerIds, filters.sortBy, filteredProductsPageNumber, filters.filterRequest).then(function(res) {
      if (UtilityService.validateResult(res)) {
        if (filteredProductsPageNumber == 1) {
          $scope.productsCount = res.data.payload.COUNT;
          var product = res.data.payload.PRODUCTS[0];
          $scope.brandName = !!product.brand ? product.brand.name : product.seller.name;
        }

        if (res.data.payload.PRODUCTS.length === 0) {
          $scope.filteredProductsHasMoreData = false;
        } else {
          filteredProductsPageNumber++;
          $scope.filteredProductsHasMoreData = true;
          var filteredProducts = res.data.payload.PRODUCTS;
          $scope.filteredProducts.push.apply($scope.filteredProducts, filteredProducts);
        }
      } else {
        $scope.filteredProductsHasMoreData = false;
        console.log('error');
      }

      filteredProductsApiLocker = false;
    });
  };

  $scope.loadMore = function() {
    if (!$scope.filteredProductsHasMoreData) {
      return;
    }

    getFilteredProducts();
  };

  getFilteredProducts();

}]);
