'use strict';

angular.module('sywStyleXApp')
.controller('MediaCtrl', ['$scope', 'UtilityService', 'UserMediaService', 'MediaTagService', '$state', '$stateParams', 'localStorageService', function($scope, UtilityService, UserMediaService, MediaTagService, $state, $stateParams, localStorageService) {
  UtilityService.gaTrackAppView('Media Detail Page View');

  var getCurrentMedia = function() {
    UserMediaService.getCurrentMedia($stateParams.mediaId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log('get current media details');
        $scope.discoverMedia = result.data.payload.MEDIA;
        $scope.discoverMedia.caption = UtilityService.emojiParse($scope.discoverMedia.caption);
        // getMediaTags($scope.discoverMedia.id);
        localStorageService.set('discoverMedia', $scope.discoverMedia);
      } else {
        console.log('cannot get current media');
      }
    }, function(error) {
      console.log(error);
    });
  }

  var getMediaTags = function(mediaId) {
    MediaTagService.getMediaTags(mediaId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log("test 002");
        $scope.mediaTagsArray = result.data.payload.VISUALTAGS;
      } else {
        console.log('error');
      }
    }, function(error) {
      console.log(error);
    });
  }

  $scope.backToHome = function() {

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
    } else if (prevState.source == 'media-detail') {
      UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Back to media-detail page from media detail');
      var media = { id: prevState.id };
      localStorageService.remove('discoverMedia');
      localStorageService.remove('mediaDetail');
      localStorageService.set('trackHistory', viewHistory);
      localStorageService.remove('taggedProducts');
      $state.go('media', {mediaId: media.id});
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

  };

  $scope.enableTagging = function() {
    $scope.enabledTag = true;
  };

  $scope.$on('$ionicView.enter', function() {
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
          id: (localStorageService.get('discoverMedia').source == 'media-detail') ? localStorageService.get('mediaDetail').xapp.id : null
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

  });

}]);
