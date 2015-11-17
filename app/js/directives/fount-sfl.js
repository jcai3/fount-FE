'use strict';

angular.module('sywStyleXApp')
.directive('fountSfl', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-sfl.html',
    scope: {},
    link: function(scope, element, attrs) {
      scope.searchObj = {
        keyword: '',
        showSearchBar: false
      };

      scope.toggleSearchBar = function() {
        if (scope.searchObj.showSearchBar == false) {
          scope.searchObj.showSearchBar = true;
          // element.find('ul.sub-menu').css('opacity', 1);
        } else {
          scope.searchObj.showSearchBar = false;
          // element.find('ul.sub-menu').css('opacity', 0);
        }
      };
    }
  };
});
