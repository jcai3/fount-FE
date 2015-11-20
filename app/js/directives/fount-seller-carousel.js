'use strict';

angular.module('sywStyleXApp')
.directive('fountSellerCarousel', ['$timeout', 'UtilityService', 'ProductSearchService', 'SortFilterService', function($timeout, UtilityService, ProductSearchService, SortFilterService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-seller-carousel.html',
    scope: {
      sellers: '='
    },
    link: function(scope, element, attrs) {
      var initializeSellerCarousel = function() {

        var startPosition = 0;

        var settings = {
          circular: false,
          infinite: false,
          responsive: true,
          width: '100%',
          align: 'center',
          auto: false,
          items: {
            visible: 6,
            minimum: 5,
            start: startPosition
          },
          scroll: {
            items: 1,
            duration: 1000,
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
          // var $sellerCarousel = $('#seller-carousel');
          // $sellerCarousel.html(angular.element.find('#seller-carousel .seller-element'));
          // $sellerCarousel.carouFredSel(settings);
          element.find('#seller-carousel').css('height', '35px').carouFredSel(settings);
        }, 100);
      };

      scope.setTopSellerId = function(id) {
        console.log(id);
      };

      initializeSellerCarousel();
    }
  };
}]);
