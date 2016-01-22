'use strict';

angular.module('sywStyleXApp')
.controller('OrderConfirmCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'localStorageService', 'UtilityService', 'TwoTapService', 'CheckoutService', 'CartService', 'ReviewOrderService', 'ngDialog', function($rootScope, $scope, $state, $timeout, localStorageService, UtilityService, TwoTapService, CheckoutService, CartService, ReviewOrderService, ngDialog) {

  var shippingAddress = localStorageService.get('shippingAddress');
  var paymentInfo = localStorageService.get('paymentInfo');

  var cartId = '';
  var cartProductIds = localStorageService.get('cartProductIds');
  var affiliateLinks = [];
  var twotapProductUrls = [];
  var productTwotapIdMap = {};

  var user = {
    id: localStorageService.get('userId')
  };

  $scope.noauthCheckout = {
    billingAddressId: '',
    billingAddress: paymentInfo.line1,
    billingCity: paymentInfo.city,
    billingCountry: 'United States of America',
    billingFirstName: paymentInfo.firstName,
    billingLastName: paymentInfo.lastName,
    billingState: paymentInfo.state,
    billingTelephone: paymentInfo.phone,
    billingTitle: 'default',
    billingZip: paymentInfo.zip,
    cardName: paymentInfo.cardName,
    cardNumber: paymentInfo.cardNumber,
    cardType: paymentInfo.cardType,
    cvv: paymentInfo.cardCVV,
    email: 'test@test.com',
    expiryDateMonth: paymentInfo.cardExp.split('/')[0],
    expiryDateYear: paymentInfo.cardExp.split('/')[1],
    // shippingAddressId: shippingAddress.id,
    shippingAddressId: '',
    shippingAddress: shippingAddress.line1,
    shippingCity: shippingAddress.city,
    shippingCountry: 'United States of America',
    shippingFirstName: shippingAddress.firstName,
    shippingLastName: shippingAddress.lastName,
    shippingState: shippingAddress.state,
    shippingTelephone: shippingAddress.phone,
    shippingTitle: 'default',
    shippingZip: shippingAddress.zip
  };

  var getCartProducts = function() {
    CheckoutService.getCheckoutSummary(cartProductIds).then(function(result) {
      cartId = result.data.payload.CART_ID;
      affiliateLinks = result.data.payload.AFFILIATE_LINKS;
      twotapProductUrls = result.data.payload.TWOTAP_PRODUCT_URLS;
      productTwotapIdMap = result.data.payload.PRODUCT_TWOTAP_ID_MAP;
      $scope.shoppingCartTotal = {
        totalPrice: result.data.payload.TOTAL_PRICE,
        totalCount: result.data.payload.NUMBER_OF_PRODUCTS,
        totalShipping: result.data.payload.SHIPPING_PRICE,
        totalTax: result.data.payload.SALES_TAX
      };
      $scope.shoppingCartGroups = {
        shoppingCartProductGroups: result.data.payload.SHOPPING_CART_PRODUCT_GROUPS,
        unavailableGroups: result.data.payload.SHOPPING_CART_PRODUCT_GROUPS_NA
      };
    });
  };

  var placeOrder = function() {
    showLoadingSpinner();
    CheckoutService.placeOrder($scope.shoppingCartGroups.shoppingCartProductGroups, cartId, productTwotapIdMap, $scope.noauthCheckout, $scope.shoppingCartTotal.totalPrice, $scope.shoppingCartTotal.totalShipping, $scope.shoppingCartTotal.totalTax).then(function(result) {
      hideLoadingSpinner();
      if (result.data.payload.TWOTAP_PURCHASE_RESPONSE.message == 'still_processing') {
        localStorageService.remove('shippingAddress');
        localStorageService.remove('paymentInfo');
        localStorageService.remove('shoppingCart');
        localStorageService.remove('shoppingCartId');
        localStorageService.remove('shoppingCartInfo');
        localStorageService.remove('shoppingCartSource');
        localStorageService.remove('shoppingBagDetail');
        localStorageService.remove('shoppingBagEstimates');
        localStorageService.remove('cartProductIds');
        localStorageService.remove('productDetail');
        localStorageService.remove('trackHistory');
        localStorageService.remove('filteredProductsHasMoreData');
        $rootScope.$emit('event.updateShoppingCart');
        $state.go('order-complete');
      } else {
        $scope.checkoutErrorMsg = {
          description: result.data.payload.TWOTAP_PURCHASE_RESPONSE.description,
          enabled: true
        };

        // $ionicScrollDelegate.scrollTop();
      }
    }, function(error) {
      console.log(error);
      hideLoadingSpinner();
    });
  };

  var showLoadingSpinner = function() {
    ngDialog.open({
      template: '<p>Order in progress...</p><img src="img/loader.gif">',
      plain: true,
      showClose: false
    });
  };

  var hideLoadingSpinner = function() {
    ngDialog.close();
  };

  $scope.checkoutErrorMsg = {
    description: '',
    enabled: false
  };

  $scope.backToHome = function() {
    $state.go('payment');
  };

  $scope.confirmToPay = function() {
    placeOrder();
  };

  getCartProducts();

}]);
