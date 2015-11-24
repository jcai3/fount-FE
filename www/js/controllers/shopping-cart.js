'use strict';

angular.module('sywStyleXApp')
.controller('ShoppingCartCtrl', ['$scope', '$state', '$ionicModal', '$timeout', 'UtilityService', 'localStorageService', 'TwoTapService', 'CartService', 'ProductDetailService',function($scope, $state, $ionicModal, $timeout, UtilityService, localStorageService, TwoTapService, CartService, ProductDetailService) {
  UtilityService.gaTrackAppView('Shopping Cart Page View');

  var shoppingBagDetail;
  var sites = [];
  var productDetailLocker = false;
  var cartProductIds = [];
  $scope.sellerItemsDisabled = false;
  $scope.itemDisabled = false;
  $scope.cartItemsDisabled = false;
  $scope.selectAllItems = true;
  $scope.disableAllItemsSelect = false;

  var hideSaveLaterMsg = function() {
    $timeout(function () {
      $scope.showSaveForLaterSuccessMsg = false;
    }, 2000);
  };

  var toggleSelectAllSellerItems = function(key) {
    var sellerItems = $scope.shoppingCartDict[key];

    for (var i = 0, j = sellerItems.length; i < j; i++) {
      if ($scope.shoppingCartDict[key].selectSeller) {
        cartProductIds.push(sellerItems[i].id);
        sellerItems[i].itemSelected = true;
        $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(sellerItems[i].price);
      } else {
        var index = cartProductIds.indexOf(sellerItems[i].id);
        if (index > -1) {
          cartProductIds.splice(index, 1);
        }
        sellerItems[i].itemSelected = false;
        if ($scope.shoppingCartInfo.subtotal > 0) {
          $scope.shoppingCartInfo.subtotal -= UtilityService.numberParser(sellerItems[i].price);
        } else {
          $scope.shoppingCartInfo.subtotal = 0;
        }
      }
    }

    $scope.shoppingCartDict[key] = sellerItems;
    localStorageService.set('cartProductIds', cartProductIds);
    console.log($scope.shoppingCartDict);
  };

  var toggleSelectSeller = function(key) {
    if ($scope.shoppingCartDict[key].selectSeller) {
      for (var key in $scope.shoppingCartDict) {
        if (!$scope.shoppingCartDict[key].selectSeller) {
          $scope.selectAllItems = false;
          break;
        } else {
          $scope.selectAllItems = true;
        }
      }
    } else {
      $scope.selectAllItems = false;
    }
  };

  $scope.backToPrev = function() {
    if (!!localStorageService.get('shoppingCartSource')) {
      if (localStorageService.get('shoppingCartSource').stateName == 'media') {
        UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to media detail page from shopping cart');
        $state.go(localStorageService.get('shoppingCartSource').stateName, {mediaId: localStorageService.get('shoppingCartSource').stateParam.mediaId});
      } else {
        if (localStorageService.get('shoppingCartSource').stateName == 'product') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to product detail page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'main.home') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to discover page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'main.settings') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to profile page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'main.shop') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to shop page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'profile') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to public profile page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'settingsSocial') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to settings social page from shopping cart');
        } else if (localStorageService.get('shoppingCartSource').stateName == 'forward-seller') {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to product detail page from shopping cart');
        } else {
          UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to ' + localStorageService.get('shoppingCartSource').stateName + ' from shopping cart');
        }

        if(localStorageService.get('shoppingCartSource').stateName == 'profile') {
          $state.go(localStorageService.get('shoppingCartSource').stateName, localStorageService.get('shoppingCartSource').stateParam);
        } else if (localStorageService.get('shoppingCartSource').stateName == 'settingsSocial') {
          $state.go(localStorageService.get('shoppingCartSource').stateName, localStorageService.get('shoppingCartSource').stateParam);
        } else if (localStorageService.get('shoppingCartSource').stateName == 'forward-seller') {
          $state.go('product', {productId: localStorageService.get('productDetail').xapp.id});
        } else {
          $state.go(localStorageService.get('shoppingCartSource').stateName);
        }
      }
    } else {
      UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Back to discover page from shopping cart 2');
      $state.go('main.home');
    }

  };

  $scope.enableUpdateProduct = function(key) {

    if ($scope.shoppingCartDict[key].updateProductEnabled == true) {
      $scope.shoppingCartDict[key].updateProductEnabled = false;
      $scope.shoppingCartDict[key].updateProductText = 'Edit';
    } else {
      $scope.shoppingCartDict[key].updateProductEnabled = true;
      $scope.shoppingCartDict[key].updateProductText = 'Done';
    }

    $scope.showSaveForLaterSuccessMsg = false;

  };

  $scope.enableUpdateAll = function() {
    if ($scope.shoppingCartCtrl.updateAllEnabled == true) {
      $scope.shoppingCartCtrl.updateAllEnabled = false;
      $scope.shoppingCartCtrl.updateAllText = 'Edit all';
      for (var key in $scope.shoppingCartDict) {
        $scope.shoppingCartDict[key].updateProductEnabled = false;
        $scope.shoppingCartDict[key].updateProductText = 'Edit';
      }
    } else {
      $scope.shoppingCartCtrl.updateAllEnabled = true;
      $scope.shoppingCartCtrl.updateAllText = 'Done';
      for (var key in $scope.shoppingCartDict) {
        $scope.shoppingCartDict[key].updateProductEnabled = true;
        $scope.shoppingCartDict[key].updateProductText = 'Done';
      }
    }
  };

  $scope.checkSellers = function(value) {
    toggleSelectSeller(value);
    toggleSelectAllSellerItems(value);
  };

  $scope.selectAllCartItems = function() {
    cartProductIds = [];
    $scope.shoppingCartInfo.subtotal = 0;

    for (var key in $scope.shoppingCartDict) {
      if ($scope.selectAllItems) {
        $scope.shoppingCartDict[key].selectSeller = true;
      } else {
        $scope.shoppingCartDict[key].selectSeller = false;
      }

      toggleSelectAllSellerItems(key);
    }
  };

  $scope.toggleCartItemSelect = function(parent, cartItem) {
    console.log(parent.key);
    var key = parent.key;
    if (!cartItem.itemSelected) {
      var index = cartProductIds.indexOf(cartItem.id);
      if (index > -1) {
        cartProductIds.splice(index, 1);
      }
      $scope.shoppingCartDict[key].selectSeller = false;
      toggleSelectSeller(key);
      $scope.shoppingCartInfo.subtotal -= UtilityService.numberParser(cartItem.price);
    } else {
      var allSellerItemsSelected = true;
      cartProductIds.push(cartItem.id);
      $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(cartItem.price);
      for(var i = 0, j = $scope.shoppingCartDict[key].length; i < j; i++) {
        if (!$scope.shoppingCartDict[key][i].itemSelected) {
          allSellerItemsSelected = false;
          break;
        }
      }
      if (allSellerItemsSelected) {
        $scope.shoppingCartDict[key].selectSeller = true;
        toggleSelectSeller(key);
      }
    }

    localStorageService.set('cartProductIds', cartProductIds);
  }

  $scope.checkout = function() {
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Checkout', 'Checkout on shopping cart page');
    $state.go('address');
  };

  $scope.openProductProp = function(shoppingCart) {
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Product property', 'Open property modal on shopping cart page');
    $scope.modal.show();
  };

  $scope.closeProductProperty = function() {
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Product property', 'Close property modal on shopping cart page');
    $scope.modal.hide();
  };

  $scope.removeItemFromCart= function(shoppingCartToDelete) {

    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Delete from cart', 'Delete product on shopping cart page');

    var shoppingCart = {
      id: localStorageService.get('shoppingCartId')
    };

    var cartProduct = {
      id: shoppingCartToDelete.id
    };

    CartService.deleteProductsFromCart(shoppingCart, cartProduct).success(function(res) {
      var index = cartProductIds.indexOf(shoppingCartToDelete.id);
      if (index > -1) {
        cartProductIds.splice(index, 1);
      }

      if ($scope.shoppingCartDict[shoppingCartToDelete.sellerName].length > 1) {
        var index = UtilityService.getMatchedFromArray($scope.shoppingCartDict[shoppingCartToDelete.sellerName], shoppingCartToDelete);
        $scope.shoppingCartDict[shoppingCartToDelete.sellerName].splice(index, 1);
      } else {
        delete $scope.shoppingCartDict[shoppingCartToDelete.sellerName];
      }

      if (shoppingCartToDelete.availability == true) {
        $scope.shoppingCartInfo.subtotal = UtilityService.numberParser($scope.shoppingCartInfo.subtotal) - shoppingCartToDelete.qty * UtilityService.numberParser(shoppingCartToDelete.prices.subtotal);
      }
      $scope.shoppingCartInfo.count -= 1;

      localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
      localStorageService.set('shoppingCart', $scope.shoppingCartDict);
      localStorageService.set('cartProductIds', cartProductIds);
    });
  };

  $scope.moveItemToSaveLater = function(shoppingCartToSave) {

    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Save for later from cart', ' Save for later on shopping cart page');

    var cartProduct = {
      id: shoppingCartToSave.id
    };

    CartService.saveForLaterFromCart(cartProduct).success(function(res) {
      var index = cartProductIds.indexOf(shoppingCartToSave.id);
      if (index > -1) {
        cartProductIds.splice(index, 1);
      }

      if ($scope.shoppingCartDict[shoppingCartToSave.sellerName].length > 1) {
        var index = UtilityService.getMatchedFromArray($scope.shoppingCartDict[shoppingCartToSave.sellerName], shoppingCartToSave);
        $scope.shoppingCartDict[shoppingCartToSave.sellerName].splice(index, 1);
      } else {
        delete $scope.shoppingCartDict[shoppingCartToSave.sellerName];
      }

      $scope.showSaveForLaterSuccessMsg = true;

      if (shoppingCartToSave.availability == true) {
        $scope.shoppingCartInfo.subtotal = UtilityService.numberParser($scope.shoppingCartInfo.subtotal) - shoppingCartToSave.qty * UtilityService.numberParser(shoppingCartToSave.prices.subtotal);
      }
      $scope.shoppingCartInfo.count -= 1;

      localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
      localStorageService.set('shoppingCart', $scope.shoppingCartDict);
      localStorageService.set('cartProductIds', cartProductIds);
      hideSaveLaterMsg();
    });
  };

  $scope.goToShop = function() {
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Shop page from shopping cart page');
    $state.go('main.shop');
  };

 $scope.productDetail = function (cartProductDetails) {
   if (productDetailLocker) {
     return;
   }
   productDetailLocker = true;

    console.log(cartProductDetails);
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Product detail page from Shopping Cart Page:  - Product: ' + cartProductDetails.productId);

    ProductDetailService.getProductDetail(cartProductDetails.productId).then(function(response){

      if (UtilityService.validateResult(response)) {
        var product = {
          brandName: response.data.payload.PRODUCT.brand.name,
          buyURL: response.data.payload.PRODUCT.buyURL,
          description: response.data.payload.PRODUCT.description,
          id: response.data.payload.PRODUCT.id,
          imageURL: response.data.payload.PRODUCT.imageURL,
          inStock: response.data.payload.PRODUCT.inStock,
          name: response.data.payload.PRODUCT.name,
          price: response.data.payload.PRODUCT.price,
          sellerName: response.data.payload.PRODUCT.seller.name,
          socialActionUserProduct: !!response.data.payload.PRODUCT.socialActionUserProduct ? response.data.payload.PRODUCT.socialActionUserProduct : null,
          mediaId: !!cartProductDetails.media ? cartProductDetails.media.id : null,
          visualTagId: !!cartProductDetails.visualTag ? cartProductDetails.visualTag.id : null,
          brand: !!response.data.payload.PRODUCT.brand ? response.data.payload.PRODUCT.brand : null,
          seller: !!response.data.payload.PRODUCT.seller ? response.data.payload.PRODUCT.seller : null
        };

        var productDetail = {
          xapp: product,
          source: 'shopping-cart'
        };

        if(response.data.payload.PRODUCT.twoTapData) {
          productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
        }

        localStorageService.set('productDetail', productDetail);
        productDetailLocker = false;
        $state.go('product', {productId: product.id});
      }
    }, function(error) {
        console.log(error);
    });
 };

  $scope.$on('$ionicView.enter', function() {
    sites = [];
    cartProductIds = [];
    var shoppingCartInfo = localStorageService.get('shoppingCartInfo');
    $scope.showSaveForLaterSuccessMsg = false;
    $scope.shoppingCartInfo = {
      count: !!shoppingCartInfo ? shoppingCartInfo.count : 0,
      // subtotal: !!shoppingCartInfo ? UtilityService.numberParser(shoppingCartInfo.subtotal) : 0
      subtotal: 0
    };
    if(!!localStorageService.get('shoppingBagDetail')){
      shoppingBagDetail = localStorageService.get('shoppingBagDetail');

      var showProductProperty = $ionicModal.fromTemplateUrl('product-property.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        console.log('modal created');
      });

      var shoppingCart = localStorageService.get('shoppingCart');
      var sellerNames = [];
      for (var key in shoppingCart) {
        Object.defineProperties(shoppingCart[key], {
          'updateProductEnabled': {
            value: false,
            writable: true
          },
          'updateProductText': {
            value: 'Edit',
            writable: true
          },
          'selectSeller' : {
            value: true,
            writable: true
          },
          'disableSeller' : {
            value: false,
            writable: true
          }
        });

        for (var i =0; i < shoppingCart[key].length; i++) {
          if (shoppingCart[key][i].availability) {
            shoppingCart[key][i].itemSelected = true;
          } else {
            shoppingCart[key].selectSeller = false;
            shoppingCart[key].disableSeller = true;
            $scope.disableAllItemsSelect = true;
            $scope.selectAllItems = false;
          }

          cartProductIds.push(shoppingCart[key][i].id);
          shoppingCart[key][i].prices.subtotal = shoppingCart[key][i].price;
          $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(shoppingCart[key][i].price);
        };

      };

      localStorageService.set('cartProductIds', cartProductIds);

      $scope.shoppingCartDict = shoppingCart;

      $scope.shoppingCartCtrl = {
        updateAllEnabled: false,
        updateAllText: 'Edit all'
      };

      console.log('in shop cart page' + $scope.shoppingCartDict);
    }
  });

  $scope.$on('$ionicView.leave', function() {
    $scope.modal.remove();
    console.log('modal removed');
  });

}]);
