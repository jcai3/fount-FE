'use strict';

angular.module('sywStyleXApp')
.directive('fountSellerCarousel', ['$rootScope', '$timeout', 'UtilityService', 'ProductSearchService', 'SortFilterService', function($rootScope, $timeout, UtilityService, ProductSearchService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-seller-carousel.html',
    scope: {
      sellers: '=',
      topSellerId: '='
    },
    link: function(scope, element, attrs) {
      var initializeSellerCarousel = function() {

        var startPosition = 0;

        var settings = {
          circular: true,
          infinite: true,
          responsive: true,
          width: null,
          align: 'center',
          auto: false,
          items: {
            visible: 6,
            minimum: 5,
            start: startPosition
          },
          scroll: {
            items: 1,
            duration: 50,
            pauseOnHover: true
          },
          prev: {
            button: element.find('#seller-carousel-prev'),
            key: "left"
          },
          next: {
            button: element.find('#seller-carousel-next'),
            key: "right"
          }
        };

        $timeout(function(){
          element.find('#seller-carousel').carouFredSel(settings);
        }, 100);
      };

      scope.setTopSellerId = function(id) {
        if (scope.topSellerId == id) {
          return;
        }

        scope.topSellerId = id;
        $rootScope.$emit('event.setTopSeller', {id: id});
      };

      initializeSellerCarousel();

      $rootScope.$on('event.setTopFilter', function(event, data) {
        initializeSellerCarousel();
      });
    }
  };
}]);
