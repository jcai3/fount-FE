'use strict';

angular.module('sywStyleXApp')
.controller('AdminSellerCtrl', ['$scope', '$state', 'localStorageService', 'UtilityService', 'AdminService', function($scope, $state, localStorageService, UtilityService, AdminService) {
  var getAdminSellers = function() {
    AdminService.getAdminSellers().then(function(res) {
      if (UtilityService.validateResult(res)) {
        $scope.adminSellers = res.data.payload.SELLERS;
      }
    });
  };

  getAdminSellers();
}]);
