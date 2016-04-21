'use strict';

angular.module('sywStyleXApp')
.directive('fountProductSlider', ['$rootScope', '$timeout', 'UtilityService', 'SortFilterService', function($rootScope, $timeout, UtilityService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-product-slider.html',
    scope: {
      productImages: '='
    },
    link: function(scope, element, attrs) {
      var initializeProductSlider = function() {
        var sliderSettings = {
          animation: "slide",
          controlNav: false,
          animationLoop: false,
          slideshow: false,
          sync: "#product-img-carousel"
        };

        var carouselSettings = {
          animation: "slide",
          controlNav: false,
          animationLoop: false,
          slideshow: false,
          itemWidth: 100,
          itemMargin: 5,
          asNavFor: '#product-img-slider'
        };

        $timeout(function(){
          element.find('#product-img-carousel').flexslider(carouselSettings);
          element.find('#product-img-slider').flexslider(sliderSettings);
        }, 500);
      };

      initializeProductSlider();
    }
  };
}]);
