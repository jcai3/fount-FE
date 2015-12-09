'use strict';

angular.module('sywStyleXApp')
.directive('fountHeader', ['$rootScope', '$state', 'localStorageService', 'CartService', function($rootScope, $state, localStorageService, CartService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-header.html',
    scope: {},
    link: function(scope, element, attrs) {
      scope.isLoggedIn = false;

      scope.goToShop = function() {
        $state.go('shop');
      };

      if (!!localStorageService.get('shoppingCartInfo')) {
        scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
      } else {
        scope.shoppingCartInfo = {
          count: 0,
          subtotal: 0
        };
      }

      var getProductsFromCart = function() {
        CartService.getProductsFromCart(localStorageService.get('userId'), false).success(function(response) {
          scope.username = response.payload.SHOPPING_CART.user.displayName;
          scope.shoppingCartInfo.count = response.payload.SHOPPING_CART.cartProducts.length;
          scope.shoppingCartInfo.subtotal = 0;
          for (var i=0,j=scope.shoppingCartInfo.count; i<j; i++) {
            scope.shoppingCartInfo.subtotal += response.payload.SHOPPING_CART.cartProducts[i].product.finalPrice;
          }
          localStorageService.set('shoppingCartInfo', scope.shoppingCartInfo);
          localStorageService.set('isInstagramLinked', response.payload.SHOPPING_CART.user.isInstagramLinked);
          localStorageService.set('isFacebookLinked', response.payload.SHOPPING_CART.user.isFacebookLinked);
        });
      };

      if (!localStorageService.get('userId')) {
        scope.isLoggedIn = false;
        $state.go('login');
      } else {
        scope.isLoggedIn = true;
        getProductsFromCart();
      }

      $rootScope.$on('event.updateShoppingCart', function(event, data) {
        scope.shoppingCartInfo = {
          count: data.shoppingCartInfo.count,
          subtotal: data.shoppingCartInfo.subtotal
        };
      });

      $rootScope.$on('event.updateFountLogin', function(event, data) {
        scope.isLoggedIn = data.isLoggedIn;
        getProductsFromCart();
      });

      $rootScope.$on('event.updateFountLogout', function(event, data) {
        scope.isLoggedIn = data.isLoggedIn;
        scope.shoppingCartInfo.subtotal = 0;
        // getProductsFromCart();
      });
    }
  };
}]);
