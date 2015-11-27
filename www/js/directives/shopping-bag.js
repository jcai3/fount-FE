'use strict';

angular.module('sywStyleXApp')
.directive('shoppingBag', ['$state', '$timeout', '$ionicLoading', 'localStorageService', 'TwoTapService', 'UtilityService', 'CartService', function($state, $timeout, $ionicLoading, localStorageService, TwoTapService, UtilityService, CartService){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'shopping-bag.html',
    scope: {
      shoppingCartInfo: '='
    },
    link: function(scope, element, attrs) {
      // pull info for shopping cart count, needs api support
      // if (!!localStorageService.get('shoppingCart')) {
      //   scope.shoppingCart = localStorageService.get('shoppingCart');
      // } else {
      //   scope.shoppingCart = [];
      // }
      var shoppingCartLocker = false;
      var shoppingCartSource = {
        stateName: $state.current.name,
        stateParam: $state.params
      };

      var shoppingCartDict = {};

      var collateShoppingCartItems = function(cartProducts) {
        var shoppingBagObj = {
          id:cartProducts.id,
          availability: (cartProducts.productMetadata.availability == 'AVAILABLE') ? true : false,
          productId: cartProducts.product.id ,
          sellerName: cartProducts.product.seller.name,
          name: cartProducts.product.name,
          imageURL: cartProducts.product.imageURL,
          price: cartProducts.productMetadata.price,
          fit: (cartProducts.productMetadata.fit !== 'NA')? cartProducts.productMetadata.fit : null,
          color: (cartProducts.productMetadata.color !== 'NA')? cartProducts.productMetadata.color : null,
          size: (cartProducts.productMetadata.size !== 'NA')? cartProducts.productMetadata.size : null,
          option: (cartProducts.productMetadata.option !== 'NA')? cartProducts.productMetadata.option : null,
          shippingOptions: cartProducts.shippingMethod,
          buyURL: cartProducts.product.buyURL,
          originalUrl: cartProducts.originalUrl,
          mediaId: !!cartProducts.media ? cartProducts.media.id : null,
          visualTagId: !!cartProducts.visualTag ? cartProducts.visualTag.id : null,
          qty: cartProducts.quantity,
          prices: {subtotal: "$0.00"},
          itemSelected: false
        };

        if (shoppingBagObj.sellerName in shoppingCartDict) {
          shoppingCartDict[shoppingBagObj.sellerName].push(shoppingBagObj);
        } else {
          shoppingCartDict[shoppingBagObj.sellerName] = [];
          shoppingCartDict[shoppingBagObj.sellerName].push(shoppingBagObj);
        }

      };

      var getProductsFromCart = function() {
        shoppingCartDict = {};
        var userId = localStorageService.get('userId');
        CartService.getProductsFromCart(userId, true).success(function(response) {
          var userCartProducts = response.payload.SHOPPING_CART.cartProducts;
          var userCartLength = userCartProducts.length;
          if (userCartLength > 0) {
            var shoppingCartId = response.payload.SHOPPING_CART.id;
            for (var i=0; i< userCartLength; i++) {
              collateShoppingCartItems(userCartProducts[i]);
            };
            console.log(shoppingCartDict);
            localStorageService.set('shoppingCart', shoppingCartDict);
            localStorageService.set('shoppingCartId', shoppingCartId);

            var shoppingBagDetail = {
              twotap: response,
              source: 'shoppingBagDetail'
            };
            localStorageService.set('shoppingBagDetail', shoppingBagDetail);
            $state.go('cart');
          } else {
            $state.go('cart');
          }
        });
      };

      scope.openShoppingCart = function() {
        // if (scope.shoppingCartInfo.count == 0) {
        //   return;
        // }
        // if (shoppingCartLocker) {
        //   return;
        // }

        if (shoppingCartSource.stateName === 'main.home') {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from discover');
        } else if (shoppingCartSource.stateName === 'main.settings') {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from profile');
        } else if (shoppingCartSource.stateName === 'main.shop') {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from shop');
        } else if (shoppingCartSource.stateName === 'media') {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from media detail');
        } else if (shoppingCartSource.stateName === 'product') {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from product detail');
        } else {
          UtilityService.gaTrackAppEvent('Shopping Cart CTA', 'Click', 'Shopping cart page from ' + shoppingCartSource.stateName);
        }

        // shoppingCartLocker = true;

        localStorageService.set('shoppingCartSource', shoppingCartSource);

        getProductsFromCart();
      };
    }
  };
}]);
