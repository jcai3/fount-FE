'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginRegisterService', 'localStorageService', 'UtilityService', '$state', function($rootScope, $scope, LoginRegisterService, localStorageService, UtilityService, $state) {
  UtilityService.gaTrackAppView('Login Page View');

  $scope.loginObj = {
    email: '',
    password: ''
  };

  $scope.loginAccount = function() {
    UtilityService.gaTrackAppEvent('Login Page', 'Click', 'Regular Login');
//    localStorageService.set('loginObj', $scope.loginObj);
    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        localStorageService.set('userId', result.data.payload.USER.id);
        localStorageService.set('isInstagramLinked', result.data.payload.USER.isInstagramLinked);
        localStorageService.set('isFacebookLinked', result.data.payload.USER.isFacebookLinked);
        localStorageService.set('facebookAccessToken', result.data.payload.USER.facebookAccessToken);
        $state.go('main.home');
      } else {
        console.log(result);
      }
    });
  };

  $scope.backToLanding = function() {
    UtilityService.gaTrackAppEvent('Login Page', 'Click', 'Back to anonymous page from login page');
    $state.go('landing');
  };

  $rootScope.$on('eventImportInstagramLoginConfirmed', function(event, data) {
    console.log('import instagramUserId after closing window: ' + data.instagramUserId);
    UtilityService.gaTrackAppEvent('Importing Page', 'Click', 'Link with Instagram for existing user');

    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        localStorageService.set('isInstagramLinked', result.data.payload.USER.isInstagramLinked);
        $state.go('main.importing');
      } else {
        console.log(result);
      }
    });
  });

  // $rootScope.$on('eventSettingsInstagramLoginConfirmed', function(event, data) {
  //   console.log('social settings instagramUserId after closing window: ' + data.instagramUserId);
  //   UtilityService.gaTrackAppEvent('Settings Social Page', 'Click', 'Link with Instagram for existing user from settings social page');
  //   var localLoginObj = localStorageService.get('loginObj');
  //   console.log(localLoginObj);
  //   LoginRegisterService.login(localLoginObj.email, localLoginObj.password).then(function(result) {
  //     if (UtilityService.validateResult(result)) {
  //       localStorageService.set('isInstagramLinked', result.data.payload.USER.isInstagramLinked);
  //       $state.go('settingsSocial', {mode: 0});
  //     } else {
  //       console.log(result);
  //     }
  //   });
  // });

  // $rootScope.$on('eventSettingsFacebookLoginConfirmed', function(event, data) {
  //   console.log('social settings facebookUserId after closing window: ' + data.facebookUserId);
  //   UtilityService.gaTrackAppEvent('Settings Social Page', 'Click', 'Link with Facebbok for existing user from settings social page');
  //   var localLoginObj = localStorageService.get('loginObj');
  //   console.log(localLoginObj);
  //
  //   LoginRegisterService.login(localLoginObj.email, localLoginObj.password).then(function(result) {
  //     if (UtilityService.validateResult(result)) {
  //       localStorageService.set('isFacebookLinked', result.data.payload.USER.isFacebookLinked);
  //       localStorageService.set('facebookAccessToken', result.data.payload.USER.facebookAccessToken);
  //       $state.go('settingsSocial', {mode: 0});
  //     } else {
  //       console.log(result);
  //     }
  //   });
  // });

}]);
