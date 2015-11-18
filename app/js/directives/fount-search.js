'use strict';

angular.module('sywStyleXApp')
.directive('fountSearch', ['UtilityService', 'ProductSearchService', 'SortFilterService', function(UtilityService, ProductSearchService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-search.html',
    scope: {},
    link: function(scope, element, attrs) {
      var filterParams = {
        minPrice: '',
        maxPrice: '',
        sale: '',
        sortBy: 'relevancy'
      };

      scope.searchObj = {
        keyword: '',
        showSearchBar: false
      };

      scope.searchProducts = function() {
        ProductSearchService.searchProducts(1, scope.searchObj.keyword, filterParams).then(function(result) {
          if (UtilityService.validateResult(result)) {
          }
        });

        // SortFilterService.getShopSellers(filter).then(function(result) {
        //   if (UtilityService.validateResult(result)) {
        //   }
        // });
      };
    }
  };
}]);
