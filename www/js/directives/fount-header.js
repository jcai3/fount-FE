'use strict';

angular.module('sywStyleXApp')
.directive('fountHeader', ['$state', function($state) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-header.html',
    scope: {},
    link: function(scope, element, attrs) {
      scope.goToShop = function() {
        $state.go('shop');
      };
    }
  };
}]);
