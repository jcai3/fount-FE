'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginRegisterService', 'UtilityService','$state', '$window', 'ENV', 'localStorageService',function($rootScope, $scope, LoginRegisterService, UtilityService, $state, $window, ENV, localStorageService) {

  $scope.loginObj = {
    email: '',
    password: ''
  };

  $scope.registerObj = {
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    termsOfUse: true,
    instagramUserId: '',
    errorMsg: false
  };

  $scope.authErrorMsg = false;
  $scope.errorMessage = '';

  var invokeFountLogin = function() {
    $rootScope.$emit('event.updateFountLogin', {isLoggedIn: true});
  };

  $scope.loginAccount = function() {
    $scope.authErrorMsg = false;
    console.log($scope.loginObj);
    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);
        localStorageService.set('userId', result.data.payload.USER.id);
        invokeFountLogin();

      } else {
        console.log(result);
        $scope.authErrorMsg = true;
        if(!!result.data.error) {
          $scope.errorMessage = result.data.error.message;
        }

        if(!!result.data.errors) {
          $scope.errorMessage = 'Please enter your login credentials';
        }

      }
    });
    console.log('login clicked');
  };

  $scope.registerAccount = function() {
    console.log($scope.registerObj);
    $scope.authErrorMsg = false;
    LoginRegisterService.register($scope.registerObj.email, $scope.registerObj.password, $scope.registerObj.displayName, $scope.registerObj.termsOfUse, $scope.registerObj.instagramUserId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);

      } else {
        if (result.data.error || result.data.errors) {
          $scope.authErrorMsg = true;
          if(!!result.data.error) {
            $scope.errorMessage = result.data.error.message;
          }

          if(!!result.data.errors) {
            $scope.errorMessage = 'Please enter all the required fields';
          }
        }
      }
    });
  };

  $scope.instagramLogin = function(userType) {
    var loginWindow;

    loginWindow = $window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
      '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
      '&scope=likes+comments&response_type=code', '_self', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
    );
  }

}]);
