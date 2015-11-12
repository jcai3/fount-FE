'use strict';

angular.module('sywStyleXApp')
.controller('RegisterConfirmCtrl', ['$scope', '$location', 'UtilityService', function($scope, $location, UtilityService) {
  UtilityService.gaTrackAppView('Register Confirmation Page View');

  $scope.$on('$ionicView.enter', function() {
    var userObj = $location.search();

    if (userObj.displayName) {
      $scope.displayName = userObj.displayName;
    }

  });
}]);
