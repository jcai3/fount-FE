'use strict';

angular.module('sywStyleXApp')
.directive('fountFooter', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-footer.html',
    scope: {},
    link: function(scope, element, attrs) {
    }
  };
});
