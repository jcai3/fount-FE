'use strict';

angular.module('sywStyleXApp')
.controller('MainCtrl', ['$cookies', '$scope', '$state', 'UtilityService', 'InstagramService', function($cookies, $scope, $state, UtilityService, InstagramService) {

  $scope.mainHome = function() {
    UtilityService.gaTrackAppEvent('Tab View', 'Switch', 'Discover tab view');
    $state.go('main.home');
  };

  $scope.mainShop = function() {
    UtilityService.gaTrackAppEvent('Tab View', 'Switch', 'Shop tab view');
    $state.go('main.shop');
  };

  $scope.mainImporting = function() {
    UtilityService.gaTrackAppEvent('Tab View', 'Switch', 'Importing tab view');
    $state.go('main.importing');
    // if (!!localStorageService.get('isInstagramLinked')) {
    //   $state.go('main.importing');
    // } else {
    //   var redirectTo = 'import';
    //   InstagramService.login(localStorageService.get('userId'), redirectTo);
    // }
  };

  $scope.mainBrands = function() {
    UtilityService.gaTrackAppEvent('Tab View', 'Switch', 'Brands tab view');
    $state.go('main.brands', {source: 0});
  };

  $scope.mainSettings = function() {
    UtilityService.gaTrackAppEvent('Tab View', 'Switch', 'Profile tab view');
    $state.go('main.settings');
  };

  $scope.$on('$ionicView.enter', function() {

    console.log('in main test - PLAY_SESSION');

    console.log('UtilityService getCookie' + UtilityService.getCookie('PLAY_SESSION'));

    console.log('$cookies ' + $cookies.PLAY_SESSION);

    // cookie works under local but not qa
    if ($cookies.PLAY_SESSION != '') {
      return;
    } else {
      $state.go('landing');
    }
  });
}]);
