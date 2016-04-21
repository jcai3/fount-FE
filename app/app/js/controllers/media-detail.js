'use strict';

angular.module('sywStyleXApp')
.controller('MediaDetailCtrl', ['$scope', '$sce', 'UtilityService', 'UserMediaService', 'MediaTagService', '$state', '$stateParams', 'localStorageService', function($scope, $sce, UtilityService, UserMediaService, MediaTagService, $state, $stateParams, localStorageService) {

	  var pageNumber = 0;
	  var indexMarker = -1;
	  $scope.activePost = -1;
	  $scope.showcaseCounter = 3;
	  $scope.hasMoreData = true;
	  $scope.discoverMedias = [];
	  var liked = 0;
	  $scope.productDetail = function(id) {
	        $state.go('product', {productId: id});
	      };
	  
	UserMediaService.getCurrentMedia($stateParams.mediaId).then(function(result){
		if(UtilityService.validateResult(result)) {
			console.log('get current media details');
			$scope.discoverMedia = result.data.payload.MEDIA;
			$scope.discoverUsers = result.data.payload.LIKED_USERS;
			$scope.discoverMedia.caption = UtilityService.emojiParse($scope.discoverMedia.caption); 
			console.log('video link is:'+$scope.sources);
			getMediaTags($scope.discoverMedia.id);
		}
		else{
			console.log('cannot get current media');
		}
	});
	
	 $scope.trustSrc = function(src) {
		    return $sce.trustAsResourceUrl(src);
	 }
	
	              

  var getMediaTags = function(mediaId) {
    MediaTagService.getMediaTags(mediaId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log("get visual tags");
        $scope.mediaTagsArray = result.data.payload.VISUALTAGS;
        $scope.tagProductsArray = result.data.payload.VISUALTAGS[0].products;
      } else {
        console.log('cannot get visual tags');
      }
    }, function(error) {
      console.log(error);
    });
  }
  
  $scope.likeMedia = function(discoverMedia) {
	  if(liked == 0){
		  UserMediaService.likeMedia(discoverMedia.id).then(function(result){
			  if(UtilityService.validateResult(result)) {						
							$scope.discoverMedia.likes = $scope.discoverMedia.likes + 1; 						
							liked = 1;
							 var image = document.getElementById('like-img');
							    if (image.src.match("like")) {
							        image.src = "img/liked.png";
							    } 
				  };
		  });
	  }
  };

}]);
