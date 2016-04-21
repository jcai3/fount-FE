'use strict';

angular.module('sywStyleXApp')
.directive('fountSearch', ['$rootScope', 'UtilityService', 'ProductSearchService', 'SortFilterService', 'ProductDetailService', 'localStorageService', '$state', function($rootScope, UtilityService, ProductSearchService, SortFilterService, ProductDetailService, localStorageService, $state) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-search.html',
    scope: {},
    link: function(scope, element, attrs) {
      var filterParams = {
        sellerIds: [],
        brandIds: [],
        categoryIds: [],
        minPrice: '',
        maxPrice: '',
        sale: '',
        selectedSortby: 'relevancy'
      };

      var searchTimer = false;

      var notifyToCloseOverlay = function() {
        $rootScope.$emit('event.closeMobileOverlay');
      };

      scope.searchObj = {
        keyword: '',
        showSearchBar: false,
        showSearchResults: true
      };

      scope.showSearchResults = function() {
        scope.searchObj.showSearchResults = true;
      };

      scope.hideSearchResults = function() {
        scope.searchObj.showSearchResults = false;
      };

      scope.searchProducts = function() {
        clearTimeout(searchTimer);
        if (scope.searchObj.keyword.trim().length >= 3) {
          searchTimer = setTimeout(function() {
            ProductSearchService.searchProducts(1, scope.searchObj.keyword, filterParams).then(function(result) {
              if (UtilityService.validateResult(result)) {
                scope.searchObj.results = result.data.payload;
              }
            });
          }, 400);
        }



        // SortFilterService.getShopSellers(filter).then(function(result) {
        //   if (UtilityService.validateResult(result)) {
        //   }
        // });
      };

      scope.productDetail = function(product) {
        notifyToCloseOverlay();

        scope.searchObj = {
          keyword: '',
          showSearchBar: false,
          results: {},
          showSearchResults: true
        };

        $state.go('product', {productId: product.id});
        // ProductDetailService.getProductDetail(product.id).then(function(response){
        //   if (UtilityService.validateResult(response)) {
        //     console.log(response);
        //     product.affiliateURL = decodeURIComponent(product.buyURL);
        //     product.mediaId = null;
        //     product.visualTagId = null;
        //     product.brandName = !!product.brand ? product.brand.name : null;
        //     product.brandId = !!product.brand ? product.brand.id : null;
        //     product.sellerName = !!product.seller ? product.seller.name : null;
        //
        //     if(!!response.data.payload.PRODUCT.socialActionUserProduct) {
        //       product.socialActionUserProduct = response.data.payload.PRODUCT.socialActionUserProduct;
        //     }
        //
        //     var productDetail = {
        //       xapp: product
        //       // source: 'shop'
        //     };
        //
        //     if(response.data.payload.PRODUCT.twoTapData) {
        //       productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
        //     }
        //
        //     localStorageService.set('productDetail', productDetail);
        //     // productDetailLocker = false;
        //
        //     $state.go('product', {productId: product.id});
        //   }
        // }, function(error) {
        //     console.log(error);
        // });
      };

      scope.goToSearchResults = function(){
        if (scope.searchObj.keyword.trim().length == 0) {
          return;
        }

        notifyToCloseOverlay();
        $state.go('search', {keyword: scope.searchObj.keyword});

        scope.searchObj = {
          keyword: '',
          showSearchBar: false,
          results: {},
          showSearchResults: true
        };
      };
    }
  };
}]);
