'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginRegisterService', 'UtilityService','$location', '$window','$interval','ENV', 'localStorageService',function($rootScope, $scope, LoginRegisterService, UtilityService, $location, $window, $interval, ENV, localStorageService) {
  // UtilityService.gaTrackAppView('Login Page View');

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

  console.log('inside the login page');

  $scope.loginAccount = function() {
    $scope.authErrorMsg = false;
    console.log($scope.loginObj);
    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);
        $location.path('/shop');

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
          // $scope.errorMsg = result.data.error.message;
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
    var host = $window.location.host;
    console.log('user Type:' + userType);
    console.log('inside the instagram login function');
    $rootScope.xappObj.overlay = true;
    var loginWindow;
     //the pop-up window size, change if you want
    var popupWidth = 400,
    popupHeight = 300,
    popupLeft = (window.screen.width - popupWidth) / 2,
    popupTop = (window.screen.height - popupHeight) / 2,
    interval = 1000;

    loginWindow = $window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
      '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
      '&scope=likes+comments&response_type=code', '', 'width='+popupWidth+',height='+popupHeight+',left='+popupLeft+',top='+popupTop+''
    );

    var i = $interval(function(){
      interval += 500;

      try {

        if((loginWindow.location.href).indexOf(host) !== -1) {
          var userId = (loginWindow.location.href).split('USER_ID=')[1];
          console.log(loginWindow.location.href);
          $rootScope.xappObj.overlay = false;
          $interval.cancel(i);
          loginWindow.close();
          if(userId) {
            console.log('userId: ' + userId);
            localStorageService.set('userId', userId);
            $location.path('/shop');
          }
        }
      } catch(e) {
        console.error(e);
      }
    }, interval);
  }

}]);
