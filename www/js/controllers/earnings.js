'use strict';

angular.module('sywStyleXApp')
.controller('EarningsCtrl', ['$scope', '$state', 'UtilityService', 'OrderCommissionService', 'localStorageService', function($scope, $state, UtilityService, OrderCommissionService, localStorageService) {
  UtilityService.gaTrackAppView('Earnings Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var commissionPageNumber = 1;
  var commissionApiLocker = false;
  var userId = localStorageService.get('userId');
  $scope.loadingSpinnerEnabled = false;
  $scope.hasMoreData = false;
  $scope.commissionHistory = [];

  var getCommissionHistory = function() {
    $scope.loadingSpinnerEnabled = true;
    if (commissionApiLocker) {
      return;
    }

    commissionApiLocker = true;

    OrderCommissionService.getCommissionHistory(userId, commissionPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.COMMISSION_HISTORY.length === 0) {
          $scope.hasMoreData = false
        } else {
          commissionPageNumber++;
          $scope.hasMoreData = true;
          var commissionHistory = result.data.payload.COMMISSION_HISTORY;
          $scope.commissionHistory.push.apply($scope.commissionHistory, commissionHistory);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }
      $scope.loadingSpinnerEnabled = false;
      commissionApiLocker = false;
    }, function(error) {
      console.log('error');
      $scope.loadingSpinnerEnabled = false;
    });
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }

    UtilityService.gaTrackAppEvent('Earnings Page', 'Scroll down', 'Load more results on earnings page');
    getCommissionHistory();

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.backToPrev = function() {
    if (!!localStorageService.get('earningsTrackHistory') && localStorageService.get('earningsTrackHistory') == 'settings') {
      UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Go to profile page from earnings page');
      localStorageService.remove('earningsTrackHistory');
      $state.go('main.settings');
    } else {
      UtilityService.gaTrackAppEvent('Earnings Page', 'Click', 'Go to settings social page from earnings page');
      $state.go('settingsSocial', {mode: 0});
    }
  };

  getCommissionHistory();

  // $scope.$on('$ionicView.enter', function() {
  //   getOutstandingCommission();
  //   getAvailablePoints();
  //   $scope.userActiveProfile(1);
  // });
}]);
