'use strict';

angular.module('sywStyleXApp')
.directive('fountProductTile', ['UtilityService', 'SocialActionService', function(UtilityService, SocialActionService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-product-tile.html',
    scope: {
      product: '='
    },
    link: function(scope, element, attrs) {
      scope.toggleLikeProduct = function(product) {
        console.log(product.id);

        if (!scope.productLiked) {
          SocialActionService.likeProduct(product.id).then(function(result) {
            if (UtilityService.validateResult(result)) {
              scope.productLiked = true;
            }
          });
        } else {
          SocialActionService.unlikeProduct(product.id).then(function(result) {
            if (UtilityService.validateResult(result)) {
              scope.productLiked = false;
            }
          });
        }
      };
    }
  };
}]);
