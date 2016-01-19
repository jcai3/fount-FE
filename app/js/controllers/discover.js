'use strict';

angular.module('sywStyleXApp')
.controller('DiscoverCtrl', ['$scope', 'UtilityService', 'UserMediaService', function($scope, UtilityService, UserMediaService) {
  var apiLocker = false;
  var pageNumber = 0;
  $scope.hasMoreData = true;
  $scope.discoverMedias = [];

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }
    getDiscoverPosts();
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
          // var discoverMedias = [];
          // for(var i = 0, j= result.data.payload.MEDIAS.length; i < j; i++) {
          //   var mediaObj = {};
          //   mediaObj = result.data.payload.MEDIAS[i];
          //   if(!!result.data.payload.MEDIAS[i].products) {
          //     mediaObj.itemHeight = $scope.imageHeight + 270;
          //   } else {
          //     mediaObj.itemHeight = $scope.imageHeight + 100;
          //   }
          //
          //   discoverMedias.push(mediaObj);
          // }

          console.log(discoverMedias);
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }

      apiLocker = false;
    });
  };

  getDiscoverPosts();

}]);
