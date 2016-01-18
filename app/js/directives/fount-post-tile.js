'use strict';

angular.module('sywStyleXApp')
.directive('fountPostTile', ['$state', 'UtilityService', 'ProductDetailService', 'localStorageService', function($state, UtilityService, ProductDetailService, localStorageService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-post-tile.html',
    scope: {
      discoverMedia: '='
    },
    link: function(scope, element, attrs) {

    }
  };
}]);
