'use strict';

angular.module('sywStyleXApp')
.directive('fountErrSrc', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.fountErrSrc) {
          attrs.$set('src', attrs.fountErrSrc);
        }
      });
    }
  };
});
