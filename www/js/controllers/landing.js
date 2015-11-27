'use strict';

angular.module('sywStyleXApp')
.controller('LandingCtrl', ['$rootScope', '$scope', '$state', 'localStorageService', 'InstagramService', 'LocationService', 'UserMediaService', 'UtilityService', '$location', function($rootScope, $scope, $state, localStorageService, InstagramService, LocationService, UserMediaService, UtilityService, $location) {
  UtilityService.gaTrackAppView('Anonymous Page View');

  var userObj = $location.search();
  if (userObj.USER_ID) {
    localStorageService.set('userId', userObj.USER_ID);
  }

  var apiLocker = false;
  var latitude = '';
  var longitude = '';
  $scope.discoverMedias = [];
  $scope.imageHeight = UtilityService.getImageHeight(2) + 63;

  var getCurrentPosition = function() {
    var options = {
      timeout: 10000,
      maximumAge: 30000,
      enableHighAccuracy: false
    };

    LocationService.getCurrentPosition(options).then(
      function(position) {
        console.log(position.coords);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        var locationData = {
          latitude: latitude,
          longitude: longitude
        };
        localStorageService.set('locationData', locationData);
      },
      function() {
        console.log('location error');
      }
    );
  };

  var getAllPopularMedia = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;

    // UserMediaService.getAllPopularMedia(0).then(function(result) {
    UserMediaService.getLatestMedia(0).then(function(result) {

      if (UtilityService.validateResult(result)) {

        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
        } else {
          $scope.hasMoreData = true;
          var discoverMedias = result.data.payload.MEDIAS;
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('landing api error');
      }

      apiLocker = false;
    });
  };

  $scope.login = function() {
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Login page from anonymous page');
    $state.go('login');
  };

  $scope.register = function() {
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Register page from anonymous page');
    $state.go('register');
  };

  $scope.loginByInstagram = function() {
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Sign in with Instagram');
    InstagramService.login();
  };

  $scope.doRefresh = function() {
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Pull to refresh', 'Pull to refresh feeds on anonymous page');
    apiLocker = false;
    $scope.discoverMedias = [];

    getAllPopularMedia();

    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.resize');
  };

  $rootScope.$on('eventInstagramLoginConfirmed', function(event, data) {
    console.log('instagramUserId after closing window: ' + data.instagramUserId);
    if (!!localStorageService.get('isInstagramLinked')) {
      UtilityService.gaTrackAppEvent('Importing Page', 'Click', 'Link with Instagram for existing user');
      $state.go('main.importing');
    } else {
      UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Sign in with Instagram for new user');
      $state.go('register');
    }
  });

  $rootScope.$on('eventRegularLoginConfirmed', function(event, data) {
    console.log('userId after closing window: ' + data.userId);
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Sign in with Instagram for existing user');
    $state.go('main.home');
  });

  $rootScope.$on('eventSettingsLinkAccountsConfirmed', function(event, data) {
    console.log('user Id after closing window: ');
    UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Sign in with social accounts for existing user');
    localStorageService.set('userId', data.userId);
    localStorageService.set('socialSettingsViewMode', 1);
    $state.go('settingsSocial', {mode: 0});
  });

  // $rootScope.$on('eventSettingsInstagramLoginConfirmed', function(event, data) {
  //   console.log('Instagram user Id after closing window: ');
  //   UtilityService.gaTrackAppEvent('Anonymous Page', 'Click', 'Sign in with instagram for existing user');
  //   $state.go('settingsSocial', {mode: 0});
  // });

  getCurrentPosition();
  getAllPopularMedia();

  $scope.$on('$ionicView.enter', function() {
    UtilityService.getLatestApp();
  });

}]);
