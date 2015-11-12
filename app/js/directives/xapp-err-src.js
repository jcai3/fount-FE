'use strict';

angular.module('sywStyleXApp')
.directive('xappErrSrc', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.xappErrSrc) {
          attrs.$set('src', attrs.xappErrSrc);
        }
      });
    }
  };
});
