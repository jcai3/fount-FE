'use strict';

angular.module('sywStyleXApp')
.controller('ImportingCtrl', ['$scope', '$state', '$ionicPopup', 'localStorageService', 'UserInstagramService', 'UserMediaService', 'UtilityService', 'InstagramService', function($scope, $state, $ionicPopup, localStorageService, UserInstagramService, UserMediaService, UtilityService, InstagramService) {
  UtilityService.gaTrackAppView('Importing Page View');

  var user = {
    id: localStorageService.get('userId')
  };
  var postsNextMaxId = '';
  var postsApiLocker = false;
  var postsHasMoreData = true;
  var feedsNextMaxId = '';
  var feedsApiLocker = false;
  var feedsHasMoreData = true;
  var importingLocker = false;
  var importedPhotosIds = [];

  $scope.userPosts = [];
  $scope.userFeeds = [];
  $scope.userImportingArray = [];
  $scope.imageHeight = UtilityService.getImageHeight(3);

  var getUserPosts = function() {
    if (postsApiLocker || !postsHasMoreData) {
      return;
    }

    postsApiLocker = true;

    UserInstagramService.getUserInstagramMedia(user.id, postsNextMaxId).success(function (result) {
      importedPhotosIds = result.payload.IMPORTED_PHOTOS_IDS;

      var userPosts = result.payload.MEDIA.members.data;
      $scope.userPosts.push.apply($scope.userPosts, userPosts);
      if (result.payload.MEDIA.members.pagination && result.payload.MEDIA.members.pagination.next_max_id) {
        postsNextMaxId = result.payload.MEDIA.members.pagination.next_max_id;
      } else {
        postsHasMoreData = false;
      }
      postsApiLocker = false;
    });
  };

  var getUserFeeds = function() {
    if (feedsApiLocker || !feedsHasMoreData) {
      return;
    }

    feedsApiLocker = true;

    UserInstagramService.getUserInstagramFeed(user.id, feedsNextMaxId).success(function (result) {
      importedPhotosIds = result.payload.IMPORTED_PHOTOS_IDS;

      var userFeeds = result.payload.FEED.members.data;
      $scope.userFeeds.push.apply($scope.userFeeds, userFeeds);
      if (result.payload.FEED.members.pagination && result.payload.FEED.members.pagination.next_max_id) {
        feedsNextMaxId = result.payload.FEED.members.pagination.next_max_id;
      } else {
        feedsHasMoreData = false;
      }
      feedsApiLocker = false;
    });
  };

  // $ionicModal.fromTemplateUrl('import-modal.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  //
  // $scope.importModal = function(userImport) {
  //   if ($scope.importMode === 0) {
  //     $scope.importModalTitle = 'MY PHOTO';
  //   } else {
  //     $scope.importModalTitle = 'MY FEED';
  //   }
  //   $scope.userImport = userImport;
  //   $scope.modal.show();
  // };
  //
  // $scope.backToImporting = function() {
  //   $scope.modal.hide();
  // }

  $scope.showPopup = function(userImport) {
    $scope.userImport = userImport;
    if (importedPhotosIds.indexOf(userImport.id) > -1) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Popup', 'Already imported media from importing page - InstagramID: ' + userImport.id);
      var importPopupAlert = $ionicPopup.alert({
        cssClass: 'import-popup',
        templateUrl: 'import-popup.html',
        scope: $scope,
        buttons: [
          {
            text: 'It is already imported.',
            type: 'button-calm'
          }
        ]
      });

      importPopupAlert.then(function(res) {
        console.log('It is already imported.');
      });

    } else {
      UtilityService.gaTrackAppEvent('Importing Page', 'Popup', 'New media from importing page - InstagramID: ' + userImport.id);
      var importPopup = $ionicPopup.show({
        cssClass: 'import-popup',
        templateUrl: 'import-popup.html',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Add</b>',
            type: 'button-calm',
            onTap: function(e) {
              userImport.importAdded = true;
              $scope.userImportingArray.push(userImport);
            }
          }
        ]
      });

      importPopup.then(function(res) {
        console.log($scope.userImportingArray);
      });
    }
  };

  $scope.removeImported = function(userImport) {
    UtilityService.gaTrackAppEvent('Importing Page', 'Click', 'Removing medias from importing page');
    $scope.userImport = userImport;
    $scope.userImport.importAdded = false;
    var removedImport = $scope.userImportingArray.indexOf(userImport);
    $scope.userImportingArray.splice(removedImport, 1);
    console.log($scope.userImportingArray);
  };

  $scope.backToHome = function() {
    UtilityService.gaTrackAppEvent('Importing Page', 'Click', 'Back to discover page from importing page');
    // $state.go('main.home');
    $scope.importing();
  };

  $scope.importing = function() {
    if (importingLocker) {
      return;
    }
    UtilityService.gaTrackAppEvent('Importing Page', 'Click', 'Importing medias from importing page');
    importingLocker = true;

    var medias = UserMediaService.formatMediaObj($scope.userImportingArray);

    // getCurrentUserMedia to avoid duplicate medias

    UserMediaService.importUserMedia(user, medias).then(function(result) {
      importingLocker = false;
      // if (UtilityService.validateResult(result)) {
        $state.go('main.home');
      // } else {
      //   console.log('error');
      // }
    }, function(error) {
      console.log('error');
      $state.go('main.home');
    });
  };

  $scope.switchMode = function(mode) {
    if (mode === 0) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Switch', 'Switch to user posts on importing page');
      postsNextMaxId = '';
      postsApiLocker = false;
      postsHasMoreData = true;
      $scope.userPosts = [];
      $scope.$broadcast('scroll.resize');
      $scope.importMode = 0;
      $scope.userImportingArray = [];
      getUserPosts();
    }
    if (mode === 1) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Switch', 'Switch to user feeds on importing page');
      feedsNextMaxId = '';
      feedsApiLocker = false;
      feedsHasMoreData = true;
      $scope.userFeeds = [];
      $scope.$broadcast('scroll.resize');
      $scope.importMode = 1;
      $scope.userImportingArray = [];
      getUserFeeds();
    }
  };

  $scope.doRefresh = function() {
    if ($scope.importMode === 0) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Pull to refresh', 'Pull to refresh user posts on importing page');
      postsNextMaxId = '';
      postsApiLocker = false;
      postsHasMoreData = true;
      $scope.userPosts = [];
      $scope.userImportingArray = [];
      getUserPosts();
    }
    if ($scope.importMode === 1) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Pull to refresh', 'Pull to refresh user feeds on importing page');
      feedsNextMaxId = '';
      feedsApiLocker = false;
      feedsHasMoreData = true;
      $scope.userFeeds = [];
      $scope.userImportingArray = [];
      getUserFeeds();
    }

    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.hasMoreData = function() {
    if ($scope.importMode === 0) {
      return postsHasMoreData;
    } else if ($scope.importMode === 1) {
      return feedsHasMoreData;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData()) {
      return;
    }

    if ($scope.importMode === 0) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Scroll down', 'Scroll down to load more user posts on importing page');
      getUserPosts();
    }
    if ($scope.importMode === 1) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Scroll down', 'Scroll down to load more user feeds on importing page');
      getUserFeeds();
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');

  };

  $scope.connectInstagram = function() {
    var redirectTo = 'import';
    var loginUserId = localStorageService.get('userId');
    InstagramService.login(localStorageService.get('userId'), redirectTo);
  }

  $scope.$on('$ionicView.enter', function() {
    if (!!localStorageService.get('isInstagramLinked')) {
      $scope.InstagramLinked = true;
      $scope.switchMode(0);
    } else {
      $scope.importMode = 0;
      postsHasMoreData = false;
      $scope.InstagramLinked = false;

      // var redirectTo = 'import';
      // InstagramService.login(localStorageService.get('userId'), redirectTo);
    }
  });

}]);
