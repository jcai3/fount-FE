'use strict';

angular.module('sywStyleXApp')
.directive('fountDiscoverShowcase', ['$state', '$timeout', function($state, $timeout) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-discover-showcase.html',
    scope: {
      showcaseProducts: '='
    },
    link: function(scope, element, attrs) {
      scope.showcaseCounter = 3;
      var initializeShowcaseCarousel = function() {

        var startPosition = 0;

        var settings = {
          circular: false,
          infinite: false,
          responsive: true,
          width: '100%',
          align: 'center',
          auto: false,
          items: {
            visible: 3,
            minimum: 3,
            start: startPosition
          },
          scroll: {
            items: 3,
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
        }, 10);
      };

      scope.productDetail = function(id) {
        $state.go('product', {productId: id});
      };

      scope.plusCounter = function(length) {
        if (length < 3) {
          return;
        }
        if (length >= 6) {
          if (scope.showcaseCounter < 6) {
            scope.showcaseCounter = 6;
          } else {
            scope.showcaseCounter = length;
          }
        } else {
          scope.showcaseCounter = length;
        }
      };

      scope.minusCounter = function(length) {
        if (length < 3) {
          return;
        }
        if (scope.showcaseCounter > 6) {
          scope.showcaseCounter = 6;
        } else if (scope.showcaseCounter > 3 && scope.showcaseCounter <= 6) {
          scope.showcaseCounter = 3;
        } else {
          scope.showcaseCounter = 3;
        }
      };

      scope.shopAll = function() {
        // invoke shop all from this function
      };

      initializeShowcaseCarousel();
    }
  };
}]);
