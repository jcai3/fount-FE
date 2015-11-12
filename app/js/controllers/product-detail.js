'use strict';

angular.module('sywStyleXApp')
.controller('ProductDetailCtrl', ['$scope', '$state','$stateParams', '$ionicScrollDelegate', '$ionicLoading', '$ionicModal', '$timeout', 'UtilityService', 'CartService', 'localStorageService', 'TwoTapService', 'ProductDetailService',  function($scope, $state, $stateParams, $ionicScrollDelegate, $ionicLoading, $ionicModal, $timeout, UtilityService, CartService, localStorageService, TwoTapService, ProductDetailService) {
  UtilityService.gaTrackAppView('Product Detail Page View');

  var addToCartLocker = false;
  var relevantPostId = '';
  var pageNumber = 0;
  var apiLocker = false;
  var productDetailLocker = false;
  var pollCallCounter = 0;
  $scope.discoverMedias = [];
  $scope.hasMoreData = false;
  $scope.loadingSpinnerEnabled = false;
  $scope.emptyRelevantPosts = false;
  $scope.isRelevantPostsShown = true;
  $scope.productImagesLength = 0;
  $scope.postImageHeight = UtilityService.getImageHeight(2) + 43;
  $scope.addToCartDisabled = false;
  $scope.variableObj = {
    productNotAvailable: false,
    optionsErrorMessage: '',
    allOptionsSelected: true,
    buyOnSellerSite: false, //change it to true to enable buy now from seller
    buyOnSellerMsg: ''  //message in the button like BUY NOW on ssense.com
  }

  var prepareProductDetail = function () {
    console.log('inside prepareProductDetail function');
    var productDetail = localStorageService.get('productDetail');
    console.log(productDetail);
    checkSellerQuality(productDetail);
    getRelevantPosts(productDetail);
    var siteId  = '';
    var sites = [];
    if(!!productDetail.twotap) {
      for (var key in productDetail.twotap.sites) {
        siteId = key;
        sites.push(productDetail.twotap.sites[key]);
      }
    }

    var productMD5 = "";
    var shippingOptions = {};
    var addToCart = [];
    var productImages = [];
    if (!!sites[0]) {
      for (var key in sites[0].add_to_cart) {
        productMD5 = key;
        addToCart.push(sites[0].add_to_cart[key]);
        shippingOptions = sites[0].shipping_options;
      }

      if(!!sites[0].failed_to_add_to_cart && !$scope.variableObj.buyOnSellerSite) {
        console.log('failed_to_add_to_cart');
        $scope.variableObj.productNotAvailable = true;
        $scope.addToCartDisabled = true;
      }
    }

    if(!!addToCart[0]) {
      if(!!addToCart[0].alt_images) {
        for (var idx = 0, len = addToCart[0].alt_images.length; idx < len; idx++){
          productImages.push(addToCart[0].alt_images[idx]);
        }
      } else {
        productImages.push(productDetail.xapp.imageURL);
      }

    } else {
      productImages.push(productDetail.xapp.imageURL);
    }

    $scope.iphone4NotAvailable = (screen.height < 500) ? true : false;
    $scope.iphone5NotAvailable = (screen.height < 660) ? true : false;
    $scope.imageHeight = UtilityService.getImageHeight(1);
    var brandId = !!productDetail.xapp.brand ? productDetail.xapp.brand.id : (!!productDetail.xapp.brandId ? productDetail.xapp.brandId : null);
    var brandName = !!productDetail.xapp.brand ? productDetail.xapp.brand.name : (!!productDetail.xapp.brandName ? productDetail.xapp.brandName : productDetail.xapp.sellerName);
    $scope.productDetail = {
      availability: true,
      xapp: {
        id: productDetail.xapp.id,
        mediaId: productDetail.xapp.mediaId,
        visualTagId: productDetail.xapp.visualTagId,
        description: productDetail.xapp.description,
        imageURL: productDetail.xapp.imageURL,
        brandName: brandName,
        name: UtilityService.productNameParser(productDetail.xapp.name),
        price: !!(productDetail.xapp.salePrice < productDetail.xapp.price) ? productDetail.xapp.salePrice : productDetail.xapp.price,
        retailPrice: productDetail.xapp.retailPrice,
        salePrice: productDetail.xapp.salePrice,
        seller: productDetail.xapp.sellerName,
        affiliateURL: productDetail.xapp.affiliateURL,
        brandId: brandId
      },

      productImages: productImages
    };

    if(!!productDetail.twotap) {
      $scope.productDetail.twotap = {
        cartId: productDetail.twotap.cart_id,
        siteId: siteId,
        productMD5: productMD5,
        addToCart: addToCart[0],
        shippingOptions: shippingOptions
      };
    }

    $scope.productImagesLength = $scope.productDetail.productImages.length;
    console.log('length :' + $scope.productImagesLength);
//    $scope.addToCartDisabled = false;
    $scope.productLiked = !!productDetail.xapp.socialActionUserProduct ? productDetail.xapp.socialActionUserProduct.liked : false;

  };

  var checkSellerQuality = function(productDetail) {
    console.log('inside the seller quality');
    if(!!productDetail.xapp.seller) {
      console.log(productDetail.xapp.seller.quality);
      if(productDetail.xapp.seller.quality == 'LOW') {
        $scope.variableObj.buyOnSellerSite = true;
        $scope.variableObj.buyOnSellerMsg = 'BUY NOW on ' + productDetail.xapp.seller.name;
      }
    }
  };

  var getCurrentProductDetails = function() {
    if (productDetailLocker) {
      return;
    }
    productDetailLocker = true;
    UtilityService.gaTrackAppEvent('Shopping Cart Page', 'Click', 'Product detail page from Shopping Cart Page:  - Product: ' + $stateParams.productId);

     ProductDetailService.getProductDetail($stateParams.productId).then(function(response){

       if (UtilityService.validateResult(response)) {
         var product = {
//           affiliateProductId: response.data.payload.PRODUCT.affiliateProductId,
           brandName: !!response.data.payload.PRODUCT.brand ? response.data.payload.PRODUCT.brand.name : null,
           buyURL: response.data.payload.PRODUCT.buyURL,
           description: response.data.payload.PRODUCT.description,
           id: response.data.payload.PRODUCT.id,
           imageURL: response.data.payload.PRODUCT.imageURL,
           inStock: response.data.payload.PRODUCT.inStock,
           name: response.data.payload.PRODUCT.name,
           price: response.data.payload.PRODUCT.price,
           sellerName: response.data.payload.PRODUCT.sellerName,
           socialActionUserProduct: !!response.data.payload.PRODUCT.socialActionUserProduct ? response.data.payload.PRODUCT.socialActionUserProduct : null,
           mediaId: !!response.data.payload.PRODUCT.media ? response.data.payload.PRODUCT.media.id : null,
           visualTagId: !!response.data.payload.PRODUCT.visualTag ? response.data.payload.PRODUCT.visualTag.id : null,
           brandId: !!response.data.payload.PRODUCT.brand ? response.data.payload.PRODUCT.brand.id : null
         };
         var productDetail = {
           xapp: product,
           source: 'product-detail'
         };

         if(response.data.payload.PRODUCT.twoTapData) {
           productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
         }

         localStorageService.set('productDetail', productDetail);
         productDetailLocker = false;
         console.log('from 1');
         prepareProductDetail();
       }
     }, function(error) {
         console.log(error);
     });
  };

  var getRelevantPosts = function(revelantPostPD) {
    $scope.loadingSpinnerEnabled = true;
    if (apiLocker) {
      return;
    }

    apiLocker = true;
    relevantPostId = revelantPostPD.xapp.id;
    console.log(relevantPostId);

    ProductDetailService.getRelevantPosts(pageNumber, relevantPostId).then(function(result){
//    UserMediaService.getLatestMedia(0).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
          if(pageNumber == 0) {
            $scope.emptyRelevantPosts = true;
          }

        } else {
          pageNumber++;
          $scope.hasMoreData = true;
          $scope.emptyRelevantPosts = false;
          var discoverMedias = result.data.payload.MEDIAS;
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }
      $scope.loadingSpinnerEnabled = false;
      apiLocker = false;

    }, function(error) {
      console.log('error');
      $scope.loadingSpinnerEnabled = false;
    });
  };

  var addProductsToCart = function(products) {
    var user = {
      id: localStorageService.get('userId')
    };
    var product = {
      id: products.productId
    };

    var productMetadata = {
      product: {id: products.productId},
      option: products.option,
      fit: products.fit,
      color: products['color'],
      size: products['size'],
      options: products.options,
      inseam: products.inseam,
      style: products.style,
      option1: products.option1,
      option2: products.option2,
      option3: products.option3,
      option4: products.option4,
      price: products.price,
      availability: !!products.availability ? 'AVAILABLE' : 'UNAVAILABLE'
    };
    var quantity= 1;
    var shippingMethod = (!!products.shippingOptions && !!products.shippingOptions.cheapest) ? products.shippingOptions.cheapest : '';
    var media = {id: products.mediaId };
    var visualTag = {id: products.visualTagId};
    var originalUrl = products.buyURL;

    CartService.addProductsToCart(user, product, media, visualTag, productMetadata, quantity, shippingMethod, originalUrl).success(function(res) {

        if (products.availability) {
            if (!!products.prices) {
              $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(products.prices.subtotal);
            } else {
              $scope.shoppingCartInfo.subtotal += products.price;
            }
        }

        $scope.shoppingCartInfo.count += 1;
        localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
    });
  };

  var addShopProductsToCart = function(products) {
    var user = {
      id: localStorageService.get('userId')
    };
    var product = {
      id: products.productId
    };

    var productMetadata = {
      product: {id: products.productId},
      option: products.option,
      fit: products.fit,
      color: products['color'],
      size: products['size'],
      options: products.options,
      inseam: products.inseam,
      style: products.style,
      option1: products.option1,
      option2: products.option2,
      option3: products.option3,
      option4: products.option4,
      price: products.price,
      availability: !!products.availability ? 'AVAILABLE' : 'UNAVAILABLE'
    };
    var quantity= 1;
    var shippingMethod = (!!products.shippingOptions && !!products.shippingOptions.cheapest) ? products.shippingOptions.cheapest : '';
//    var media = {id: products.mediaId };
//    var visualTag = {id: products.visualTagId};
    var originalUrl = products.buyURL;

    CartService.addShopProductsToCart(user, product, productMetadata, quantity, shippingMethod, originalUrl).success(function(res) {

        if (products.availability) {
            if (!!products.prices) {
              $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(products.prices.subtotal);
            } else {
              $scope.shoppingCartInfo.subtotal += products.price;
            }
        }

        $scope.shoppingCartInfo.count += 1;
        localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
    });
  };

  var pollForTwoTapData = function() {

    pollCallCounter++;

    var timer = $timeout(function() {
      ProductDetailService.getProductDetail($stateParams.productId).then(function(response){

        // check why triple equals work on local but not on qa
        if (!!response.data.payload.PRODUCT.twoTapData) {
          $scope.variableObj.productNotAvailable = false;
          $scope.hideLoadingSpinner();
          $timeout.cancel(timer);
          var siteId  = '';
          var sites = [];
          for (var key in response.data.payload.PRODUCT.twoTapData.sites) {
            siteId = key;
            sites.push(response.data.payload.PRODUCT.twoTapData.sites[key]);
          }

          var productMD5 = "";
          var shippingOptions = {};
          var addToCart = [];
          if(!!sites[0]) {
            for (var key in sites[0].add_to_cart) {
              var productMD5 = key;
              addToCart.push(sites[0].add_to_cart[key]);
              shippingOptions = sites[0].shipping_options;
            }

            if(!!sites[0].failed_to_add_to_cart) {
              console.log('failed_to_add_to_cart');
              $scope.variableObj.productNotAvailable = true;
              $scope.addToCartDisabled = true;
            }
          }
          $scope.productDetail.twotap = {
            cartId: response.data.payload.PRODUCT.twoTapData.cart_id,
            siteId: siteId,
            productMD5: productMD5,
            addToCart: addToCart[0],
            shippingOptions: shippingOptions
          };

          console.log($scope.productDetail);

          if(!!addToCart[0]) {
            if(!!$scope.productDetail.twotap.addToCart.required_field_names && $scope.productDetail.twotap.addToCart.required_field_names.length > 0 && !($scope.productDetail.twotap.addToCart.required_field_names.length == 1 && $scope.productDetail.twotap.addToCart.required_field_names[0] == 'quantity')) {
              $scope.chooseProductProperty();
            } else {
              $scope.addToCart();
            }
          }

        }  else if (pollCallCounter < 3){
          console.log('still_processing');
          pollForTwoTapData();
        } else {
          $scope.hideLoadingSpinner();
          $timeout.cancel(timer);
          if(!$scope.variableObj.buyOnSellerSite) {
            $scope.variableObj.productNotAvailable = true;
            $scope.addToCartDisabled = true;
          }
        }
      });
    }, 5000);

  };

  $scope.backToPrev = function() {

    var viewHistory = localStorageService.get('trackHistory');
    if (viewHistory.length > 1) {
      var prevState = viewHistory.pop();
    } else {
      var prevState = viewHistory[0];
    }

    if (prevState.source == 'media') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to media detail page from product detail');
      localStorageService.remove('productDetail');
//      localStorageService.remove('discoverMedia');
      localStorageService.set('trackHistory', viewHistory);
      $state.go('media', {mediaId: prevState.id});
    } else if (prevState.source == 'shop') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to shop page from product detail');
      localStorageService.remove('productDetail');
      localStorageService.remove('trackHistory');
      $state.go('main.shop');
    } else if (prevState.source == 'settings') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to profile page from product detail');
      localStorageService.remove('productDetail');
      localStorageService.remove('trackHistory');
      $state.go('main.settings');
    } else if (prevState.source == 'brand-profile') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to brand profile page from product detail');
      localStorageService.remove('productDetail');
      localStorageService.set('trackHistory', viewHistory);
