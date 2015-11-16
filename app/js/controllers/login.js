'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginRegisterService' ,function($rootScope, $scope, LoginRegisterService) {
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

  console.log('inside the login page');

  $scope.loginAccount = function() {
    console.log($scope.loginObj);
    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);

      } else {
        console.log(result);
      }
    });
    console.log('login clicked');
  };

  $scope.registerAccount = function() {
    console.log($scope.registerObj);
    LoginRegisterService.register($scope.registerObj.email, $scope.registerObj.password, $scope.registerObj.displayName, $scope.registerObj.termsOfUse, $scope.registerObj.instagramUserId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);

      } else {
        if (result.data.error) {
          // $scope.errorMsg = result.data.error.message;
          $scope.registerObj.errorMsg = true;
        }
      }
    });
  };

}]);
