'use strict';

angular.module('sywStyleXApp')
.controller('OrdersHistoryCtrl', ['$scope', '$state', 'UtilityService', 'OrderCommissionService', 'localStorageService', function($scope, $state, UtilityService, OrderCommissionService, localStorageService) {
  UtilityService.gaTrackAppView('Orders Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var orderPageNumber = 1;
  var orderApiLocker = false;
  var userId = localStorageService.get('userId');
  $scope.loadingSpinnerEnabled = false;
  $scope.hasMoreData = false;
  $scope.orderHistory = [];

  var getOrderHistory = function() {
    $scope.loadingSpinnerEnabled = true;
    if (orderApiLocker) {
      return;
    }

    orderApiLocker = true;

    OrderCommissionService.getOrderHistory(userId, orderPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.ORDERS.length === 0) {
          $scope.hasMoreData = false
        } else {
          orderPageNumber++;
          $scope.hasMoreData = true;
          var orders = result.data.payload.ORDERS;
          for (var i=0,j=orders.length; i<j; i++) {
            var items = orders[i].itemsJson;
            for (var l=0,m=items.length; l<m; l++) {
              var item = {
                date: orders[i].date,
                seller: items[l].shoppingCartProductJson.product.sellerName,
                productName: items[l].shoppingCartProductJson.product.name,
                totalPrice: items[l].totalPrice,
                points: items[l].awardPoints.points
              };
              $scope.orderHistory.push(item);
            }
          }
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }
      $scope.loadingSpinnerEnabled = false;
      orderApiLocker = false;
    }, function(error) {
      console.log('error');
      $scope.loadingSpinnerEnabled = false;
    });
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }

    UtilityService.gaTrackAppEvent('Orders Page', 'Scroll down', 'Load more results on orders page');
    getOrderHistory();

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.backToPrev = function() {
    UtilityService.gaTrackAppEvent('Orders Page', 'Click', 'Go to settings social page from orders page');
    $state.go('settingsSocial', {mode: 0});
  };

  getOrderHistory();

}]);
