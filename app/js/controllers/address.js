'use strict';

angular.module('sywStyleXApp')
.controller('AddressCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'UtilityService', 'AddressService', 'localStorageService', 'ReviewOrderService', function($scope, $state, $timeout, $ionicScrollDelegate, $ionicLoading, $ionicPopup, UtilityService, AddressService, localStorageService, ReviewOrderService) {
  UtilityService.gaTrackAppView('Shipping Address Page View');

  var apiLocker = false;
  var updateAddressObj = '';
  var user = {
    id: localStorageService.get('userId')
  };

  $scope.sectionVisible = {
    shipping: false,
    invalidAddress: false,
    duplicateAddress: false,
    nextDisabled: false
  };

  $scope.shippingAddress = {
    type: 'SHIPPING',
    firstName: '',
    lastName: '',
    line1: '',
    city: '',
    state: 'Alabama',
    zip: '',
    phone: ''
  };

  $scope.requiredFieldsValided = {
    firstName: true,
    lastName: true,
    line1: true,
    city: true,
    state: true,
    zip: true,
    phone: true
  };

  var addressHeader = {
    add: 'ADD A SHIPPING ADDRESS',
    update: 'UPDATE SHIPPING ADDRESS'
  };

  $scope.shippingAddressHeader = addressHeader.add;
  $scope.userShippingAddress = [];
  $scope.primaryAddressId = '';
  $scope.allInputFieldsValid = true;
  $scope.addressMessage = "Please fill all the required fields.";

  var getShippingAddress  = function() {
      AddressService.getAddress('SHIPPING').then(function(result){
        if (UtilityService.validateResult(result)) {
          if(result.data.payload.ADDRESSES.length > 0) {
            $scope.userShippingAddress = result.data.payload.ADDRESSES;
            $scope.primaryAddressId = $scope.userShippingAddress[0].id;
            setPrimaryAddress($scope.userShippingAddress[0]);
          }
          console.log($scope.userShippingAddress);
          var primaryAddress = ReviewOrderService.getPrimaryAddress();
          if(!!primaryAddress.id) {
            $scope.primaryAddressId = primaryAddress.id
          }
        }
      });
  }

  var addShippingAddress = function() {
    var saveShippingAddress = {
      type: 'SHIPPING',
      name: $scope.shippingAddress.firstName + ' ' + $scope.shippingAddress.lastName,
      line1: $scope.shippingAddress.line1,
      city: $scope.shippingAddress.city,
      state: $scope.shippingAddress.state,
      zip: $scope.shippingAddress.zip,
      phone: $scope.shippingAddress.phone
    };

    AddressService.addAddress(user, saveShippingAddress).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.userShippingAddress.push(result.data.payload.ADDRESS);
        $scope.sectionVisible.shipping = false;
        $ionicScrollDelegate.resize();
      }
    });
  };

  var updateShippingAddress = function() {
    updateAddressObj.line1 = $scope.shippingAddress.line1;
    updateAddressObj.name = $scope.shippingAddress.firstName + ' ' + $scope.shippingAddress.lastName;
    updateAddressObj.city = $scope.shippingAddress.city;
    updateAddressObj.state = $scope.shippingAddress.state;
    updateAddressObj.zip = $scope.shippingAddress.zip;
    updateAddressObj.phone = $scope.shippingAddress.phone;

    AddressService.updateAddress(user, updateAddressObj).then(function(result) {
      if (UtilityService.validateResult(result)) {
//        $scope.userShippingAddress.push(result.data.payload.ADDRESS);
        $scope.sectionVisible.shipping = false;
        $ionicScrollDelegate.resize();
        $scope.shippingAddressHeader = addressHeader.add;
      }
    });
  };

  var setPrimaryAddress = function(address) {
    var primaryAddress = {
      type: 'SHIPPING',
      id: address.id,
      name: address.name,
      line1: address.line1,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone
    };

    ReviewOrderService.setPrimaryAddress(primaryAddress);
    console.log(ReviewOrderService.getPrimaryAddress());
  };

  var hasDuplicateAddress = function() {
    for (var i=0, j=$scope.userShippingAddress.length; i<j; i++) {
      if ($scope.shippingAddress.firstName.toLowerCase() == $scope.userShippingAddress[i].name.split(' ')[0].toLowerCase()
       && $scope.shippingAddress.lastName.toLowerCase() == $scope.userShippingAddress[i].name.split(' ')[1].toLowerCase()
       && $scope.shippingAddress.line1.toLowerCase() == $scope.userShippingAddress[i].line1.toLowerCase()
       && $scope.shippingAddress.city.toLowerCase() == $scope.userShippingAddress[i].city.toLowerCase()
       && $scope.shippingAddress.state.toLowerCase() == $scope.userShippingAddress[i].state.toLowerCase()
       && $scope.shippingAddress.zip.toLowerCase() == $scope.userShippingAddress[i].zip.toLowerCase()
       && $scope.shippingAddress.phone.toLowerCase() == $scope.userShippingAddress[i].phone.toLowerCase()
      ) {
        return true;
      }
    }

    return false;
  };

  var saveShippingAddress = function() {
    // verify address needs to be done
//    verifyAddress($scope.shippingAddress);
    UtilityService.gaTrackAppEvent('Shipping Address Page', 'Click', 'Save shipping address on shipping address page');
    var verifyAddress = {
      line1: $scope.shippingAddress.line1,
      line2: '',
      city: $scope.shippingAddress.city,
      state: $scope.shippingAddress.state,
      zip: $scope.shippingAddress.zip
    };

    AddressService.verifyAddress(user, verifyAddress).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.sectionVisible.invalidAddress = false;
        if ($scope.shippingAddressHeader == addressHeader.add) {
          addShippingAddress();
        } else {
          updateShippingAddress();
        }
      } else {
        console.log('invalid address');
        $scope.sectionVisible.invalidAddress = true;
      }
    }, function(error) {
      console.log(error);
    });
  };

  $scope.updateAddress = function(address) {
    UtilityService.gaTrackAppEvent('Shipping Address Page', 'Click', 'Update shipping address on shipping address page');
    updateAddressObj = address;
    $scope.shippingAddressHeader = addressHeader.update;
    $scope.sectionVisible.shipping = true;
    $scope.shippingAddress.type = 'SHIPPING';
    $scope.shippingAddress.firstName = address.name.split(' ')[0];
    $scope.shippingAddress.lastName = address.name.split(' ')[1];
    $scope.shippingAddress.line1 = address.line1;
    $scope.shippingAddress.city = address.city;
    $scope.shippingAddress.state = address.state;
    $scope.shippingAddress.zip = address.zip;
    $scope.shippingAddress.phone = address.phone;

  };

  $scope.cancelChanges = function() {
    $scope.shippingAddress = {
      type: 'SHIPPING',
      firstName: '',
      lastName: '',
      line1: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    };

    $scope.requiredFieldsValided = {
      firstName: true,
      lastName: true,
      line1: true,
      city: true,
      state: true,
      zip: true,
      phone: true
    };

    $scope.allInputFieldsValid = true;
  };

  $scope.togglePrimaryAddress = function(address) {
    UtilityService.gaTrackAppEvent('Shipping Address Page', 'Select', 'Select/un-select primary shipping address on shipping address page');

    if ($scope.sectionVisible.shipping == true) {
      $scope.sectionVisible.shipping = false;
      $ionicScrollDelegate.resize();
    }

    if ($scope.primaryAddressId == address.id) {
      $scope.primaryAddressId = '';
      $scope.sectionVisible.nextDisabled = true;
    } else {
      $scope.primaryAddressId = address.id;
      $scope.sectionVisible.nextDisabled = false;
      setPrimaryAddress(address);
    }
  };

  $scope.backToPrev = function() {
    // localStorageService.remove('shoppingCart');
    UtilityService.gaTrackAppEvent('Shipping Address Page', 'Click', 'Back to shopping cart page from shipping address page');
    $state.go('cart');
  };

  $scope.clickToNext = function() {
    if(!$scope.allInputFieldsValid || $scope.primaryAddressId == '') {
      return;
    } else {
      UtilityService.gaTrackAppEvent('Shipping Address Page', 'Click', 'Next to payment page from shipping address page');
      $state.go('payment');
    }
  };

  $scope.toggleShippingAddress = function() {
    if (!!$scope.sectionVisible.shipping) {
      $scope.sectionVisible.shipping = false;
      $ionicScrollDelegate.resize();
      UtilityService.gaTrackAppEvent('Shipping Address Page', 'Toggle', 'Hide shipping section on shipping address page');
    } else {
      $scope.sectionVisible.shipping = true;
      $ionicScrollDelegate.resize();
      UtilityService.gaTrackAppEvent('Shipping Address Page', 'Toggle', 'Show shipping section on shipping address page');
    }
  };

  $scope.validRequiredFields = function() {
//    $scope.requiredFieldsValided = {};
    $scope.allInputFieldsValid = true;

    for (var key in $scope.shippingAddress) {
      if (!!$scope.shippingAddress[key]) {
        $scope.requiredFieldsValided[key] = !!$scope.shippingAddress[key];
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
      if (!!hasDuplicateAddress()) {
        $scope.sectionVisible.invalidAddress = false;
        $scope.sectionVisible.duplicateAddress = true;
      } else {
        $scope.sectionVisible.duplicateAddress = false;
        saveShippingAddress();
      }
    }
  };

  $scope.showPopup = function() {
    UtilityService.gaTrackAppEvent('Shipping Address Page', 'Popup', 'Required fields need to be filled on shipping address page');

    var checkoutPopupAlert = $ionicPopup.alert({
      cssClass: 'reach-tagging-limit',
      template: 'Please fill all the required fields.'
    });

    checkoutPopupAlert.then(function(res) {
      console.log('Please fill all the required fields.');
    });
  };

  $scope.$on('$ionicView.enter', function() {
    getShippingAddress();
  });

}]);
