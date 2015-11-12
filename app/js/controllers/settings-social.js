'use strict';

angular.module('sywStyleXApp')
.controller('SettingsSocialCtrl', ['$scope', '$location', '$cookies', 'UtilityService', '$state', '$stateParams','localStorageService', 'InstagramService', 'SocialService', 'LoginRegisterService', 'SocialAccountLinkedService',function($scope, $location, $cookies, UtilityService, $state, $stateParams,localStorageService, InstagramService, SocialService, LoginRegisterService, SocialAccountLinkedService) {
  UtilityService.gaTrackAppView('Settings Social Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var getUserSocialAccounts = function() {
    var userId = localStorageService.get('userId');
    SocialAccountLinkedService.getUserSocialAccounts(userId).then(function(res){
      console.log(res);
      $scope.instagramConnected = !!(res.data.payload.USER.isInstagramLinked) ? res.data.payload.USER.isInstagramLinked : false;
      $scope.facebookConnected = !!(res.data.payload.USER.isFacebookLinked) ? res.data.payload.USER.isFacebookLinked : false;
      localStorageService.set('facebookAccessToken', res.data.payload.USER.facebookAccessToken);
      localStorageService.set('isInstagramLinked', $scope.instagramConnected);
      localStorageService.set('isFacebookLinked', $scope.facebookConnected);
    });

  };

  // $scope.instagramConnected = (localStorageService.get('isInstagramLinked') == 'true') ? true : false;
  // $scope.facebookConnected = (localStorageService.get('isFacebookLinked') == 'true') ? true : false;
  // $scope.pinterestConnected = (localStorageService.get('isPinterestLinked') == 'true') ? true : false;

  $scope.goToViewMode = function(index) {
    if(index == 0) {
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Switch', 'Switch to social settings  view on settings social page');
      $scope.settingsSocialList = true;
      $scope.showLinkedAccountsList = false;
      $scope.viewMode = 0;
      localStorageService.set('socialSettingsViewMode', $scope.viewMode);
    }else if(index == 1){
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Switch', 'Switch to Linked Accounts view on settings social page');
      $scope.showLinkedAccountsList = true;
      $scope.settingsSocialList = false;
      $scope.viewMode = 1;
      localStorageService.set('socialSettingsViewMode', $scope.viewMode);
    }

  };

  $scope.connectToInstagram = function() {
    if(!!$scope.instagramConnected) {
      return;
    } else {
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Connect Instagram', 'Connect to Instagram on settings  social page');
      var redirectTo = 'settingsSocial';
//      var loginUserId = localStorageService.get('userId');
      InstagramService.login(localStorageService.get('userId'), redirectTo);
    }
  };

  $scope.connectToFacebook = function() {
    console.log('connect to facebook');

    if(!!$scope.facebookConnected) {
      return;
    } else {
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Connect facebook', 'Connect to facebook on settings social page');
      var redirectTo = 'settingsSocial';
      var loginUserId = localStorageService.get('userId');
      SocialService.login(localStorageService.get('userId'), redirectTo);

      // if (ionic.Platform.isWebView()) {
      //   SocialService.facebookLogin();
      // } else {
      //   var redirectTo = 'settingsSocial';
      //   var loginUserId = localStorageService.get('userId');
      //   SocialService.login(localStorageService.get('userId'), redirectTo);
      // }
    }
  };

  $scope.backToPrev = function() {
    if($scope.viewMode == 1) {
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Click', 'Back to Social settings view on settings social page');
      $scope.goToViewMode(0);
    } else {
      UtilityService.gaTrackAppEvent('Settings Social Page', 'Click', 'Back to main settings from settings social page');
      $state.go('main.settings');
    }
  };

  $scope.logout = function() {
    var userId = localStorageService.get('userId');
    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Logout on profile page');
    var user = {
      id: userId
    };

    LoginRegisterService.logout(user).then(function(res) {
      console.log('logout');
    });

    InstagramService.logout();
    if(!!localStorageService.get('facebookAccessToken')) {
      SocialService.logout();
    }
    // localStorageService.remove('shoppingCart');
    // localStorageService.remove('shoppingCartInfo');
    localStorageService.clearAll();
    if (!!$cookies.PLAY_SESSION && $cookies.PLAY_SESSION.indexOf('SPREE_') != -1) {
      $cookies.PLAY_SESSION = null;
    }

    $state.go('landing');
  };

  $scope.goToOrderHistory = function() {
    console.log('orders page');
    $state.go('orders');
  };

  $scope.goToCommissionPage = function() {
    console.log('commision page');
    $state.go('earnings');
  };

  $scope.$on('$ionicView.enter', function() {
    getUserSocialAccounts();
    if(!!localStorageService.get('socialSettingsViewMode')) {
      if(localStorageService.get('socialSettingsViewMode') == $stateParams.mode) {
        $scope.goToViewMode($stateParams.mode);
      } else {
        $scope.goToViewMode(localStorageService.get('socialSettingsViewMode'));
      }
    } else {
      $scope.goToViewMode($stateParams.mode);
    }

  });
}]);
