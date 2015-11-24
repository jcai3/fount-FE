'use strict';

angular.module('sywStyleXApp')
.directive('fountHeader', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-header.html',
    scope: {},
    link: function(scope, element, attrs) {
      
    }
  };
});
