'use strict';

angular.module('sywStyleXApp')
.controller('CheckoutCtrl', ['$scope', '$state', '$timeout', 'UtilityService', 'AddressService', 'OrderCommissionService', 'localStorageService', 'TwoTapService', function($scope, $state, $timeout, UtilityService, AddressService, OrderCommissionService, localStorageService, TwoTapService) {
  var apiLocker = false;

  // var paymentInfo = {
  //   email: 'willtest@test.com',
  //   shipping_title: 'default',
  //   shipping_first_name: 'William',
  //   shipping_last_name: 'Zhang',
  //   shipping_address: '3333 Beverly Rd',
  //   shipping_city: 'Hoffman Estates',
  //   shipping_state: 'Illinois',
  //   shipping_country: 'United States of America',
  //   shipping_zip: '60179',
  //   shipping_telephone: '8471231234',
  //   billing_title: 'default',
  //   billing_first_name: 'William',
  //   billing_last_name: 'Zhang',
  //   billing_address: '3333 Beverly Rd',
  //   billing_city: 'Hoffman Estates',
  //   billing_state: 'Illinois',
  //   billing_country: 'United States of America',
  //   billing_zip: '60179',
  //   billing_telephone: '8471231234',
  //   card_type: 'Visa',
  //   card_number: '4005519200000004',
  //   card_name: 'William Zhang',
  //   expiry_date_year: '2016',
  //   expiry_date_month: '10',
  //   cvv: '123'
  // };

  var paymentInfo = {
    email: '',
    shipping_title: '',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_country: '',
    shipping_zip: '',
    shipping_telephone: '',
    billing_title: '',
    billing_first_name: '',
    billing_last_name: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_country: '',
    billing_zip: '',
    billing_telephone: '',
    card_type: '',
    card_number: '',
    card_name: '',
    expiry_date_year: '',
    expiry_date_month: '',
    cvv: ''
  };

  var user = {
    id: localStorageService.get('userId')
  };

  var verifyAddress = function(userAddress) {
    var address = {
      address_line1: userAddress.line1,
      address_line2: '',
      address_city: userAddress.city,
      address_state: userAddress.state,
      address_zip: userAddress.zip
    }

    AddressService.verifyAddress(user, address).then(function(result) {

    });
  };

  var createOrder = function(items) {
    var shippingAddress = $scope.shippingAddress;
    shippingAddress.user = {
      id: user.id
    }

    var billingAddress = $scope.billingAddress;
    billingAddress.user = {
      id: user.id
    };

    OrderCommissionService.createOrder(user, shippingAddress, billingAddress, $scope.shoppingBagEstimates.salesTax, $scope.shoppingBagEstimates.shippingPrice, $scope.shoppingBagEstimates.finalPrice, items).then(function(result) {
      console.log(result);
    });
  };

  var pollPurchaseStatus = function(options) {
    var timer = $timeout(function() {
      TwoTapService.purchaseStatus(options).success(function(response) {
        var options = {
          purchase_id: response.purchase_id
        };

        if (response.message == 'done') {

          if (response.pending_confirm == false) {
            $timeout.cancel(timer);

            localStorageService.remove('shoppingCart');
            localStorageService.remove('shoppingCartInfo');
            localStorageService.remove('shoppingCartSource');
            localStorageService.remove('shoppingBagDetail');
            localStorageService.remove('shoppingBagEstimates');
            console.log(response);
            return;
          }

          var options = {
            purchase_id: response.purchase_id
          };
          TwoTapService.purchaseConfirm(options).success(function(response) {
            var options = {
              purchase_id: response.purchase_id
            };

            if (response.message == 'still_processing') {
              pollPurchaseStatus(options);
            } else if (response.message == 'invalid_status') {
              $timeout.cancel(timer);
            } else {
              $timeout.cancel(timer);
            }
          });
        } else if (response.message == 'has_failures') {
          console.log('has_failures');
          $timeout.cancel(timer);
          return response;
        } else if (response.message == 'disabled') {
          console.log('disabled');
          $timeout.cancel(timer);
          return response;
        } else if (response.message == 'not_found') {
          console.log('disabled');
          $timeout.cancel(timer);
          return response;
        } else {
          console.log('still_processing');
          pollPurchaseStatus(options);
        }
      });
    }, 2000);
  };

  var showLoadingSpinner = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner><p>Order is in process.</p>'
    });
  };

  var hideLoadingSpinner = function() {
    $ionicLoading.hide();
  };

  $scope.sectionVisible = {
    shipping: false,
    payment: false,
    total: true
  };

  $scope.shippingAddress = {
    type: 'SHIPPING',
    name: '',
    line1: '',
    city: '',
    state: 'Alabama',
    zip: '',
    phone: ''
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
    name: '',
    line1: '',
    city: '',
    state: 'Alabama',
    zip: '',
    phone: ''
  };

  $scope.checkboxModel = {
    sameAsShippingAddress: false
  };

  $scope.fillBillingAddress = function() {
    if ($scope.checkboxModel.sameAsShippingAddress === true) {
      $scope.billingAddress.name = $scope.shippingAddress.name;
      $scope.billingAddress.line1 = $scope.shippingAddress.line1;
      $scope.billingAddress.city = $scope.shippingAddress.city;
      $scope.billingAddress.state = $scope.shippingAddress.state;
      $scope.billingAddress.zip = $scope.shippingAddress.zip;
      $scope.billingAddress.phone = $scope.shippingAddress.phone;
    } else {
      $scope.billingAddress = {
        type: 'BILLING',
        name: '',
        line1: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
      };
    }
  };

  $scope.addShippingAddress = function() {
    // verify address needs to be done
    // verifyAddress($scope.shippingAddress);

    AddressService.addAddress(user, $scope.shippingAddress).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.sectionVisible.shipping = false;
        paymentInfo.email = result.data.payload.ADDRESS.user.email;
        paymentInfo.shipping_title = 'default';
        paymentInfo.shipping_first_name = $scope.shippingAddress.name.split(' ')[0];
        paymentInfo.shipping_last_name = $scope.shippingAddress.name.split(' ')[1];
        paymentInfo.shipping_address = $scope.shippingAddress.line1;
        paymentInfo.shipping_city = $scope.shippingAddress.city;
        paymentInfo.shipping_state = $scope.shippingAddress.state;
        paymentInfo.shipping_country = 'United States of America';
        paymentInfo.shipping_zip = $scope.shippingAddress.zip;
        paymentInfo.shipping_telephone = $scope.shippingAddress.phone;
      }
    });
  };

  $scope.addPaymentInfo = function() {

    paymentInfo.billing_title = 'default',
    paymentInfo.billing_first_name = $scope.billingAddress.name.split(' ')[0];
    paymentInfo.billing_last_name = $scope.billingAddress.name.split(' ')[1];
    paymentInfo.billing_address = $scope.billingAddress.line1;
    paymentInfo.billing_city = $scope.billingAddress.city;
    paymentInfo.billing_state = $scope.billingAddress.state;
    paymentInfo.billing_country = 'United States of America';
    paymentInfo.billing_zip = $scope.billingAddress.zip;
    paymentInfo.billing_telephone = $scope.billingAddress.phone;
    paymentInfo.card_type = $scope.creditCardInfo.type;
    paymentInfo.card_number = $scope.creditCardInfo.number;
    paymentInfo.card_name = $scope.creditCardInfo.name;
    paymentInfo.expiry_date_year = $scope.creditCardInfo.expiration.split('/')[1];
    paymentInfo.expiry_date_month = $scope.creditCardInfo.expiration.split('/')[0];
    paymentInfo.cvv = $scope.creditCardInfo.cvv;

    setTimeout(function() {
      $scope.sectionVisible.payment = false;
    }, 100);
  };

  $scope.backToPrev = function() {
    // localStorageService.remove('shoppingCart');
    $state.go('cart');
  };

  $scope.toggleShippingAddress = function() {
    if ($scope.sectionVisible.shipping) {
      $scope.sectionVisible.shipping = false;
    } else {
      $scope.sectionVisible.shipping = true;
    }
  };

  $scope.togglePayment = function() {
    if ($scope.sectionVisible.payment) {
      $scope.sectionVisible.payment = false;
    } else {
      $scope.sectionVisible.payment = true;
    }
  };

  $scope.toggleTotal = function() {
    if ($scope.sectionVisible.total) {
      $scope.sectionVisible.total = false;
    } else {
      $scope.sectionVisible.total = true;
    }
  };

  $scope.validRequiredFields = function() {
    var requiredFieldsValided = false;
    for (var key in paymentInfo) {
      if (!!paymentInfo[key]) {
        requiredFieldsValided = !!paymentInfo[key];
      } else {
        return false;
      }
    }

    return requiredFieldsValided;
  };

  $scope.showPopup = function() {
    var checkoutPopupAlert = $ionicPopup.alert({
      cssClass: 'reach-tagging-limit',
      template: 'Please fill all the required fields.'
    });

    checkoutPopupAlert.then(function(res) {
      console.log('Please fill all the required fields.');
    });
  };

  $scope.confirmToPay = function() {
    // for non-authenticated checkout
    var shoppingCart = localStorageService.get('shoppingCart');
    var shoppingBagDetail = localStorageService.get('shoppingBagDetail');
    console.log('shoppingCart: ');
    console.log(shoppingCart);

    console.log('shoppingBagDetail: ');
    console.log(shoppingBagDetail);

    var items = [];
    var options = {
      cart_id: shoppingBagDetail.twotap.cart_id,
      fields_input: {},
      affiliate_links: {},
      products: []
    };

    for (var key in shoppingBagDetail.twotap.sites) {
      options.fields_input[key] = {
        noauthCheckout: paymentInfo,
        addToCart: {}
      };
      options.affiliate_links[key] = {};
      for (var productMD5 in shoppingBagDetail.twotap.sites[key].add_to_cart) {
        // get required_fields
        var sellerName = shoppingBagDetail.twotap.sites[key].info.name;
        if (sellerName.toLowerCase() == 'Office Depot'.toLowerCase()) {
          sellerName = 'Office Depot and OfficeMax';
        } else if (sellerName.toLowerCase() == 'ulta') {
          sellerName = 'ULTA Beauty';
        } else if (sellerName.toLowerCase() == 'ashford') {
          sellerName = 'ashford';
        } else if (sellerName.toLowerCase() == 'Sunglass Hut'.toLowerCase()) {
          sellerName = 'Sunglass Hut Affiliate Program';
        } else if (sellerName.toLowerCase() == 'SSENSE'.toLowerCase()) {
          sellerName = 'ssense.com men and women fashion';
        } else if (sellerName.toLowerCase() == 'Solstice Sunglasses'.toLowerCase()) {
          sellerName = 'SOLSTICEsunglasses.com';
        } else if (sellerName.toLowerCase() == 'OldNavy'.toLowerCase()) {
          sellerName = 'Old Navy';
        } else if (sellerName.toLowerCase() == 'gap') {
          sellerName = 'Gap';
        } else if (sellerName.toLowerCase() == 'skinstore') {
          sellerName = 'SkinStore.com';
        } else if (sellerName.toLowerCase() == 'dwell store') {
          sellerName = 'Dwell';
        }

        if (sellerName in shoppingCart) {
          var original_url = shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].original_url;
          var selectedProduct = UtilityService.getProductFromArrayByUrl(shoppingCart[sellerName], original_url);

          var item = {
            // product: {
            //   id: selectedProduct.productId
            // },
            // media: {
            //   id: selectedProduct.mediaId
            // },
            // visualTag: {
            //   id: selectedProduct.visualTagId
            // },
            price: !!selectedProduct.availability ? UtilityService.numberParser(selectedProduct.prices.subtotal) : selectedProduct.price,
            quantity: selectedProduct.qty,
            shoppingCartProduct: {
              id: selectedProduct.id
            }
            // productMetadata: {
            //   product: {
            //     id: selectedProduct.productId
            //   },
            //   availability: !!selectedProduct.availability ? 'AVAILABLE' : 'UNAVAILABLE',
            //   price: !!selectedProduct.availability ? UtilityService.numberParser(selectedProduct.prices.subtotal) : selectedProduct.price,
            //   fit: selectedProduct.fit,
            //   option: selectedProduct.option,
            //   color: selectedProduct.color,
            //   size: selectedProduct.size
            // }
          };
          items.push(item);

          options.fields_input[key].addToCart[productMD5] = {};
          options.products.push(shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].url);

          if (!!shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names) {
            for (var i=0,j=shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names.length; i<j; i++) {

              if (shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names[i] == 'quantity') {
                options.fields_input[key].addToCart[productMD5][shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names[i]] = selectedProduct.qty;
              } else {
                options.fields_input[key].addToCart[productMD5][shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names[i]] = selectedProduct[shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].required_field_names[i]];
              }

              // options.affiliate_links[key][productMD5] = shoppingBagDetail.twotap.sites[key].add_to_cart[productMD5].original_url;
              options.affiliate_links[key][productMD5] = selectedProduct.affiliateURL;
            }
          }
        }
      }
    }

    TwoTapService.purchase(options).success(function(response) {
      createOrder(items);

      if (response.message == 'still_processing') {
        var options = {
          purchase_id: response.purchase_id
        }

        TwoTapService.purchaseStatus(options).success(function(response) {

          if (response.message == 'still_processing') {
            var options = {
              purchase_id: response.purchase_id
            };

            pollPurchaseStatus(options);
          }

          showLoadingSpinner();

          $timeout(function() {
            hideLoadingSpinner();
            $state.go('main.home');
          }, 2000);
        });
      }
    });
  };

  $scope.$on('$ionicView.enter', function() {

    $scope.shoppingBagEstimates = {
      subtotal: 0,
      shippingPrice: 0,
      salesTax: 0,
      finalPrice: 0
    };

    if (!!localStorageService.get('shoppingCartInfo')) {
      $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
    }

    if (!!localStorageService.get('shoppingBagEstimates')) {
      var shoppingBagEstimates = localStorageService.get('shoppingBagEstimates');
      console.log(shoppingBagEstimates);
      for (var key in shoppingBagEstimates.estimates) {
        $scope.shoppingBagEstimates.subtotal += Number(shoppingBagEstimates.estimates[key].prices.subtotal.replace(/[^0-9\.]+/g,''));
        $scope.shoppingBagEstimates.shippingPrice += Number(shoppingBagEstimates.estimates[key].prices.shipping_price.replace(/[^0-9\.]+/g,''));
        $scope.shoppingBagEstimates.salesTax += Number(shoppingBagEstimates.estimates[key].prices.sales_tax.replace(/[^0-9\.]+/g,''));
        $scope.shoppingBagEstimates.finalPrice += Number(shoppingBagEstimates.estimates[key].prices.final_price.replace(/[^0-9\.]+/g,''));
      }
    }

    console.log($scope.shoppingCartInfo);
  });

}]);
