'use strict';

angular.module('sywStyleXApp')
.controller('RegisterCtrl', ['$scope', 'localStorageService', '$location', 'LoginRegisterService', 'UtilityService', '$state', function($scope, localStorageService, $location, LoginRegisterService, UtilityService, $state) {
  UtilityService.gaTrackAppView('Register Page View');

  $scope.registerObj = {
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    termsOfUse: true,
    instagramUserId: '',
    errorMsg: false
  };

  $scope.iphone4Height = (screen.height < 500) ? true : false;

  $scope.registerAccount = function() {
    UtilityService.gaTrackAppEvent('Register Page', 'Click', 'Register an account');

    LoginRegisterService.register($scope.registerObj.email, $scope.registerObj.password, $scope.registerObj.displayName, $scope.registerObj.termsOfUse, $scope.registerObj.instagramUserId).then(function(result) {

      if (UtilityService.validateResult(result)) {
        localStorageService.set('userId', result.data.payload.USER.id);
        // localStorageService.set('displayName', result.data.payload.USER.displayName);
        localStorageService.set('instagramAccessToken', result.data.payload.USER.instagramAccessToken);
        console.log('in register page instagramAccessToken: ' + result.data.payload.USER.instagramAccessToken);

        if (!!result.data.payload.USER.instagramAccessToken) {
          $state.go('main.importing');
        } else {
          $state.go('main.home');
        }

      } else {
        if (result.data.error) {
          // $scope.errorMsg = result.data.error.message;
          $scope.registerObj.errorMsg = true;
        }
      }
    });
  };

  $scope.backToLanding = function() {
    UtilityService.gaTrackAppEvent('Register Page', 'Click', 'Back to anonymous page from register page');
    $state.go('landing');
  };

  $scope.$on('$ionicView.enter', function() {
    var instagramObj = $location.search();
    if (instagramObj.INSTAGRAM_USER_ID) {
      localStorageService.set('instagramUserId', instagramObj.INSTAGRAM_USER_ID);
    }

    $scope.registerObj.instagramUserId = localStorageService.get('instagramUserId');
  });
}]);
