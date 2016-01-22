'use strict';

angular.module('sywStyleXApp')
.controller('OrderCompleteCtrl', ['$scope', '$state', 'localStorageService', 'UtilityService', function($scope, $state, localStorageService, UtilityService) {

  $scope.goToShop = function() {
    $state.go('discover');
  };

}]);
