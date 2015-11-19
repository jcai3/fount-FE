'use strict';

angular.module('sywStyleXApp')
.directive('fountProductTile', ['UtilityService', 'ProductSearchService', 'SortFilterService', function(UtilityService, ProductSearchService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-product-tile.html',
    scope: {
      product: '='
    },
    link: function(scope, element, attrs) {

    }
  };
}]);
