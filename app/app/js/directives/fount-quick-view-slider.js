/**
 * 
 */
angular.module('sywStyleXApp')
.directive('fountQuickViewSlider', ['$rootScope', '$timeout', 'UtilityService', 'SortFilterService', function($rootScope, $timeout, UtilityService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-quick-view-slider.html',
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
        		preText:"",
        		nextText:"",
        		sync: "#quick-view-img-carousel"
        };

        var carouselSettings = {
        		 animation: "slide",
        		 direction:"vertical",
                 controlNav: false,
                 animationLoop: false,
                 slideshow: false,
                 itemWidth: 100,
                 itemMargin: 5,
                 maxItems:3,
                 asNavFor: '#quick-view-img-slider',
                 preText:"",
                 nextText:"",
        };

        $timeout(function(){
          element.find('#quick-view-img-carousel').flexslider(carouselSettings);
          element.find('#quick-view-img-slider').flexslider(sliderSettings);
        }, 500);
      };
     
      
     
     
      initializeProductSlider();
      
    
    }
  };
}]);
