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
        $state.go('product', {productId: product.id});
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
