'use strict';

angular.module('sywStyleXApp')
.directive('fountCategorySelector', ['$rootScope', '$timeout', 'UtilityService', function($rootScope, $timeout, UtilityService) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'views/templates/fount-category-selector.html',
    scope: {
    	category: '='
    },
    controller: function($scope) {
    	console.log($scope.data);
    },
    link: function(scope, element, attrs) {
    	
    	console.log(attrs.id);
    }
  };
}]);
