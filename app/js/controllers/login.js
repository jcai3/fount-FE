'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', '$route', function($rootScope, $scope, $route) {
  // UtilityService.gaTrackAppView('Login Page View');

  $scope.loginObj = {
    email: '',
    password: ''
  };

  console.log('inside the login page');

  $scope.loginAccount = function() {
    // UtilityService.gaTrackAppEvent('Login Page', 'Click', 'Regular Login');
//    localStorageService.set('loginObj', $scope.loginObj);
    // LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
    //   if (UtilityService.validateResult(result)) {
    //
    //
    //   } else {
    //     console.log(result);
    //   }
    // });
    console.log('login clicked');
  };

}]);
