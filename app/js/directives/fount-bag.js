'use strict';

angular.module('sywStyleXApp')
.directive('fountBag', ['$state', 'localStorageService', 'CartService', function($state, localStorageService, CartService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-bag.html',
    scope: {
      shoppingCartInfo: '='
    },
    link: function(scope, element, attrs) {
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

      var updateProductsFromCart = function() {
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

      scope.goToCart = function() {
        // $state.go('cart');
        updateProductsFromCart();
      };

      scope.toggleSearchBar = function() {
        if (scope.searchObj.showSearchBar == false) {
          scope.searchObj.showSearchBar = true;
          // element.find('ul.sub-menu').css('opacity', 1);
        } else {
          scope.searchObj.showSearchBar = false;
          // element.find('ul.sub-menu').css('opacity', 0);
        }
      };
    }
  };
}]);
