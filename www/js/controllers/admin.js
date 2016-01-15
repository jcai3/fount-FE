'use strict';

angular.module('sywStyleXApp')
.controller('AdminCtrl', ['$scope', '$state', 'UtilityService', 'AdminService', function($scope, $state, UtilityService, AdminService) {
  var getAdminSellers = function() {
    AdminService.getAdminSellers().then(function(res) {
      if (UtilityService.validateResult(res)) {
        $scope.adminSellers = res.data.payload.SELLERS;
      }
    });
  };

  $scope.updateAdminSeller = function() {
    AdminService.updateAdminSellers($scope.adminSellers).then(function(res) {
      if (UtilityService.validateResult(res)) {
        $state.go($state.current, {}, {reload: true});
      }
    });
  };

  getAdminSellers();
}]);
