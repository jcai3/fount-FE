'use strict';

angular.module('sywStyleXApp')
.directive('fountProductTile', ['$state', 'UtilityService', 'ProductDetailService', 'localStorageService', function($state, UtilityService, ProductDetailService, localStorageService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-product-tile.html',
    scope: {
      product: '='
    },
    link: function(scope, element, attrs) {
      scope.productDetail = function(product) {
        ProductDetailService.getProductDetail(product.id).then(function(response){
          if (UtilityService.validateResult(response)) {
            console.log(response);
            product.affiliateURL = decodeURIComponent(product.buyURL);
            product.mediaId = null;
            product.visualTagId = null;
            product.brandName = !!product.brand ? product.brand.name : null;
            product.brandId = !!product.brand ? product.brand.id : null;
            product.sellerName = !!product.seller ? product.seller.name : null;

            if(!!response.data.payload.PRODUCT.socialActionUserProduct) {
              product.socialActionUserProduct = response.data.payload.PRODUCT.socialActionUserProduct;
            }

            var productDetail = {
              xapp: product
              // source: 'shop'
            };

            if(response.data.payload.PRODUCT.twoTapData) {
              productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
            }

            localStorageService.set('productDetail', productDetail);
            // productDetailLocker = false;

            $state.go('product', {productId: product.id});
          }
        }, function(error) {
            console.log(error);
        });
      };

      scope.toggleLikeProduct = function(product) {
        console.log(product.id);

        if (!scope.productLiked) {
          ProductDetailService.likeProduct(product.id).then(function(result) {
            if (UtilityService.validateResult(result)) {
              scope.productLiked = true;
            }
          });
        } else {
          ProductDetailService.unlikeProduct(product.id).then(function(result) {
            if (UtilityService.validateResult(result)) {
              scope.productLiked = false;
            }
          });
        }
      };
    }
  };
}]);