//      localStorageService.remove('trackHistory');
      // $state.go('profile', {Id:localStorageService.get('profileId'), type:'brand',source: 0});
        $state.go('profile', {Id:prevState.id, type:'brand',source: 0});
    } else if (prevState.source == 'user-profile') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to user profile page from product detail');
      localStorageService.remove('productDetail');
      // localStorageService.remove('trackHistory');
      localStorageService.set('trackHistory', viewHistory);
      // $state.go('profile', {Id:localStorageService.get('profileId'), type:'user',source: 0});
      $state.go('profile', {Id:prevState.id, type:'user',source: 0});
    } else if (prevState.source == 'shopping-cart') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to shopping cart page from product detail');
      localStorageService.remove('productDetail');
      localStorageService.remove('trackHistory');
      $state.go('cart');
    } else if (prevState.source == 'my-brands') {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to brands page - my brands from product detail');
      localStorageService.remove('productDetail');
      localStorageService.remove('trackHistory');
      $state.go('main.brands');
    } else {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Back to discover page from product detail');
      localStorageService.remove('productDetail');
      localStorageService.set('taggedProducts', []);
      $state.go('main.home');
      localStorageService.remove('trackHistory');
    }

  };

  $scope.toggleDescription = function() {
    if ($scope.isDescriptionShown) {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Toggle', 'Hide description on product detail page');
      $scope.isDescriptionShown = false;
      $ionicScrollDelegate.resize();
    } else {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Toggle', 'Show description on product detail page');
      $scope.isDescriptionShown = true;
      $ionicScrollDelegate.resize();
    }
  };

  $scope.toggleRelevantPosts = function() {
    if ($scope.isRelevantPostsShown) {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Toggle', 'Hide relevant posts on product detail page');
      $scope.isRelevantPostsShown = false;
      $ionicScrollDelegate.resize();
    } else {
      UtilityService.gaTrackAppEvent('Product Detail Page', 'Toggle', 'Show relevant posts on product detail page');
      $scope.isRelevantPostsShown = true;
      $ionicScrollDelegate.resize();
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }

    UtilityService.gaTrackAppEvent('Product Detail Page', 'Scroll down', 'Load more relevant posts on product detail page');
    getRelevantPosts($scope.productDetail);

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.mediaDetail = function(discoverMedia) {
    UtilityService.gaTrackAppEvent('Product Detail Page', 'Click', 'Media detail page from product detail - Media: ' + discoverMedia.id);

    discoverMedia.source = 'product-detail';
    discoverMedia.sourceProductId = $scope.productDetail.xapp.id;
    localStorageService.set('discoverMedia', discoverMedia);
    $state.go('media', {mediaId: discoverMedia.id});
  };

  $scope.buyItNow = function() {
    alert('This function will be available soon!');
  };

  $scope.addToCart = function() {

    if (addToCartLocker) {
      return;
    }

    UtilityService.gaTrackAppEvent('Product Detail Page', 'Add to cart', 'Add product to cart on product detail page');

    addToCartLocker = true;
    var productBuyURL = '';
    var productShippingOption = {
          cheapest: "5-10 Business Days"
        };
    // update cart info immediately, also needs to update db based on api support

    if(!!$scope.productDetail.twotap) {
      var options = {
        cart_id: $scope.productDetail.twotap.cartId,
        fields: {}
      };

      options.fields[$scope.productDetail.twotap.siteId] = {
        addToCart: {}
      };

      productBuyURL = !!$scope.productDetail.twotap.addToCart.url ? $scope.productDetail.twotap.addToCart.url : $scope.productDetail.twotap.addToCart.original_url;
      productShippingOption = $scope.productDetail.twotap.shippingOptions;

      // needs to call cart api for verifying if it's in our db or not
      if (!!$scope.productDetail.twotap.addToCart.required_field_names && $scope.productDetail.twotap.addToCart.required_field_names.length > 0) {

        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('color') != -1) {
          options.fields[$scope.productDetail.twotap.siteId].addToCart[$scope.productDetail.twotap.productMD5] = {
            // color: $scope.selectedColor.text
          };
        }
        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
          options.fields[$scope.productDetail.twotap.siteId].addToCart[$scope.productDetail.twotap.productMD5] = {
            // size: $scope.selectedSize.text
          };
        }
      }
    } else {
      productBuyURL = UtilityService.cjProductUrlParser($scope.productDetail.xapp.affiliateURL);
    }

    var shoppingBagObj = {
      availability: $scope.productDetail.availability,
      productId: $scope.productDetail.xapp.id,
      mediaId: $scope.productDetail.xapp.mediaId,
      visualTagId: $scope.productDetail.xapp.visualTagId,
      sellerName: $scope.productDetail.xapp.seller,
      name: $scope.productDetail.xapp.name,
      imageURL: $scope.productDetail.xapp.imageURL,
      affiliateURL: $scope.productDetail.xapp.affiliateURL,
      price: $scope.productDetail.xapp.price,
      fit: !!$scope.selectedFit ? $scope.selectedFit.text : null,
      color: !!$scope.selectedColor ? $scope.selectedColor.text : null,
      size: !!$scope.selectedSize ? $scope.selectedSize.text : null,
      option: !!$scope.selectedOption ? $scope.selectedOption.text : null,
      options: !!$scope.selectedOptions ? $scope.selectedOptions.text : null,
      inseam: !!$scope.selectedInseam ? $scope.selectedInseam.text : null,
      style: !!$scope.selectedStyle ? $scope.selectedStyle.text : null,
      option1: !!$scope.selectedOption1 ? $scope.selectedOption1.text : null,
      option2: !!$scope.selectedOption2 ? $scope.selectedOption2.text : null,
      option3: !!$scope.selectedOption3 ? $scope.selectedOption3.text : null,
      option4: !!$scope.selectedOption4 ? $scope.selectedOption4.text : null,
      shippingOptions: productShippingOption,
      buyURL: productBuyURL,
      qty: 1
    };

    console.log(shoppingBagObj);

  if (!!$scope.productDetail.xapp.mediaId &&!!$scope.productDetail.xapp.visualTagId ) {
      addProductsToCart(shoppingBagObj);
    } else {
      addShopProductsToCart(shoppingBagObj);
    }

    $scope.addToCartDisabled = true;
    addToCartLocker = false;
  };

  $scope.setSelectedFit = function(selectedFit) {
    $scope.selectedFit = selectedFit;
  };

  $scope.setSelectedColor = function(selectedColor) {
    $scope.selectedColor = selectedColor;
  };

  $scope.setSelectedSize = function(selectedSize) {
    $scope.selectedSize = selectedSize;
  };

  $scope.setSelectedOption = function(selectedOption) {
    $scope.selectedOption = selectedOption;
  };

  $scope.setSelectedOptions = function(selectedOptions) {
    $scope.selectedOptions = selectedOptions;
  };

  $scope.setSelectedInseam = function(selectedInseam) {
    $scope.selectedInseam = selectedInseam;
  };

  $scope.setSelectedStyle = function(selectedStyle) {
    $scope.selectedStyle = selectedStyle;
  };

  $scope.setSelectedOption1 = function(selectedOption1) {
    $scope.selectedOption1 = selectedOption1;
  };

  $scope.setSelectedOption2 = function(selectedOption2) {
    $scope.selectedOption2 = selectedOption2;
  };

  $scope.setSelectedOption3 = function(selectedOption3) {
    $scope.selectedOption3 = selectedOption3;
  };

  $scope.setSelectedOption4 = function(selectedOption4) {
    $scope.selectedOption4 = selectedOption4;
  };

  $scope.chooseProductProperty = function() {
    UtilityService.gaTrackAppEvent('Product Detail Page', 'Product property', 'Open property modal on product detail page');
    $scope.modal.show();
  };

  $scope.closeProductProperty = function() {
    UtilityService.gaTrackAppEvent('Product Detail Page', 'Product property', 'Close property modal on product detail page');
    $scope.modal.hide();
  };

  $scope.submitProperty = function() {

    $scope.variableObj.allOptionsSelected = true;

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('fit') != -1 && !$scope.selectedFit && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Fit';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('color') != -1 && !$scope.selectedColor && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Color';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1 && !$scope.selectedSize && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Size';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option') == 1 && !$scope.selectedOption && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Option';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('options') != -1 && !$scope.selectedOptions && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Options';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('inseam') != -1 && !$scope.selectedInseam && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Inseam';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('style') != -1 && !$scope.selectedStyle && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Style';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 1') != -1 && !$scope.selectedOption1 && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Option 1';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 2') != -1 && !$scope.selectedOption2 && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Option 2';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 3') != -1 && !$scope.selectedOption3 && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Option 3';
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 4') != -1 && !$scope.selectedOption4 && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Option 4';
    }

    UtilityService.gaTrackAppEvent('Product Detail Page', 'Product property', 'Submit product property on product detail page');
    if($scope.variableObj.allOptionsSelected) {
      $scope.addToCart();
      $scope.modal.hide();
    }
  };

  $scope.showLoadingSpinner = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner><p>Getting updated inventory from the retailer</p>'
    });
  };

  $scope.hideLoadingSpinner = function() {
    $ionicLoading.hide();
  };

  $scope.toggleFavoriteProduct = function() {

    if(!$scope.productLiked) {
        ProductDetailService.likeProduct($scope.productDetail.xapp.id).then(function(response){
          if(UtilityService.validateResult(response)) {
            UtilityService.gaTrackAppEvent('Product Detail Page', 'Like product', 'Like product id - ' + $scope.productDetail.xapp.id + ' on product detail page');
            $scope.productLiked = true;
          }
        });
    } else {
      ProductDetailService.unlikeProduct($scope.productDetail.xapp.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Product Detail Page', 'Unlike product', 'Unlike product id - ' + $scope.productDetail.xapp.id + ' on product detail page');
          $scope.productLiked = false;
        }
      });
    }

  };

  $scope.addItemToCart = function() {

    if(!!$scope.productDetail.twotap) {

      if(!!$scope.productDetail.twotap.addToCart.required_field_names && $scope.productDetail.twotap.addToCart.required_field_names.length > 0 && !($scope.productDetail.twotap.addToCart.required_field_names.length == 1 && $scope.productDetail.twotap.addToCart.required_field_names[0] == 'quantity')) {
        $scope.chooseProductProperty();
      } else {
        $scope.addToCart();
      }
    } else {
      //write logic to do poll call for poll call
      $scope.showLoadingSpinner();
      pollForTwoTapData();
  //      $scope.addToCart();   //temp to check the existing flow is working.
    }

  };

  $scope.gotoBrandProfile = function() {
    UtilityService.gaTrackAppEvent('Product Detail Page', 'Click Brand Name', 'Go to Brand Profile page from product detail page');
    if(!!$scope.productDetail.xapp.brandId) {
      var trackHistory = localStorageService.get('trackHistory');
      var sourceObj = {
        source: 'product-detail',
        id: $stateParams.productId
      };
      trackHistory.push(sourceObj);
      localStorageService.set('trackHistory', trackHistory);
      $state.go('profile', {Id: $scope.productDetail.xapp.brandId, type: 'brand', source: 'product-detail'});
    }
  };

  $scope.redirectToSeller = function() {
    console.log('go to seller webpage');
    console.log($scope.productDetail);
    // window.open("https://www.ssense.com");
    // UtilityService.openSellerSite('https://www.ssense.com', 'ssense'); // first arg is buy url, second is title
    $state.go('forward-seller');
  }

  $scope.$on('$ionicView.enter', function() {
    addToCartLocker = false;

    if(!!localStorageService.get('productDetail') && !!localStorageService.get('productDetail').source) {
        if(!!localStorageService.get('trackHistory')) {
          var trackHistory = localStorageService.get('trackHistory')
        } else {
          var trackHistory = [];
        }

        var prevSource = {
          source: localStorageService.get('productDetail').source,
          id: (localStorageService.get('productDetail').source == 'media') ? localStorageService.get('discoverMedia').id : null
        }

        if (trackHistory.length >= 1) {
          var lastSavedState = trackHistory[trackHistory.length - 1];
          if (lastSavedState.source !== prevSource.source && lastSavedState.id !== prevSource.id) {
            trackHistory.push(prevSource);
            localStorageService.set('trackHistory', trackHistory);
          }
        } else {
          trackHistory.push(prevSource);
          localStorageService.set('trackHistory', trackHistory);
        }
    }

    if (!!localStorageService.get('productDetail')) {
      console.log('from 0');
      prepareProductDetail();
//      getRelevantPosts(localStorageService.get('productDetail'));
    } else {
      getCurrentProductDetails();
    }

    if (!!localStorageService.get('shoppingCartInfo')) {
      $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
    } else {
      $scope.shoppingCartInfo = {
        count: 0,
        subtotal: 0
      };
    }

    var showProductProperty = $ionicModal.fromTemplateUrl('product-property.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      console.log('modal created');
    });

  });

  $scope.$on('$ionicView.leave', function() {
    $scope.modal.remove();
    console.log('modal removed');
  });

}]);
