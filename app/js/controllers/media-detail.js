'use strict';

angular.module('sywStyleXApp')
.controller('MediaDetailCtrl', ['$scope', 'UtilityService', 'UserMediaService', 'MediaTagService', '$state', '$stateParams', 'localStorageService', function($scope, UtilityService, UserMediaService, MediaTagService, $state, $stateParams, localStorageService) {
  /*
	  var apiLocker = false;*/
	  var pageNumber = 0;
	  var indexMarker = -1;
	  $scope.activePost = -1;
	  $scope.showcaseCounter = 3;
	  $scope.hasMoreData = true;
	  $scope.discoverMedias = [];
/*
	  var getDiscoverPosts = function() {
	    if (apiLocker) {
	      return;
	    }

	    apiLocker = true;*/

	/*$stateParams.mediaId = 15;*/
	UserMediaService.getCurrentMedia($stateParams.mediaId).then(function(result){
		if(UtilityService.validateResult(result)) {
			console.log('get current media details');
			$scope.discoverMedia = result.data.payload.MEDIA;
			$scope.discoverUsers = result.data.payload.LIKED_USERS;
			$scope.discoverMedia.caption = UtilityService.emojiParse($scope.discoverMedia.caption);  
			getMediaTags($scope.discoverMedia.id);
		}
		else{
			console.log('cannot get current media');
		}
	});

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
 

 /* var indexMarker = -1;
  $scope.invokeLikedUser = function(discoverMedia, index) {

	    indexMarker = index;
	    $scope.activePost = -1;
	    //$('#discover-only-showcase').remove();
	    if (!!discoverUsers) {
	      $scope.showcaseProducts = discoverMedia.products;
	      var appendContent = angular.element('<div fount-discover-showcase showcase-products="showcaseProducts" id="">test</div>');
	      $compile(appendContent)($scope);
	      var appendIndex = 4 * Math.floor(index/4) + 3;
	      var beforeContent = $('#fount-liked_user_' + appendIndex);
	      beforeContent.after(appendContent);
	      $scope.activePost = index;
	    }
	  };
*/

 /* $scope.backToHome = function() {

    var viewHistory = localStorageService.get('trackHistory');
    if (viewHistory.length > 1) {
      var prevState = viewHistory.pop();
    } else {
      var prevState = viewHistory[0];
    }

    if(prevState.source == 'settings') {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to profile page from media detail');
      localStorageService.remove('discoverMedia');
      localStorageService.remove('trackHistory');
      localStorageService.remove('taggedProducts');
      $state.go('main.settings');
    } else if (prevState.source == 'product-detail') {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to product-detail page from media detail');
      var product = { id: prevState.id };
      localStorageService.remove('discoverMedia');
      localStorageService.remove('productDetail');
      localStorageService.set('trackHistory', viewHistory);
      localStorageService.remove('taggedProducts');
      $state.go('product', {productId: product.id});
    } else if(prevState.source == 'brand-profile') {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to brand profile page from media detail');
      localStorageService.remove('discoverMedia');
      localStorageService.remove('trackHistory');
      localStorageService.remove('taggedProducts');
      $state.go('profile', {Id:localStorageService.get('profileId'), type:'brand',source: 0});
    } else if(prevState.source == 'user-profile') {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to brand profile page from media detail');
      localStorageService.remove('discoverMedia');
      localStorageService.remove('trackHistory');
      localStorageService.remove('taggedProducts');
      $state.go('profile', {Id:localStorageService.get('profileId'), type:'user',source: 0});
    } else {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to home page from media detail');
      localStorageService.remove('trackHistory');
      $state.go('main.home');
    }

  };*/

/*  $scope.enableTagging = function() {
    $scope.enabledTag = true;
  };*/

  /*$scope.$on('$ionicView.enter', function() {
    $scope.tnpOverlayEnabled = false;

    if (!!localStorageService.get('shoppingCartInfo')) {
      $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
    } else {
      $scope.shoppingCartInfo = {
        count: 0,
        subtotal: 0
      };
    }

    if(!!localStorageService.get('discoverMedia') && !!localStorageService.get('discoverMedia').source) {
        if(!!localStorageService.get('trackHistory')) {
          var trackHistory = localStorageService.get('trackHistory');
        } else {
          var trackHistory = [];
        }

        var prevSource = {
          source: localStorageService.get('discoverMedia').source,
          id: (localStorageService.get('discoverMedia').source == 'product-detail') ? localStorageService.get('productDetail').xapp.id : null
        };

        if (trackHistory.length >= 1) {
          var lastSavedState = trackHistory[trackHistory.length - 1];
          if (lastSavedState.source !== prevSource.source && lastSavedState.id !== prevSource.id) {
            trackHistory.push(prevSource);
            localStorageService.set('trackHistory', trackHistory);
          }
        } else {
          trackHistory.push(prevSource);
          localStorageService.set('trackHistory', trackHistory);
        }
    }

    if (!!localStorageService.get('discoverMedia')) {
      $scope.discoverMedia = localStorageService.get('discoverMedia');
      $scope.discoverMedia.caption = UtilityService.emojiParse($scope.discoverMedia.caption);
      // getMediaTags($scope.discoverMedia.id);
    } else {
      getCurrentMedia();
    }

  });*/

}]);
