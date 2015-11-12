'use strict';

angular.module('sywStyleXApp')
.directive('productTile', ['UtilityService', function(UtilityService){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'product-tile.html',
    scope: {
      product: '='
    },
    link: function(scope, element, attrs) {
      if (!!scope.product) {
        if (!!scope.product.seller && !!scope.product.seller.name) {
          scope.product.brandName = (!!scope.product.brand && !!scope.product.brand.name) ? scope.product.brand.name : scope.product.seller.name;
        } else {
          scope.product.brandName = (!!scope.product.brandName) ? scope.product.brandName : scope.product.sellerName;
        }

        scope.product.name = UtilityService.productNameParser(scope.product.name, scope.product.brandName);
      }
    }
  };
}]);
