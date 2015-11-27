'use strict';

angular.module('sywStyleXApp')
.directive('fountSearch', ['UtilityService', 'ProductSearchService', 'SortFilterService', '$state', function(UtilityService, ProductSearchService, SortFilterService, $state) {
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

      scope.searchObj = {
        keyword: '',
        showSearchBar: false
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

      scope.goToSearchResults = function(){
          scope.searchObj.showSearchBar = false;
          scope.searchObj.results = '';
          $state.go('search', {keyword: scope.searchObj.keyword});
      };
    }
  };
}]);
