'use strict';

angular.module('sywStyleXApp')
.directive('fountHomeSlider', ['$rootScope', '$timeout', 'UtilityService', function($rootScope, $timeout, UtilityService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-home-slider.html',
    scope: {},
    link: function(scope, element, attrs) {
      var initializeProductSlider = function() {
        $timeout(function(){
          element.find('.flexslider').flexslider({
            animation: 'slide'
          });
        }, 0);
      };

      initializeProductSlider();
    }
  };
}]);
