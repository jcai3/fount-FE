'use strict';

angular.module('sywStyleXApp')
.controller('PaymentCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'UtilityService', 'localStorageService', 'ReviewOrderService', 'AddressService', function($scope, $state, $timeout, $ionicScrollDelegate, $ionicLoading, $ionicPopup, UtilityService, localStorageService, ReviewOrderService, AddressService) {
  UtilityService.gaTrackAppView('Payment Page View');

  var apiLocker = false;

  var paymentInfo = {
    billing_firstName: '',
    billing_lastName: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_country: '',
    billing_zip: '',
    billing_telephone: '',
    card_type: '',
    card_number: '',
    card_name: '',
    expiry: '',
    cvv: ''
  };

  var user = {
    id: localStorageService.get('userId')
  };

  $scope.paymentInfoAdded = false;
  $scope.allInputFieldsValid = true;

  $scope.sectionVisible = {
    payment: false,
    invalidAddress: false,
    unsupportedCard: false
  };

  $scope.creditCardInfo = {
    type: 'Visa',
    number: '',
    expiration: '',
    cvv: '',
    name: ''
  };

  $scope.billingAddress = {
    type: 'BILLING',
    firstName: '',
    lastName: '',
    line1: '',
    city: '',
    state: 'Alabama',
    zip: '',
    phone: ''
  };

  $scope.checkboxModel = {
    sameAsShippingAddress: false
  };

  $scope.paymentdetails = {
    type: '',
    number: ''
  }

  $scope.requiredFieldsValided = {
    billing_firstName: true,
    billing_lastName: true,
    billing_address: true,
    billing_city: true,
    billing_state: true,
    billing_country: true,
    billing_zip: true,
    billing_telephone: true,
    card_type: true,
    card_number: true,
    card_name: true,
    expiry: true,
    cvv: true
  };

  var addPaymentdetails = function() {
    paymentInfo.billing_firstName = $scope.billingAddress.firstName;
    paymentInfo.billing_lastName = $scope.billingAddress.lastName;
    paymentInfo.billing_address = $scope.billingAddress.line1;
    paymentInfo.billing_city = $scope.billingAddress.city;
    paymentInfo.billing_state = $scope.billingAddress.state;
    paymentInfo.billing_country = 'United States of America';
    paymentInfo.billing_zip = $scope.billingAddress.zip;
    paymentInfo.billing_telephone = $scope.billingAddress.phone;
    paymentInfo.card_type = $scope.creditCardInfo.type;
    paymentInfo.card_number = $scope.creditCardInfo.number;
    paymentInfo.card_name = $scope.creditCardInfo.name;
    paymentInfo.expiry = $scope.creditCardInfo.expiration;
    paymentInfo.cvv = $scope.creditCardInfo.cvv;
  };

  $scope.fillBillingAddress = function() {
    if ($scope.checkboxModel.sameAsShippingAddress === true) {
      UtilityService.gaTrackAppEvent('Payment Page', 'Checkbox', 'Check same as shipping address on payment page');
      var shippingAddress = ReviewOrderService.getPrimaryAddress();
      $scope.billingAddress.firstName = shippingAddress.name.split(' ')[0];
      $scope.billingAddress.lastName = shippingAddress.name.split(' ')[1];
      $scope.billingAddress.line1 = shippingAddress.line1;
      $scope.billingAddress.city = shippingAddress.city;
      $scope.billingAddress.state = shippingAddress.state;
      $scope.billingAddress.zip = shippingAddress.zip;
      $scope.billingAddress.phone = shippingAddress.phone;
    } else {
      UtilityService.gaTrackAppEvent('Checkout Page', 'Checkbox', 'Uncheck same as shipping address on checkout page');
      $scope.billingAddress = {
        type: 'BILLING',
        firstName: '',
        lastName: '',
        line1: '',
        city: '',
        state: 'Alabama',
        zip: '',
        phone: ''
      };
    }
  };

  $scope.cancelChanges = function() {
    $scope.creditCardInfo = {
      type: 'Visa',
      number: '',
      expiration: '',
      cvv: '',
      name: ''
    };

    $scope.billingAddress = {
      type: 'BILLING',
      firstName: '',
      lastName: '',
      line1: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    };

    $scope.checkboxModel = {
      sameAsShippingAddress: false
    };

    $scope.requiredFieldsValided = {
      billing_firstName: true,
      billing_lastName: true,
      billing_address: true,
      billing_city: true,
      billing_state: true,
      billing_country: true,
      billing_zip: true,
      billing_telephone: true,
      card_type: true,
      card_number: true,
      card_name: true,
      expiry: true,
      cvv: true
    };
  };

  var savePaymentInfo = function() {
    UtilityService.gaTrackAppEvent('Payment Page', 'Click', 'Add payment info on payment page');
    ReviewOrderService.setPaymentInfo(paymentInfo);
    $scope.paymentInfoAdded = true;
    $scope.sectionVisible.payment = false;
    $scope.paymentdetails.type = $scope.creditCardInfo.type;
    $scope.paymentdetails.number = '************ '+ $scope.creditCardInfo.number.substring(12,16);

    $scope.clickToNext();
  };

  var verifyAddress = function() {
    var verifyAddress = {
      line1: paymentInfo.billing_address,
      line2: '',
      city: paymentInfo.billing_city,
      state: paymentInfo.billing_state,
      zip: paymentInfo.billing_zip
    };

    AddressService.verifyAddress(user, verifyAddress).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.sectionVisible.invalidAddress = false;
        savePaymentInfo();
      } else {
        console.log('invalid address');
        $scope.sectionVisible.invalidAddress = true;
      }
    });
  };
  $scope.backToPrev = function() {
    UtilityService.gaTrackAppEvent('Payment Page', 'Click', 'Back to Shipping Address page from payment page');
    $state.go('address');
  };

  $scope.clickToNext = function() {
    if ($scope.paymentInfoAdded) {
      UtilityService.gaTrackAppEvent('Payment Page', 'Click', 'Next to Confirm Order page from payment page');
      $state.go('order-confirm');
    } else {
      return;
    }
  };

  $scope.togglePayment = function() {
    if ($scope.sectionVisible.payment) {
      UtilityService.gaTrackAppEvent('Payment Page', 'Toggle', 'Hide billing section on payment page');
      $scope.sectionVisible.payment = false;
      $ionicScrollDelegate.resize();
    } else {
      UtilityService.gaTrackAppEvent('Payment Page', 'Toggle', 'Show billing section on payment page');
      $scope.sectionVisible.payment = true;
      $ionicScrollDelegate.resize();
    }
  };

  $scope.validRequiredFields = function() {
    addPaymentdetails();
    $scope.allInputFieldsValid = true;

    for (var key in paymentInfo) {
      if (!!paymentInfo[key]) {
        $scope.requiredFieldsValided[key] = !!paymentInfo[key];
      } else {
        $scope.requiredFieldsValided[key] = false;
      }
    }

    for (var reqKey in $scope.requiredFieldsValided) {
      if($scope.requiredFieldsValided[reqKey] == false) {
        $scope.allInputFieldsValid = false;
        break;
      }
    }

    if($scope.allInputFieldsValid) {
      if($scope.checkboxModel.sameAsShippingAddress) {
        savePaymentInfo();
      } else {
        verifyAddress();
      }
    }
  };

  $scope.$watch('creditCardInfo.number', function(newVal, oldVal) {
    if (!!newVal) {
      if (newVal.length < 6) {
        return;
      }

      var ccType = UtilityService.getCreditCardType(newVal);
      if (ccType != 'unsupported') {
        $scope.sectionVisible.unsupportedCard = false;
        $scope.creditCardInfo.type = ccType;
      } else {
        $scope.creditCardInfo.type = 'Visa';
        $scope.sectionVisible.unsupportedCard = true;
      }
    }
  });

}]);
