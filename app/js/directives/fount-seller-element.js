'use strict';

angular.module('sywStyleXApp')
.directive('fountSellerElement', ['UtilityService', 'ProductSearchService', 'SortFilterService', function(UtilityService, ProductSearchService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-seller-element.html',
    scope: {
      seller: '='
    },
    link: function(scope, element, attrs) {
      scope.setSellerId = function(id) {
        console.log(id);
      };
    }
  };
}]);
