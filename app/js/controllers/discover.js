'use strict';

angular.module('sywStyleXApp')
.controller('DiscoverCtrl', ['$scope', '$timeout', 'UtilityService', 'UserMediaService', function($scope, $timeout, UtilityService, UserMediaService) {
  var apiLocker = false;
  var pageNumber = 0;
  $scope.showcaseCounter = 3;
  $scope.hasMoreData = true;
  $scope.discoverMedias = [];

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
        button: $('#showcase-carousel-prev'),
        key: "left"
      },
      next: {
        button: $('#showcase-carousel-next'),
        key: "right"
      }
    };

    $timeout(function(){
      var $discoverShowcaseCarousel = $('#discover-showcase-carousel');
      $discoverShowcaseCarousel.html(angular.element.find('#discover-showcase-carousel .fount-tagged-product'));
      $discoverShowcaseCarousel.carouFredSel(settings);
    }, 50);
  };

  var getDiscoverPosts = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;

    UserMediaService.getLatestMedia(pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {

        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
        } else {
          pageNumber++;
          $scope.hasMoreData = true;
          var discoverMedias = result.data.payload.MEDIAS;
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }

      apiLocker = false;
    });
  };

  $scope.plusCounter = function(length) {
    if (length < 3) {
      return;
    }
    if (length >= 6) {
      if ($scope.showcaseCounter < 6) {
        $scope.showcaseCounter = 6;
      } else {
        $scope.showcaseCounter = length;
      }
    } else {
      $scope.showcaseCounter = length;
    }
  };

  $scope.minusCounter = function(length) {
    if (length < 3) {
      return;
    }
    if ($scope.showcaseCounter > 6) {
      $scope.showcaseCounter = 6;
    } else if ($scope.showcaseCounter > 3 && $scope.showcaseCounter <= 6) {
      $scope.showcaseCounter = 3;
    } else {
      $scope.showcaseCounter = 3;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }
    getDiscoverPosts();
  };

  $scope.invokeDiscoverShowcase = function(discoverMedia, index) {
    if (!!discoverMedia.products) {
      $scope.showcaseProducts = discoverMedia.products;
      var cur = $('#fount-discover-showcase');
      var ap = $('#fount-showcase-post_7');
      ap.after(cur);

      initializeSellerCarousel();
    }
  };

  getDiscoverPosts();


}]);
