'use strict';

angular.module('sywStyleXApp')
.directive('bannerCarousel', ['UtilityService', function(UtilityService){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'banner-carousel.html',
    scope: {},
    link: function(scope, element, attrs) {
      scope.bannerImages = [
        'img/banner-top_1.jpg',
        'img/banner-top_2.jpg'
      ];

      scope.imageHeight = UtilityService.getImageHeight(0);

    }
  };
}]);
