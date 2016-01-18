'use strict';

angular.module('sywStyleXApp')
.controller('BrandsCtrl', ['$scope', '$state', '$timeout', '$ionicLoading', '$location', '$stateParams', '$ionicScrollDelegate', 'localStorageService', 'UtilityService', 'BrandsService', 'SocialActionService', 'ProductDetailService', 'TwoTapService', function($scope, $state, $timeout, $ionicLoading, $location, $stateParams, $ionicScrollDelegate, localStorageService, UtilityService, BrandsService, SocialActionService, ProductDetailService, TwoTapService) {
  UtilityService.gaTrackAppView('Brands Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var myBrandsPageNumber = 1;
  var myBrandsApiLocker = false;
  var myBrandsHasMoreData = true;
  var recommendedBrandsPageNumber = 1;
  var recommendedBrandsApiLocker = false;
  var recommendedBrandsHasMoreData = true;
  var aToZbrandsPageNumber = 1;
  var aToZbrandsApiLocker = false;
  var aToZbrandsHasMoreData = true;
  var productDetailLocker = false;

  $scope.myBrands = [];
  $scope.myBrandsIsEmpty = false;
  $scope.recommendedBrands = [];
  $scope.allBrands = {};
  $scope.activeIndexedList = '0-9';
  $scope.aToZbrands = [];
  $scope.brandSocialAction = {};

  $scope.alphabet = ['0-9', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  $scope.iphone4Height = (screen.height < 500) ? true : false;
  $scope.iphone5Height = (screen.height > 500 && screen.height < 600) ? true : false;
  $scope.iphone6Height = (screen.height > 600 && screen.height < 700) ? true : false;
  $scope.iphone6PlusHeight = (screen.height > 700) ? true : false;

  var showLoadingSpinner = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner>'
    });
  };

  var hideLoadingSpinner = function() {
    $ionicLoading.hide();
  };

  var getMyBrands = function() {
    if (myBrandsApiLocker || !myBrandsHasMoreData) {
      return;
    }

    myBrandsApiLocker = true;

    BrandsService.getMyBrands(myBrandsPageNumber).then(function(res) {
      if (UtilityService.validateResult(res)) {
        if (res.data.payload.BRANDS.length === 0) {
          myBrandsHasMoreData = false;
        } else {
          myBrandsPageNumber++;
          myBrandsHasMoreData = true;
          var myBrands = res.data.payload.BRANDS;
          for (var i=0, j=myBrands.length; i<j; i++) {
            myBrands[i] = {
              brand: myBrands[i],
              count: !!(res.data.payload.BRANDS_PRODUCT_COUNT[myBrands[i].id] == 1) ? '1 Product' : res.data.payload.BRANDS_PRODUCT_COUNT[myBrands[i].id] + ' Products',
              products: res.data.payload.BRAND_PRODUCTS[myBrands[i].id],
              followStatus: res.data.payload.BRAND_SOCIAL_ACTION[myBrands[i].id].follow
            };
          }
          $scope.myBrands.push.apply($scope.myBrands, myBrands);
        }
      } else {
        myBrandsHasMoreData = false;
        console.log('error');
      }

      if ($scope.myBrands.length > 0) {
        $scope.myBrandsIsEmpty = false;
      } else {
        $scope.myBrandsIsEmpty = true;
      }

      myBrandsApiLocker = false;
    });
  };

  var getRecommendedBrands = function() {

  };

  var getAllBrands = function() {
    BrandsService.getAllBrands().then(function(res) {
      if (UtilityService.validateResult(res)) {
        $scope.allBrands = res.data.payload.BRANDS;
        $scope.brandSocialAction = res.data.payload.BRAND_SOCIAL_ACTION;
      }
    });
  };

  var getBrandsAtoZ = function() {
    if (aToZbrandsApiLocker || !aToZbrandsHasMoreData) {
      return;
    }

    aToZbrandsApiLocker = true;

    var index = $scope.activeIndexedList;
    if ($scope.activeIndexedList == '0-9') {
      index = '0';
    }

    BrandsService.getBrandsAtoZ(index, aToZbrandsPageNumber).then(function(res) {
      if (UtilityService.validateResult(res)) {
        if (res.data.payload.BRANDS.length === 0) {
          aToZbrandsHasMoreData = false;
        } else {
          aToZbrandsPageNumber++;
          aToZbrandsHasMoreData = true;
          var aToZbrands = res.data.payload.BRANDS;
          var brandSocialAction = res.data.payload.BRANDS_FOLLOWED;
          $scope.aToZbrands.push.apply($scope.aToZbrands, aToZbrands);
          angular.extend($scope.brandSocialAction, brandSocialAction);
        }
      } else {
       aToZbrandsHasMoreData = false;
       console.log('error');
     }

     aToZbrandsApiLocker = false;
    });
  };

  $scope.brandDetail = function(brand) {
    if ($scope.brandMode == 0) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Click', 'Brand detail page from brands page - my brands');
    } else if ($scope.brandMode == 1) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Click', 'Brand detail page from brands page - recommended brands');
    } else if ($scope.brandMode == 2) {
      localStorageService.set('activeBrandIndexedList', $scope.activeIndexedList);
      UtilityService.gaTrackAppEvent('Brands Page', 'Click', 'Brand detail page from brands page - all brands');
    }

    $state.go('profile', {Id: brand.id, type: 'brand', source: $scope.brandMode});
  };

  $scope.productDetail = function(product) {
    if (productDetailLocker) {
      return;
    }
    productDetailLocker = true;

    UtilityService.gaTrackAppEvent('Brands Page', 'Click', 'Product detail page from brands page - My Brands - Product: ' + product.id);

    ProductDetailService.getProductDetail(product.id).then(function(response){
      if (UtilityService.validateResult(response)) {
        console.log(response);
        product.affiliateURL = decodeURIComponent(product.buyURL);
        product.mediaId = null;
        product.visualTagId = null;
        product.brandName = !!product.brand ? product.brand.name : null;
        product.sellerName = !!product.seller ? product.seller.name : null;
        var productDetail = {
          xapp: product,
          source: 'my-brands'
        };

        if(response.data.payload.PRODUCT.twoTapData) {
          productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
        }

        localStorageService.set('productDetail', productDetail);
        productDetailLocker = false;

        $state.go('product', {productId: product.id});

        // if (!!response.data.payload.PRODUCT.twoTapData) {
        //   product.affiliateURL = decodeURIComponent(product.buyURL);
        //   product.mediaId = null;
        //   product.visualTagId = null;
        //   product.brandName = !!product.brand ? product.brand.name : null;
        //   product.sellerName = !!product.seller ? product.seller.name : null;
        //   var productDetail = {
        //     xapp: product,
        //     twotap: response.data.payload.PRODUCT.twoTapData,
        //     source: 'my-brands'
        //   };
        //   localStorageService.set('productDetail', productDetail);
        //   productDetailLocker = false;
        //
        //   $state.go('product', {productId: product.id});
        //
        // } else {
        //
        //   var productURL = UtilityService.cjProductUrlParser(product.buyURL);
        //   var options = {
        //     products: [productURL]
        //   };
        //
        //   TwoTapService.cart(options).success(function(response) {
        //     var options = {
        //       cart_id: response.cart_id
        //     };
        //
        //     TwoTapService.cartStatus(options).success(function(response) {
        //       product.affiliateURL = decodeURIComponent(product.buyURL);
        //       product.mediaId = null;
        //       product.visualTagId = null;
        //       product.brandName = !!product.brand ? product.brand.name : null;
        //       product.sellerName = !!product.seller ? product.seller.name : null;
        //       var productDetail = {
        //         xapp: product,
        //         twotap: response,
        //         source: 'my-brands'
        //       };
        //       localStorageService.set('productDetail', productDetail);
        //       productDetailLocker = false;
        //
        //       $state.go('product', {productId: product.id});
        //     });
        //   });
        // }
      }
    }, function(error) {
        console.log(error);
    });
  };

  $scope.unfollowBrand = function(followedBrand, index) {
    SocialActionService.unfollowBrand(followedBrand.brand.id).then(function(res) {
      if (UtilityService.validateResult(res)) {
        UtilityService.gaTrackAppEvent('Brands Page', 'Unfollow brand', 'Unfollow brand ' + followedBrand.brand.id + ' on brands page - my brands');
        $scope.myBrands.splice(index, 1);
        if ($scope.myBrands.length == 0) {
          $scope.myBrandsIsEmpty = true;
        } else {
          $scope.myBrandsIsEmpty = false;
        }
      }
    });
  };

  $scope.toggleFollowBrand = function(id) {
    if (!!$scope.brandSocialAction[id] && $scope.brandSocialAction[id].follow) {
      SocialActionService.unfollowBrand(id).then(function(res) {
        if (UtilityService.validateResult(res)) {
          var brandId = res.data.payload.BRAND.id;
          UtilityService.gaTrackAppEvent('Brands Page', 'Unfollow brand', 'Unfollow brand ' + brandId + ' on brands page - all brands');
          $scope.brandSocialAction[brandId].follow = false;
        }
      });
    } else {
      SocialActionService.followBrand(id).then(function(res) {
        if (UtilityService.validateResult(res)) {
          var brandId = res.data.payload.BRAND.id;
          UtilityService.gaTrackAppEvent('Brands Page', 'Follow brand', 'Follow brand ' + brandId + ' on brands page - all brands');
          $scope.brandSocialAction[brandId] = {
            follow: true
          };
        }
      });
    }
  };

  $scope.gotoList = function(id) {
    UtilityService.gaTrackAppEvent('Brands Page', 'Click', 'Go to list - ' + id + ' on brands page');
    $location.hash(id);
    $ionicScrollDelegate.anchorScroll();
  };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.getIndexedList = function(index) {
    // if ($scope.aToZbrands.length > 0 && $scope.activeIndexedList == index) {
    //   return;
    // }

    aToZbrandsPageNumber = 1;
    aToZbrandsApiLocker = false;
    aToZbrandsHasMoreData = true;
    $scope.activeIndexedList = index;
    $scope.aToZbrands = [];
    $scope.brandSocialAction = {};
    getBrandsAtoZ();
  };

  $scope.switchMode = function(mode) {
    if ($scope.brandMode == mode) {
      return;
    }

    // showLoadingSpinner();
    if (mode === 0) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Switch', 'Switch to my brands on brands page');
      myBrandsPageNumber = 1;
      myBrandsApiLocker = false;
      myBrandsHasMoreData = true;
      $scope.myBrands = [];
      $scope.brandMode = 0;
      getMyBrands();
      // hideLoadingSpinner();
      // $timeout(function() {
      //   hideLoadingSpinner();
      // }, 3000);
    }
    if (mode === 1) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Switch', 'Switch to recommended brands on brands page');
      $scope.brandMode = 1;
    }
    if (mode === 2) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Switch', 'Switch to all brands on brands page');
      $scope.brandMode = 2;
      if (!!localStorageService.get('activeBrandIndexedList')) {
        $scope.getIndexedList(localStorageService.get('activeBrandIndexedList'));
        localStorageService.remove('activeBrandIndexedList');
      } else {
        $scope.getIndexedList('0-9');
      }
      // $timeout(function() {
      //   hideLoadingSpinner();
      // }, 8000);
    }
  };

  $scope.doRefresh = function() {
    if ($scope.brandMode === 0) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Pull to refresh', 'Pull to refresh my brands on brands page');
      myBrandsPageNumber = 1;
      myBrandsApiLocker = false;
      myBrandsHasMoreData = true;
      $scope.myBrands = [];
      getMyBrands();
    }
    if ($scope.brandMode === 1) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Pull to refresh', 'Pull to refresh recommended brands on brands page');
      recommendedBrandsPageNumber = 1;
      recommendedBrandsApiLocker = false;
      recommendedBrandsHasMoreData = true;
      $scope.recommendedBrands = [];
      getRecommendedBrands();
    }
    if ($scope.brandMode === 2) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Pull to refresh', 'Pull to refresh all brands on brands page');
      aToZbrandsPageNumber = 1;
      aToZbrandsApiLocker = false;
      aToZbrandsHasMoreData = true;
      $scope.aToZbrands = [];
      $scope.brandSocialAction = {};
      getBrandsAtoZ();
    }

    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.hasMoreData = function() {
    if ($scope.brandMode === 0) {
      return myBrandsHasMoreData;
    } else if ($scope.brandMode === 1) {
      return recommendedBrandsHasMoreData;
    } else if ($scope.brandMode === 2) {
      return aToZbrandsHasMoreData;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData()) {
      return;
    }

    if ($scope.brandMode === 0) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Scroll down', 'Scroll down to load more my brands on brands page');
      getMyBrands();
    }
    if ($scope.brandMode === 1) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Scroll down', 'Scroll down to load more recommended brands on brands page');
      getRecommendedBrands();
    }
    if ($scope.brandMode === 2) {
      UtilityService.gaTrackAppEvent('Brands Page', 'Scroll down', 'Scroll down to load more all brands on brands page');
      getBrandsAtoZ();
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');

  };

  if ($stateParams.source == 0) {
    $scope.switchMode(0);
  } else if ($stateParams.source == 1) {
    $scope.switchMode(1);
  } else if ($stateParams.source == 2) {
    $scope.switchMode(2);
  } else {
    $scope.switchMode(0);
  }

}]);
