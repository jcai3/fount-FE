'use strict';

angular.module('sywStyleXApp')
.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      element.bind('blur change', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(element.html());
        });
      });
      ngModel.$render = function() {
        element.html(ngModel.$viewValue);
      };
    }
  }
});
