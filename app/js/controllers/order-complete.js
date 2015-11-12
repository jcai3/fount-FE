'use strict';

angular.module('sywStyleXApp')
.controller('OrderCompleteCtrl', ['$scope', '$state', 'localStorageService', 'UtilityService', function($scope, $state, localStorageService, UtilityService) {
  UtilityService.gaTrackAppView('Order Confirmation Page View');

  $scope.backToHome = function() {
    $state.go('main.home');
  };

}]);
