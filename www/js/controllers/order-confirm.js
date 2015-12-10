'use strict';

angular.module('sywStyleXApp')
.controller('OrderConfirmCtrl', ['$scope', '$state', '$timeout', 'localStorageService', 'UtilityService', 'TwoTapService', 'CheckoutService', 'CartService', 'ReviewOrderService', function($scope, $state, $timeout, localStorageService, UtilityService, TwoTapService, CheckoutService, CartService, ReviewOrderService) {
  var shippingAddress = ReviewOrderService.getPrimaryAddress();
  var paymentInfo = ReviewOrderService.getPaymentInfo();

  var cartId = '';
  var cartProductIds = [];
  var affiliateLinks = [];
  var twotapProductUrls = [];
  var productTwotapIdMap = {};

  var user = {
    id: localStorageService.get('userId')
  };

  var noauthCheckout = {
    billingAddressId: '',
    billingAddress: paymentInfo.billing_address,
    billingCity: paymentInfo.billing_city,
    billingCountry: paymentInfo.billing_country,
    billingFirstName: paymentInfo.billing_firstName,
    billingLastName: paymentInfo.billing_lastName,
    billingState: paymentInfo.billing_state,
    billingTelephone: paymentInfo.billing_telephone,
    billingTitle: 'default',
    billingZip: paymentInfo.billing_zip,
    cardName: paymentInfo.card_name,
    cardNumber: paymentInfo.card_number,
    cardType: paymentInfo.card_type,
    cvv: paymentInfo.cvv,
    email: 'test@test.com',
    expiryDateMonth: paymentInfo.expiry.split('/')[0],
    expiryDateYear: paymentInfo.expiry.split('/')[1],
    shippingAddressId: shippingAddress.id,
    shippingAddress: shippingAddress.line1,
    shippingCity: shippingAddress.city,
    shippingCountry: 'United States of America',
    shippingFirstName: shippingAddress.name.split(' ')[0],
    shippingLastName: shippingAddress.name.split(' ')[1],
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
    CheckoutService.placeOrder($scope.shoppingCartGroups.shoppingCartProductGroups, cartId, productTwotapIdMap, noauthCheckout, $scope.shoppingCartTotal.totalPrice, $scope.shoppingCartTotal.totalShipping, $scope.shoppingCartTotal.totalTax).then(function(result) {
      hideLoadingSpinner();
      if (result.data.payload.TWOTAP_PURCHASE_RESPONSE.message == 'still_processing') {
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
        $state.go('order-complete');
      } else {
        $scope.checkoutErrorMsg = {
          description: result.data.payload.TWOTAP_PURCHASE_RESPONSE.description,
          enabled: true
        };

        $ionicScrollDelegate.scrollTop();
      }
    }, function(error) {
      console.log(error);
      hideLoadingSpinner();
    });
  };

  var showLoadingSpinner = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner><p>Order in progress</p>'
    });
  };

  var hideLoadingSpinner = function() {
    $ionicLoading.hide();
  };

  $scope.backToHome = function() {
    $state.go('payment');
  };

  $scope.confirmToPay = function() {
    placeOrder();
  };

  $scope.$on('$ionicView.enter', function() {
    cartProductIds = localStorageService.get('cartProductIds');
    $scope.checkoutErrorMsg = {
      description: '',
      enabled: false
    };

    getCartProducts();
  });

}]);
