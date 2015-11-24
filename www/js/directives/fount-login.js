'use strict';

angular.module('sywStyleXApp')
.directive('fountLogin', [function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-login.html',
    scope: {},
    link: function(scope, element, attrs) {
    }
  };
}]);
