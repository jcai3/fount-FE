'use strict';

angular.module('sywStyleXApp')
.controller('ProductDetailCtrl', ['$rootScope', '$scope', '$state','$stateParams', '$timeout', 'ngDialog', 'UtilityService', 'CartService', 'localStorageService', 'ProductDetailService',  function($rootScope, $scope, $state, $stateParams, $timeout, ngDialog, UtilityService, CartService, localStorageService, ProductDetailService) {
  var addToCartLocker = false;
  var relevantPostId = '';
  var pageNumber = 0;
  var apiLocker = false;
  var productDetailLocker = false;
  var pollCallCounter = 0;
  $scope.discoverMedias = [];
  $scope.hasMoreData = false;
  $scope.isDescriptionShown = true;
  $scope.isReviewShown = false;
  $scope.loadingSpinnerEnabled = false;
  $scope.emptyRelevantPosts = false;
  $scope.showReviewAlertMsg = false;
  $scope.isRelevantPostsShown = true;
  $scope.productImagesLength = 0;
  $scope.addToCartDisabled = false;
  $scope.productAddedToCart = false;
  $scope.variableObj = {
    productNotAvailable: false,
    optionsErrorMessage: '',
    allOptionsSelected: true,
    buyOnSellerSite: false, //change it to true to enable buy now from seller
    buyOnSellerMsg: ''  //message in the button like BUY NOW on ssense.com
  }

  var initializeAttr = function() {
    if (!!$scope.productDetail.twotap.addToCart && !!$scope.productDetail.twotap.addToCart.required_field_names) {
      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('fit') != -1) {
        $scope.selectedFit = $scope.productDetail.twotap.addToCart.required_field_values.fit[0];

        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('color') != -1) {
          $scope.selectedColor = $scope.selectedFit.dep.color[0];

          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
            $scope.selectedSize = $scope.selectedColor.dep.size[0];

            if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('inseam') != -1) {
              $scope.selectedInseam = $scope.selectedSize.dep.inseam[0];
            }
          }
        }
      } else {
        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('color') != -1) {
          $scope.selectedColor = $scope.productDetail.twotap.addToCart.required_field_values.color[0];

          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
            $scope.selectedSize = $scope.selectedColor.dep.size[0];
          }

          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option') == 1) {
            $scope.selectedOption = $scope.selectedColor.dep.option[0];
          }

          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('style') != -1) {
            $scope.selectedStyle = $scope.selectedColor.dep.style[0];
          }
        } else {
          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('flavor') != -1) {
            $scope.selectedFlavor = $scope.productDetail.twotap.addToCart.required_field_values.flavor[0];

            if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
              $scope.selectedSize = $scope.selectedFlavor.dep.size[0];
            }

          } else {
            if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
              $scope.selectedSize = $scope.productDetail.twotap.addToCart.required_field_values.size[0];
            }

            if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option') != -1) {
              $scope.selectedOption = $scope.productDetail.twotap.addToCart.required_field_values.option[0];
            }
          }
        }
      }

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('options') != -1) {
        $scope.selectedOptions = $scope.productDetail.twotap.addToCart.required_field_values.option[0];
      }

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 1') != -1) {
        $scope.selectedOption1 = $scope.productDetail.twotap.addToCart.required_field_values['option 1'][0];

        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 2') != -1) {
          $scope.selectedOption2 = $scope.selectedOption1.dep['option 2'][0];

          if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 3') != -1) {
            $scope.selectedOption3 = $scope.selectedOption2.dep['option 3'][0];

            if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 4') != -1) {
              $scope.selectedOption4 = $scope.selectedOption3.dep['option 4'][0];
            }
          }
        }
      }
    }
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

  var prepareProductDetail = function () {
    var productDetail = localStorageService.get('productDetail');
    console.log(productDetail);
    checkSellerQuality(productDetail);
    // getRelevantPosts(productDetail);
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

    // $scope.iphone4NotAvailable = (screen.height < 500) ? true : false;
    // $scope.iphone5NotAvailable = (screen.height < 660) ? true : false;
    // $scope.imageHeight = UtilityService.getImageHeight(1);
    var brandId = !!productDetail.xapp.brand ? productDetail.xapp.brand.id : (!!productDetail.xapp.brandId ? productDetail.xapp.brandId : null);
    var brandName = !!productDetail.xapp.brand ? productDetail.xapp.brand.name : (!!productDetail.xapp.brandName ? productDetail.xapp.brandName : productDetail.xapp.seller.name);
    $scope.productDetail = {
      availability: true,
      xapp: {
        id: productDetail.xapp.id,
        mediaId: productDetail.xapp.mediaId,
        visualTagId: productDetail.xapp.visualTagId,
        description: productDetail.xapp.description,
        category: productDetail.xapp.category,
        imageURL: productDetail.xapp.imageURL,
        brandName: brandName,
        name: UtilityService.productNameParser(productDetail.xapp.name),
        // price: !!(productDetail.xapp.salePrice < productDetail.xapp.price) ? productDetail.xapp.salePrice : productDetail.xapp.price,
        price: productDetail.xapp.price,
        finalPrice: productDetail.xapp.finalPrice,
        retailPrice: productDetail.xapp.retailPrice,
        salePrice: productDetail.xapp.salePrice,
        seller: productDetail.xapp.seller,
        affiliateURL: productDetail.xapp.buyURL,
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
      initializeAttr();
    }

    $scope.productImagesLength = $scope.productDetail.productImages.length;
    console.log('length :' + $scope.productImagesLength);
//    $scope.addToCartDisabled = false;
    $scope.productLiked = !!productDetail.xapp.socialActionUserProduct ? productDetail.xapp.socialActionUserProduct.liked : false;

  };

  var getCurrentProductDetails = function() {
    if (productDetailLocker) {
      return;
    }
    productDetailLocker = true;

     ProductDetailService.getProductDetail($stateParams.productId).then(function(response){

       if (UtilityService.validateResult(response)) {
         var product = {
//           affiliateProductId: response.data.payload.PRODUCT.affiliateProductId,
           brandName: !!response.data.payload.PRODUCT.brand ? response.data.payload.PRODUCT.brand.name : null,
           buyURL: response.data.payload.PRODUCT.buyURL,
           description: response.data.payload.PRODUCT.description,
           category: response.data.payload.PRODUCT.category,
           id: response.data.payload.PRODUCT.id,
           imageURL: response.data.payload.PRODUCT.imageURL,
           inStock: response.data.payload.PRODUCT.inStock,
           name: response.data.payload.PRODUCT.name,
           price: response.data.payload.PRODUCT.price,
           finalPrice: response.data.payload.PRODUCT.finalPrice,
          //  sellerName: response.data.payload.PRODUCT.sellerName,
           seller: !!response.data.payload.PRODUCT.seller ? response.data.payload.PRODUCT.seller : null,
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

  var productAddedNotify = function() {
    $scope.productAddedToCart = true;
    $timeout(function() {
      $scope.productAddedToCart = false;
    }, 3000);
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
      flavor: !!products.flavor ? products.flavor : null,
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

    CartService.addProductsToCart(user, product, media, visualTag, productMetadata, $scope.productQuantity, shippingMethod, originalUrl).success(function(res) {

        if (products.availability) {
            if (!!products.prices) {
              $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(products.prices.subtotal);
            } else {
              $scope.shoppingCartInfo.subtotal += products.price;
            }
        }

        productAddedNotify();
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
      flavor: !!products.flavor ? products.flavor : null,
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

    CartService.addShopProductsToCart(user, product, productMetadata, $scope.productQuantity, shippingMethod, originalUrl).success(function(res) {

        if (products.availability) {
            if (!!products.prices) {
              $scope.shoppingCartInfo.subtotal += UtilityService.numberParser(products.prices.subtotal);
            } else {
              $scope.shoppingCartInfo.subtotal += products.price;
            }
        }

        productAddedNotify();
        $scope.shoppingCartInfo.count += 1;
        localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
        $rootScope.$emit('event.updateShoppingCart', {shoppingCartInfo: $scope.shoppingCartInfo});
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

          initializeAttr();

          console.log($scope.productDetail);

          if(!!addToCart[0]) {
            if(!!$scope.productDetail.twotap.addToCart.required_field_names && $scope.productDetail.twotap.addToCart.required_field_names.length > 0 && !($scope.productDetail.twotap.addToCart.required_field_names.length == 1 && $scope.productDetail.twotap.addToCart.required_field_names[0] == 'quantity')) {
              $scope.submitProperty();
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

  $scope.productQuantity = 1;
  $scope.quantityPlus = function() {
    $scope.productQuantity++;
  };

  $scope.quantityMinus = function() {
    if ($scope.productQuantity > 1) {
      $scope.productQuantity--;
    }
  };

  $scope.toggleDescription = function() {
    if ($scope.isDescriptionShown) {
      $scope.isDescriptionShown = false;
    } else {
      $scope.isDescriptionShown = true;
    }
  };

  $scope.toggleReview = function() {
    if ($scope.isReviewShown) {
      $scope.isReviewShown = false;
    } else {
      $scope.isReviewShown = true;
    }
  };

  $scope.toggleRelevantPosts = function() {
    if ($scope.isRelevantPostsShown) {
      $scope.isRelevantPostsShown = false;
    } else {
      $scope.isRelevantPostsShown = true;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }

    getRelevantPosts($scope.productDetail);

    // $scope.$broadcast('scroll.infiniteScrollComplete');
    // $scope.$broadcast('scroll.resize');
  };

  $scope.mediaDetail = function(discoverMedia) {
    discoverMedia.source = 'product-detail';
    discoverMedia.sourceProductId = $scope.productDetail.xapp.id;
    localStorageService.set('discoverMedia', discoverMedia);
    $state.go('media', {mediaId: discoverMedia.id});
  };

  $scope.goToBrand = function() {
    if (!!$scope.productDetail.xapp.brandId) {
      $state.go('brand', {brandId: $scope.productDetail.xapp.brandId});
    }
  };

  $scope.reviewStar = function(rate) {
    if ($scope.starReviewed == rate) {
      return;
    }
    $scope.starReviewed = rate;
  };

  $scope.submitReview = function() {
    if (!!$scope.starReviewed && !!$scope.reviewComment) {
      $scope.showReviewAlertMsg = false;
      // call review api
    } else {
      $scope.showReviewAlertMsg = true;
    }
  };

  $scope.buyItNow = function() {
    alert('This function will be available soon!');
  };

  $scope.addToCart = function() {

    if (addToCartLocker) {
      return;
    }

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
      sellerName: $scope.productDetail.xapp.seller.name,
      name: $scope.productDetail.xapp.name,
      imageURL: $scope.productDetail.xapp.imageURL,
      affiliateURL: $scope.productDetail.xapp.affiliateURL,
      price: $scope.productDetail.xapp.finalPrice,
      fit: !!$scope.selectedFit ? $scope.selectedFit.text : null,
      color: !!$scope.selectedColor ? $scope.selectedColor.text : null,
      flavor: !!$scope.selectedFlavor ? $scope.selectedFlavor.text : null,
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

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('color') != -1) {
      $scope.selectedColor = $scope.selectedFit.dep.color[0];

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
        $scope.selectedSize = $scope.selectedColor.dep.size[0];

        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('inseam') != -1) {
          $scope.selectedInseam = $scope.selectedSize.dep.inseam[0];
        }
      }
    }
  };

  $scope.setSelectedColor = function(selectedColor) {
    $scope.selectedColor = selectedColor;

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
      $scope.selectedSize = $scope.selectedColor.dep.size[0];

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('inseam') != -1) {
        $scope.selectedInseam = $scope.selectedSize.dep.inseam[0];
      }
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option') == 1) {
      $scope.selectedOption = $scope.selectedColor.dep.option[0];
    }

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('style') != -1) {
      $scope.selectedStyle = $scope.selectedColor.dep.style[0];
    }
  };

  $scope.setSelectedFlavor = function(selectedFlavor) {
    $scope.selectedFlavor = selectedFlavor;

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('size') != -1) {
      $scope.selectedSize = $scope.selectedFlavor.dep.size[0];
     }
  };

  $scope.setSelectedSize = function(selectedSize) {
    $scope.selectedSize = selectedSize;

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('inseam') != -1) {
      $scope.selectedInseam = $scope.selectedSize.dep.inseam[0];
    }
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
    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 2') != -1) {
      $scope.selectedOption2 = $scope.selectedOption1.dep['option 2'][0];

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 3') != -1) {
        $scope.selectedOption3 = $scope.selectedOption2.dep['option 3'][0];

        if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 4') != -1) {
          $scope.selectedOption4 = $scope.selectedOption3.dep['option 4'][0];
        }
      }
    }
  };

  $scope.setSelectedOption2 = function(selectedOption2) {
    $scope.selectedOption2 = selectedOption2;
    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 3') != -1) {
      $scope.selectedOption3 = $scope.selectedOption2.dep['option 3'][0];

      if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 4') != -1) {
        $scope.selectedOption4 = $scope.selectedOption3.dep['option 4'][0];
      }
    }
  };

  $scope.setSelectedOption3 = function(selectedOption3) {
    $scope.selectedOption3 = selectedOption3;
    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('option 4') != -1) {
      $scope.selectedOption4 = $scope.selectedOption3.dep['option 4'][0];
    }
  };

  $scope.setSelectedOption4 = function(selectedOption4) {
    $scope.selectedOption4 = selectedOption4;
  };

  $scope.chooseProductProperty = function() {
    // $scope.modal.show();
  };

  $scope.closeProductProperty = function() {
    // $scope.modal.hide();
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

    if ($scope.productDetail.twotap.addToCart.required_field_names.indexOf('flavor') != -1 && !$scope.selectedFlavor && $scope.variableObj.allOptionsSelected) {
      $scope.variableObj.allOptionsSelected = false;
      $scope.variableObj.optionsErrorMessage = 'Please select an option for Flavor';
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

    if($scope.variableObj.allOptionsSelected) {
      $scope.addToCart();
      // $scope.modal.hide();
    }
  };

  $scope.showLoadingSpinner = function() {
    ngDialog.open({
      template: '<p>Getting updated inventory from the retailer...</p><img src="img/loader.gif">',
      plain: true,
      showClose: false
    });
      // $rootScope.xappObj.overlay = true;
  };

  $scope.hideLoadingSpinner = function() {
    ngDialog.close();
      // $rootScope.xappObj.overlay = false;
  };

  $scope.toggleFavoriteProduct = function() {

    if(!$scope.productLiked) {
        ProductDetailService.likeProduct($scope.productDetail.xapp.id).then(function(response){
          if(UtilityService.validateResult(response)) {
            $scope.productLiked = true;
          }
        });
    } else {
      ProductDetailService.unlikeProduct($scope.productDetail.xapp.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          $scope.productLiked = false;
        }
      });
    }

  };

  $scope.addItemToCart = function() {

    if(!!$scope.productDetail.twotap) {

      if(!!$scope.productDetail.twotap.addToCart.required_field_names && $scope.productDetail.twotap.addToCart.required_field_names.length > 0 && !($scope.productDetail.twotap.addToCart.required_field_names.length == 1 && $scope.productDetail.twotap.addToCart.required_field_names[0] == 'quantity')) {
        $scope.submitProperty();
      } else {
        $scope.addToCart();
      }
    } else {
      //write logic to do poll call for poll call
      $scope.showLoadingSpinner();
      pollForTwoTapData();
    }

  };

  $scope.openContactModal = function() {
    ngDialog.open({
      template: 'views/templates/fount-contact-us.html',
      showClose: true,
      className: 'ngdialog-theme-default fount-contact-us-modal',
      closeByDocument: true,
      closeByEscape: true
    });
  };

  $scope.openFeedbackModal = function() {
    ngDialog.open({
      template: 'views/templates/fount-feedback.html',
      showClose: true,
      className: 'ngdialog-theme-default fount-feedback-modal',
      closeByDocument: true,
      closeByEscape: true
    });
  };

  $scope.gotoBrandProfile = function() {
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
    window.open($scope.productDetail.xapp.affiliateURL, '_blank');
  }

  getCurrentProductDetails();

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }
}]);
