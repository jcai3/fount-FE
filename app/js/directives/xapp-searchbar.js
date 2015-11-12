'use strict';

angular.module('sywStyleXApp')
.directive('xappSearchbar', ['UtilityService', 'ProductSearchService', function(UtilityService, ProductSearchService){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'xapp-searchbar.html',
    scope: {
      getData: '&source',
      model: '=?',
      search: '=?filter'
    },
    link: function(scope, element, attrs) {
      attrs.minLength = attrs.minLength || 0;
      scope.placeholder = attrs.placeholder || '';
      scope.search = {value: ''};

      if (attrs.class)
        element.addClass(attrs.class);

      if (attrs.source) {
        scope.$watch('search.value', function (newValue, oldValue) {
          if (newValue.length > attrs.minLength) {
            scope.getData({str: newValue}).then(function (results) {
              scope.model = results;
            });
          } else {
            scope.model = [];
          }
        });
      }

      scope.clearSearch = function() {
        scope.search.value = '';
      };


    }
  };
}]);
