'use strict';

angular.module('sywStyleXApp')
.directive('fountDiscoverShowcase', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-discover-showcase.html',
    scope: {
      showcaseProducts: '='
    },
    link: function(scope, element, attrs) {
      var initializeSellerCarousel = function() {

        var startPosition = 0;

        var settings = {
          circular: false,
          infinite: false,
          responsive: true,
          width: null,
          align: 'center',
          auto: false,
          items: {
            visible: 3,
            minimum: 3,
            start: startPosition
          },
          scroll: {
            items: 1,
            duration: 50,
            pauseOnHover: true
          },
          prev: {
            button: element.find('#showcase-carousel-prev'),
            key: "left"
          },
          next: {
            button: element.find('#showcase-carousel-next'),
            key: "right"
          }
        };

        $timeout(function(){
          element.find('#discover-showcase-carousel').carouFredSel(settings);
        }, 100);
      };

      initializeSellerCarousel();
    }
  };
}]);
