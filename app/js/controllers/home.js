'use strict';

angular.module('sywStyleXApp')
.controller('HomeCtrl', ['$scope', 'localStorageService', 'LocationService', 'TwoTapService', 'UserMediaService', 'MediaTagService', 'UtilityService', '$location', '$state', '$ionicActionSheet', '$timeout', '$cordovaClipboard', 'ENV', 'CartService', 'ProductDetailService','$ionicScrollDelegate', function($scope, localStorageService, LocationService, TwoTapService, UserMediaService, MediaTagService, UtilityService, $location, $state, $ionicActionSheet, $timeout, $cordovaClipboard, ENV, CartService,ProductDetailService, $ionicScrollDelegate) {
  UtilityService.gaTrackAppView('Discover Page View');

  var userObj = $location.search();
  if (userObj.USER_ID) {
    localStorageService.set('userId', userObj.USER_ID);
  }

  var pageNumber = 0;
  var apiLocker = false;
  var latitude = '';
  var longitude = '';
  $scope.imageHeight = UtilityService.getImageHeight(1);
  $scope.hasMoreData = true;
  $scope.selectedHomeNav = 0;
  $scope.discoverMedias = [];
  $scope.sharingConfirm = false;

  var getCurrentPosition = function() {
    var options = {
      timeout: 10000,
      maximumAge: 30000,
      enableHighAccuracy: false
    };

    LocationService.getCurrentPosition(options).then(
      function(position) {
        console.log(position.coords);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        var locationData = {
          latitude: latitude,
          longitude: longitude
        };
        localStorageService.set('locationData', locationData);
      },
      function() {
        console.log('error');
      }
    );
  };

  var getAllMedia = function() {
    if (apiLocker || !!localStorageService.get('productDetail') || !!localStorageService.get('discoverMedia')) {
      return;
    }

    apiLocker = true;

    // UserMediaService.getAllMedia(localStorageService.get('locationData').longitude, localStorageService.get('locationData').latitude, pageNumber).then(function(result) {
    UserMediaService.getLatestMedia(pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        // if (!result.data.payload.MEDIAS) {
        //   $state.go('landing');
        // }

        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
        } else {
          pageNumber++;
          $scope.hasMoreData = true;
//          var discoverMedias = result.data.payload.MEDIAS;
          var discoverMedias = [];
          for(var i = 0, j= result.data.payload.MEDIAS.length; i < j; i++) {
            var mediaObj = {};
            mediaObj = result.data.payload.MEDIAS[i];
            if(!!result.data.payload.MEDIAS[i].products) {
              mediaObj.itemHeight = $scope.imageHeight + 270;
            } else {
              mediaObj.itemHeight = $scope.imageHeight + 100;
            }

            discoverMedias.push(mediaObj);
          }

          console.log(discoverMedias);
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }

      apiLocker = false;
    });
  };

  var getCurrentUserMedia = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;
    var userId = localStorageService.get('userId');

    // getCurrentUserMedia to avoid duplicate medias

    UserMediaService.getCurrentUserMedia(userId, pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
        } else {
          pageNumber++;
          $scope.hasMoreData = true;
//          var discoverMedias = result.data.payload.MEDIAS;
          var discoverMedias = [];
          for(var i = 0, j= result.data.payload.MEDIAS.length; i < j; i++) {
            var mediaObj = {};
            mediaObj = result.data.payload.MEDIAS[i];
            if(!!result.data.payload.MEDIAS[i].products) {
              mediaObj.itemHeight = $scope.imageHeight + 270;
            } else {
              mediaObj.itemHeight = $scope.imageHeight + 100;
            }

            discoverMedias.push(mediaObj);
          }
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }

      apiLocker = false;
    });
  };

  var setMediaLike = function(mediaTag, discoveMediasArray){
      $.each(discoveMediasArray, function(idx, obj){
        if(obj.id == mediaTag.id){

          obj.socialActionUserMedia = {

            liked: mediaTag.socialActionUserMedia.liked
          };

          obj.likes = mediaTag.likes;
        }

      });

      return discoveMediasArray;
  };

  $scope.mediaDetail = function(discoverMedia) {
    UtilityService.gaTrackAppEvent('Discover Page', 'Click', 'Media detail page from discover - Media: ' + discoverMedia.id);

    discoverMedia.source = 'home';
    localStorageService.set('discoverMedia', discoverMedia);
    $state.go('media', {mediaId: discoverMedia.id});
  };

  $scope.openSharingOption = function(discoverMedia) {
    if (!UtilityService.IsSuperuser(localStorageService.get('userId'))) {
      return;
    }

    if (!ionic.Platform.isWebView()) {
      return;
    }

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: '<i class="sharing-icon ion-ios-email"></i>COPY SHARE URL'}
      ],
      cancelText: 'CANCEL',
      cancel: function() {
        UtilityService.gaTrackAppEvent('Discover Page', 'Click', 'Cancel sharing on discover page - Media: ' + discoverMedia.id);
        hideSheet();
      },
      buttonClicked: function() {
        UtilityService.gaTrackAppEvent('Discover Page', 'Click', 'Sharing media on discover page - Media: ' + discoverMedia.id);
        console.log(ENV.sharingHost + discoverMedia.id);
        $cordovaClipboard.copy(ENV.sharingHost + discoverMedia.id).then(function() {
          $scope.sharingConfirm = true;
          hideSheet();
        }, function() {
          hideSheet();
        });
        $timeout(function() {
          $scope.sharingConfirm = false;
        }, 5000);
      },
      cssClass: 'social-sharing'
    });

    // $timeout(function() {
    //   hideSheet();
    // }, 10000);
  };

  $scope.switchHomeNav = function(index) {
    $scope.selectedHomeNav = index;
  };

  $scope.productDetail = function(product, mediaId) {
    UtilityService.gaTrackAppEvent('Discover Page', 'Click', 'Product detail page from discover - Media: ' + mediaId + ' - Product: ' + product.id);

    var visualtagid;
    MediaTagService.getVisualTagId(product.id, mediaId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        visualtagid = result.data.payload.VISUAL_TAG_ID;
      }
    });
    ProductDetailService.getProductDetail(product.id).then(function(response){
      if (UtilityService.validateResult(response)) {
          console.log(response);
          product.affiliateURL = decodeURIComponent(product.buyURL);
          product.mediaId = mediaId;
          product.visualTagId = visualtagid;
          product.brandId = !!response.data.payload.PRODUCT.brand ? response.data.payload.PRODUCT.brand.id : null;

          if(!!response.data.payload.PRODUCT.socialActionUserProduct) {
            product.socialActionUserProduct = response.data.payload.PRODUCT.socialActionUserProduct;
          }

          var productDetail = {
            xapp: product,
            source: 'home'
          }

          if(response.data.payload.PRODUCT.twoTapData) {
            productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
          }

          localStorageService.set('productDetail', productDetail);
          $state.go('product', {productId: product.id});
      }
    }, function(error) {
        console.log(error);
    });
  };

  $scope.doRefresh = function() {
    UtilityService.gaTrackAppEvent('Discover Page', 'Pull to refresh', 'Pull to refresh feeds on discover page');
    localStorageService.remove('taggedProducts');
    console.log('do refresh');

    pageNumber = 0;
    apiLocker = false;
    $scope.discoverMedias = [];
    $scope.hasMoreData = true;

    getAllMedia();

    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }

    UtilityService.gaTrackAppEvent('Discover Page', 'Scroll down', 'Load more feeds on discover page');

    getAllMedia();

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.toggleMediaLike = function(discoverMediaTag) {
    var mediaLike = !!discoverMediaTag.socialActionUserMedia ? discoverMediaTag.socialActionUserMedia.liked : false;

    if(!!mediaLike) {
      UserMediaService.unlikeMedia(discoverMediaTag.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Discover Page', 'Unlike media', 'Unlike media id - ' + discoverMediaTag.id + ' on discover page');
          $scope.discoverMedias = setMediaLike(response.data.payload.MEDIA, $scope.discoverMedias);
        }
      });

    } else {
      UserMediaService.likeMedia(discoverMediaTag.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Discover Page', 'Like media', 'Like media id - ' + discoverMediaTag.id + ' on discover page');
          $scope.discoverMedias = setMediaLike(response.data.payload.MEDIA, $scope.discoverMedias);
        }
      });
    }
    console.log($scope.discoverMedias);

  };

  $scope.getMediaOwner = function(mediaOwner) {
    console.log(mediaOwner);
    MediaTagService.getMediaOwner(mediaOwner.id).then(function(res){
      console.log(res);
      if(UtilityService.validateResult(res)) {
        UtilityService.gaTrackAppEvent('Discover Page', 'Get Media Owner', 'media Owner id - ' + mediaOwner.id + ' from discover page');
        var profileType = '';
        if(!!res.data.payload.MEDIA_OWNER) {
          var profileId = res.data.payload.MEDIA_OWNER.id;
          if(res.data.payload.MEDIA_OWNER.entityName == 'UserJson') {
            profileType = 'user';
          } else {
            profileType = 'brand';
          }
          if(profileId == localStorageService.get('userId')) {
            return
          } else {
            $state.go('profile', {Id: profileId, type: profileType, source:99});
          }
        }
      }
    });
  };

  $scope.$on('$ionicView.enter', function() {
    console.log('entering view');
    UtilityService.getLatestApp();

    if (!!localStorageService.get('shoppingCartInfo')) {
      $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
    } else {
      $scope.shoppingCartInfo = {
        count: 0,
        subtotal: 0
      };
    }

    var getProductsFromCart = function() {
      CartService.getProductsFromCart(localStorageService.get('userId'), false).success(function(response) {
        $scope.shoppingCartInfo.count = response.payload.SHOPPING_CART.cartProducts.length;
        localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
        localStorageService.set('isInstagramLinked', response.payload.SHOPPING_CART.user.isInstagramLinked);
        localStorageService.set('isFacebookLinked', response.payload.SHOPPING_CART.user.isFacebookLinked);
        console.log('home page'+ $scope.shoppingCartInfo);
      });
    };

    if (!localStorageService.get('userId')) {
      $state.go('landing');
    } else {
      getProductsFromCart();
    }

    if(!!localStorageService.get('trackHistory')) {
      localStorageService.remove('trackHistory');
    }

    localStorageService.remove('productDetail');

    var discoverMediaArray = $scope.discoverMedias;

    if($scope.discoverMedias.length > 0 && !!localStorageService.get('taggedProducts')) {
      // handling scenario from mdp

      if(!!localStorageService.get('mediaProductsUpdated')) {
        // products are updated from mdp
        var discoverMediaId = localStorageService.get('discoverMedia').id;
        for(var i = 0, j = $scope.discoverMedias.length; i < j; i++) {
          if(discoverMediaArray[i].id == discoverMediaId) {
            discoverMediaArray[i].products = localStorageService.get('taggedProducts');
            if(discoverMediaArray[i].products.length > 0) {
              discoverMediaArray[i].itemHeight = $scope.imageHeight + 270;
            } else {
              discoverMediaArray[i].itemHeight = $scope.imageHeight + 100;
            }
            console.log(discoverMediaArray);
            $scope.discoverMedias = discoverMediaArray;
            localStorageService.remove('taggedProducts');
            localStorageService.remove('discoverMedia');
            localStorageService.remove('mediaProductsUpdated');
            $ionicScrollDelegate.resize();
            break;
          }

        }
      } else {
        localStorageService.remove('discoverMedia');
        localStorageService.remove('taggedProducts');
      }

    } else {
      localStorageService.remove('discoverMedia');
      if($scope.discoverMedias.length > 0) {
        // from other pages
        $ionicScrollDelegate.scrollTop();
        $scope.doRefresh();
      } else{
        // for the very first time
        getAllMedia();
      }
    }
  });

}]);
