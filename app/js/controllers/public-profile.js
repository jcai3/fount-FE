'use strict';

angular.module('sywStyleXApp')
.controller('PublicProfileCtrl', ['$rootScope', '$scope', '$ionicScrollDelegate', 'UtilityService', 'CartService', 'SocialActionService', 'ProductDetailService', 'TwoTapService',  'UserMediaService', 'localStorageService','$state', '$stateParams', 'BrandsService', 'PublicProfileService', 'MediaTagService', function($rootScope, $scope, $ionicScrollDelegate, UtilityService, CartService, SocialActionService, ProductDetailService, TwoTapService, UserMediaService, localStorageService, $state, $stateParams,BrandsService,PublicProfileService, MediaTagService) {
  UtilityService.gaTrackAppView('Public Profile Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }
  var productsPageNumber = 1;
  var productsApiLocker = false;
  var productsHasMoreData = true;
  var storefrontPageNumber = 1;
  var storefrontApiLocker = false;
  var storefrontHasMoreData = true;
  var followingPageNumber = 1;
  var followingApiLocker = false;
  var followingHasMoreData = true;
  var followersPageNumber = 1;
  var followersApiLocker = false;
  var followersHasMoreData = true;
  var userId = localStorageService.get('userId');
  var productDetailLocker = false;

  var serviceToUse = '';
  var profileUserId = '';

  $scope.imageHeight = UtilityService.getImageHeight(3);
  $scope.productImageHeight = UtilityService.getImageHeight(2);
  $scope.profileStorefront = [];
  $scope.profileFollowing = [];
  $scope.profileFollowers = [];
  $scope.profileProducts = [];
  $scope.totalPosts = 0;
  $scope.totalProducts = 0;
  $scope.totalFollowing = 0;
  $scope.totalFollowers = 0;
  $scope.followPublicProfile = false;
  $scope.profileDisplayName = '';
  $scope.publicProfilePicture = '';
  $scope.loginUserId = '';
  $scope.stateParamId = '';
  $scope.profileData = {
    brandId: '',
    profileType: '',
    source: ''
  };

  var userProfileType = function() {
    if ($stateParams.type == 'brand') {
      $scope.profileData.brandId = $stateParams.Id;
      serviceToUse = 'BrandsService';
      $scope.profileData.profileType = 'brand';
      $scope.profileData.source = 'brand-profile';
    } else {
      profileUserId = $stateParams.Id;
      serviceToUse = 'UserMediaService';
      $scope.profileData.profileType = 'user';
      $scope.profileData.source = 'user-profile';
    }
    localStorageService.set('profileId', $stateParams.Id);
  };

  var getBrandDetails = function(res) {
    var brandCountObj = res.data.payload;
    $scope.profileDisplayName = UtilityService.emojiParse(brandCountObj.BRAND.BRAND.name);
    $scope.totalPosts = brandCountObj.BRAND_POSTS_COUNT[$scope.profileData.brandId];
    $scope.totalProducts = brandCountObj.BRAND_PRODUCT_COUNT[$scope.profileData.brandId];
    $scope.totalFollowers = brandCountObj.BRAND_FOLLOWER_COUNT[$scope.profileData.brandId];
    $scope.followPublicProfile = !!brandCountObj.BRAND_SOCIAL_ACTION[$scope.profileData.brandId] ? brandCountObj.BRAND_SOCIAL_ACTION[$scope.profileData.brandId].follow : false;
    console.log($scope.followPublicProfile);
  };

  var getUserPublicProfile = function(res) {
    var publicProfileObj = res.data.payload;
    var profileDisplayName = !!publicProfileObj.USER.USER.userProfile.instagramFullName ? publicProfileObj.USER.USER.userProfile.instagramFullName : publicProfileObj.USER.USER.displayName;
    $scope.profileDisplayName = UtilityService.emojiParse(profileDisplayName);
    $scope.publicProfilePicture = !!publicProfileObj.USER.USER.userProfile.instagramProfilePicture ? publicProfileObj.USER.USER.userProfile.instagramProfilePicture : '';
    $scope.totalPosts = publicProfileObj.USER_POSTS_COUNT[profileUserId];
    $scope.totalProducts = publicProfileObj.USER_PRODUCTS_COUNT[profileUserId];
    $scope.totalFollowing = publicProfileObj.USER_FOLLOWING_COUNT[profileUserId];
    $scope.totalFollowers = publicProfileObj.USER_FOLLOWER_COUNT[profileUserId];
    $scope.followPublicProfile = !!publicProfileObj.USER_SOCIAL_ACTION[profileUserId] ? publicProfileObj.USER_SOCIAL_ACTION[profileUserId].follow : false;
  };

  var getProfileDetails = function() {
    if($scope.profileData.profileType == 'brand') {
      BrandsService.getBrandDetail($scope.profileData.brandId).then(function(response){
        console.log(response);
        if (UtilityService.validateResult(response)) {
            getBrandDetails(response);
        } else {
          console.log('error');
        }
      });
    } else {
      storefrontPageNumber = 0;
      PublicProfileService.getPublicProfile(profileUserId).then(function(response){
        if (UtilityService.validateResult(response)) {
            getUserPublicProfile(response);
              console.log(response);
        } else {
          console.log('error');
        }
      });
    }
  };

  var toggleProductLike = function(product, profileProductsArray) {
    for(var i = 0, j = profileProductsArray.length; i < j; i++) {
      if(profileProductsArray[i].id == product.id) {
          profileProductsArray[i].socialActionUserProduct = {
            liked: product.socialActionUserProduct.liked
          };
      }
    };
    return profileProductsArray;
  };

  var spliceFromArray = function(objArray, responseId) {
    for(var i = 0, j = objArray.length; i < j; i++) {
      if (objArray[i].id == responseId) {
        objArray.splice(i, 1);
        return objArray;
      }
    }
    return objArray;
  }

  var toggleFollowFlag = function(response) {
    if($scope.activeProfile == 3) {
      for(var i = 0, j = $scope.profileFollowing.length; i < j; i++) {
        if($scope.profileFollowing[i].id == response.id) {
          $scope.profileFollowing[i].profileFollow = !$scope.profileFollowing[i].profileFollow;
        }
      };

    } else if($scope.activeProfile == 4) {
      for(var i = 0, j = $scope.profileFollowers.length; i < j; i++) {
        if($scope.profileFollowers[i].id == response.id) {
          $scope.profileFollowers[i].profileFollow = !$scope.profileFollowers[i].profileFollow;
        }
      };
     }
  };


  var unFollowProfile = function(toggleProfileFollow) {
    var toggleProfileType = toggleProfileFollow.profileType;

    if(toggleProfileType == 'user') {
      SocialActionService.unfollowUser(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          toggleFollowFlag(response.data.payload.USER);
        }
      });
    } else {
      SocialActionService.unfollowBrand(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          toggleFollowFlag(response.data.payload.BRAND);
        }
      });
    }

  };

  var followProfileFlag = function(toggleProfileFollow) {
    var toggleProfileType =  toggleProfileFollow.profileType;

    if(toggleProfileType == 'user') {
      SocialActionService.followUser(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Follow user', 'Follow user ' + toggleProfileFollow.id + ' on public profile page');
          toggleFollowFlag(response.data.payload.USER);
        }
      });
    } else {
      SocialActionService.followBrand(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Follow brand', 'Follow brand ' + toggleProfileFollow.id + ' on public profile page');
          toggleFollowFlag(response.data.payload.BRAND);
        }
      });
    }

  };

  var unFollowPublicProfile = function() {
    if($scope.profileData.profileType == 'user') {
      SocialActionService.unfollowUser(profileUserId).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Unfollow user', 'Unfollow user ' + profileUserId + ' on public profile page');
          $scope.followPublicProfile = !$scope.followPublicProfile;
          $scope.totalFollowers--;
          if($scope.activeProfile == 4) {
            $scope.profileFollowers = spliceFromArray($scope.profileFollowers, localStorageService.get('userId'));
          }
        }
      });
    } else {
      SocialActionService.unfollowBrand($scope.profileData.brandId).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Unfollow brand', 'Unfollow brand ' + $scope.profileData.brandId + ' on public profile page');
          $scope.followPublicProfile = !$scope.followPublicProfile;
          //write the logic for splicing
          $scope.totalFollowers--;
          if($scope.activeProfile == 4) {
            $scope.profileFollowers = spliceFromArray($scope.profileFollowers, localStorageService.get('userId'));
          }
        }
      });
    }

  };

  var followPublicProfile = function() {
    if($scope.profileData.profileType == 'user') {
      SocialActionService.followUser(profileUserId).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Follow user', 'Follow user ' + profileUserId + ' on public profile page');
          $scope.followPublicProfile = !$scope.followPublicProfile;
          $scope.totalFollowers++;
          if($scope.activeProfile == 4) {
            $scope.profileFollowers = [];
            followersHasMoreData = true;
            followersPageNumber = 1;
            getFollowersForProfile();
          }
        }
      });
    } else {
      SocialActionService.followBrand($scope.profileData.brandId).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Follow brand', 'Follow brand ' + $scope.profileData.brandId + ' on public profile page');
          $scope.followPublicProfile = !$scope.followPublicProfile;
          $scope.totalFollowers++;
          if($scope.activeProfile == 4) {
            $scope.profileFollowers = [];
            followersHasMoreData = true;
            followersPageNumber = 1;
            getFollowersForProfile();
          }
        }
      });
    }

  };

var storefrontResponse = function(postObj) {
  if (postObj.length === 0) {
    storefrontHasMoreData = false;
  } else {
    storefrontPageNumber++;
    storefrontHasMoreData = true;
    $scope.profileStorefront.push.apply($scope.profileStorefront, postObj);
  }

};

  var getMyStorefront = function() {
    if (storefrontApiLocker || !storefrontHasMoreData) {
      return;
    }
    storefrontApiLocker = true;

    if($scope.profileData.profileType == 'user') {
      UserMediaService.getCurrentUserMedia(profileUserId, storefrontPageNumber).then(function(result) {
        if (UtilityService.validateResult(result)) {
          storefrontResponse(result.data.payload.MEDIAS);
        } else {
          storefrontHasMoreData = false;
          console.log('error');
        }
        storefrontApiLocker = false;
      });
    } else {
      BrandsService.getBrandPosts($scope.profileData.brandId, storefrontPageNumber).then(function(result) {
        if (UtilityService.validateResult(result)) {
          storefrontResponse(result.data.payload.BRAND_POSTS);
        } else {
          storefrontHasMoreData = false;
          console.log('error');
        }
        storefrontApiLocker = false;
      });
    }
  };
var getSocialActionFlagForBrand = function(profilesObj, myFollows, profileType) {
     var returnObjArray = [];
     for(var i =0, j = profilesObj.length; i < j; i++) {
       var objWithFlag = {};
       var idMapped = false;
       if(myFollows.length > 0) {
         for(var idx = 0, len = myFollows.length; idx < len; idx++) {
           if(profilesObj[i].id == myFollows[idx].brandId) {
             objWithFlag.profileFollow = myFollows[idx].follow;
             objWithFlag.profileType = profileType;
             objWithFlag.instagramProfilePicture =  null;
             objWithFlag.displayName =  profilesObj[i].name;
             objWithFlag.id = profilesObj[i].id;
             returnObjArray.push(objWithFlag);
             idMapped = true;
//             myFollows.splice(idx, 1);
             break;
           }
         }

         if(!idMapped) {
           objWithFlag.profileFollow = false;
           objWithFlag.profileType = profileType;
           objWithFlag.instagramProfilePicture =  null;
           objWithFlag.displayName = profilesObj[i].name;
           objWithFlag.id = profilesObj[i].id;
           returnObjArray.push(objWithFlag);
         }
       } else {
         objWithFlag.profileFollow = false;
         objWithFlag.profileType = profileType;
         objWithFlag.instagramProfilePicture = null;
         objWithFlag.displayName = profilesObj[i].name;
         objWithFlag.id = profilesObj[i].id;
         returnObjArray.push(objWithFlag);
       }

     }
     return returnObjArray;
 };

  var getSocialActionFlag = function(profilesObj, myFollows, profileType) {
       var returnObjArray = [];
       for(var i =0, j = profilesObj.length; i < j; i++) {
         var objWithFlag = {};
         var idMapped = false;
         if(myFollows.length > 0) {
           for(var idx = 0, len = myFollows.length; idx < len; idx++) {
             if(profilesObj[i].id == myFollows[idx].userId) {
              //  objWithFlag.USER_SOCIAL_ACTION = {
              //    follow: myFollows[idx].follow
              //  };
               objWithFlag.profileFollow = myFollows[idx].follow;
               objWithFlag.profileType = profileType;
               objWithFlag.instagramProfilePicture = !!profilesObj[i].userProfile.instagramProfilePicture ? profilesObj[i].userProfile.instagramProfilePicture : null;
               objWithFlag.displayName = !!profilesObj[i].userProfile.instagramFullName  ? profilesObj[i].userProfile.instagramFullName  : profilesObj[i].displayName;
               objWithFlag.id = profilesObj[i].id;
               returnObjArray.push(objWithFlag);
//                myFollows.splice(idx, 1);
                idMapped = true;
               break;
              }
             }

             if(!idMapped) {
               objWithFlag.profileFollow = false;
               objWithFlag.profileType = profileType;
               objWithFlag.instagramProfilePicture = !!profilesObj[i].userProfile.instagramProfilePicture ? profilesObj[i].userProfile.instagramProfilePicture : null;
               objWithFlag.displayName = !!profilesObj[i].userProfile.instagramFullName  ? profilesObj[i].userProfile.instagramFullName  : profilesObj[i].displayName;
               objWithFlag.id = profilesObj[i].id;
               returnObjArray.push(objWithFlag);
             }
         } else {
           objWithFlag.profileFollow = false;
           objWithFlag.profileType = profileType;
           objWithFlag.instagramProfilePicture = !!profilesObj[i].userProfile.instagramProfilePicture ? profilesObj[i].userProfile.instagramProfilePicture : null;
           objWithFlag.displayName = !!profilesObj[i].userProfile.instagramFullName  ? profilesObj[i].userProfile.instagramFullName  : profilesObj[i].displayName;
           objWithFlag.id = profilesObj[i].id;
           returnObjArray.push(objWithFlag);
         }

       }
       return returnObjArray;
   };

  var productsResponse = function(result) {
    if (UtilityService.validateResult(result)) {
      if (result.data.payload.PRODUCT.length === 0) {
        productsHasMoreData = false
      } else {
        productsPageNumber++;
        productsHasMoreData = true;
        var profileProducts = result.data.payload.PRODUCT;
        $scope.profileProducts.push.apply($scope.profileProducts, profileProducts);
      }
    } else {
      productsHasMoreData = false;
      console.log('error');
    }

    productsApiLocker = false;
  };

  var getProfileProducts = function() {
    if (productsApiLocker || !productsHasMoreData) {
      return;
    }
    productsApiLocker = true;

    if($scope.profileData.profileType == 'user') {
        return false;
    } else {
      ProductDetailService.getProductsByBrand($scope.profileData.brandId, productsPageNumber).then(function(result) {
        console.log(result);
        productsResponse(result);
      });
    }
  };

  var getFollowingResponse = function(result) {
    if (UtilityService.validateResult(result)) {
      if (result.data.payload.USERS.length === 0 && result.data.payload.BRAND.length === 0) {
        followingHasMoreData = false
      } else {
        followingPageNumber++;
        followingHasMoreData = true;

        if(result.data.payload.USERS.length > 0) {
          var profileFollowing = result.data.payload.USERS;
          var myFollows = result.data.payload.USER_SOCIAL_ACTION;
          $scope.profileFollowing = getSocialActionFlag(profileFollowing, myFollows, 'user');
        }
        if(result.data.payload.BRAND.length > 0) {
          var brandsFollowed = [];
          var brandFollowing = result.data.payload.BRAND;
          var mybrandFollows = result.data.payload.BRAND_SOCIAL_ACTION;
          brandsFollowed =  getSocialActionFlagForBrand(brandFollowing, mybrandFollows, 'brand');
          for(var i = 0, j = brandsFollowed.length; i < j; i++) {
            $scope.profileFollowing.push(brandsFollowed[i]);
          }
        }
      }
    } else {
      console.log('error');
    }
    followingApiLocker = false;
  };

  var getFollowingByProfile = function() {
    if (followingApiLocker || !followingHasMoreData) {
      return;
    }
    followingApiLocker = true;

    if($scope.profileData.profileType == 'user') {
      PublicProfileService.getUserFollowing(profileUserId, followingPageNumber).then(function(response){
        console.log(response);
        getFollowingResponse(response);
      });
    } else {
      return false;
    }
  };

  var getFollowersResponse = function(result) {
    if (UtilityService.validateResult(result)) {
      if (result.data.payload.USERS.length === 0) {
        followersHasMoreData = false
      } else {
        followersPageNumber++;
        followersHasMoreData = true;
        var profileFollowers = result.data.payload.USERS;
        var myFollows = result.data.payload.USER_SOCIAL_ACTION;
        $scope.profileFollowers = getSocialActionFlag(profileFollowers, myFollows, 'user');
//        console.log(profileFollowersObj);
//        $scope.profileFollowers.push.apply($scope.profileFollowers, profileFollowersObj);
//        $scope.profileFollowers = profileFollowersObj
      }
    } else {
      console.log('error');
    }
    followersApiLocker = false;
  };

  var getFollowersForProfile = function() {
    if (followersApiLocker || !followersHasMoreData) {
      return;
    }
    followersApiLocker = true;

    if($scope.profileData.profileType == 'user') {
        PublicProfileService.getUserFollowers(profileUserId, followersPageNumber).then(function(response){
          console.log(response);
          getFollowersResponse(response)
        });
    } else {
      BrandsService.getBrandFollowers($scope.profileData.brandId, followersPageNumber).then(function(response){
        if (UtilityService.validateResult(response)) {
          console.log(response);
          getFollowersResponse(response);
        } else {
          console.log('error');
        }
      });
    }
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

  $scope.backToPrev = function() {
    var viewHistory = localStorageService.get('trackHistory');
    viewHistory.pop();
    if (viewHistory.length > 1) {
      var prevState = viewHistory.pop();
    } else {
      var prevState = viewHistory[0];
    }

    if(prevState.source == 0 || prevState.source == 1 || prevState.source == 2) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to brands page from public profile');
      localStorageService.remove('trackHistory');
      $state.go('main.brands', {source: prevState.source});
    } else if(prevState.source == 'settings') {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to main settings page from public profile');
      localStorageService.remove('trackHistory');
      $state.go('main.settings');
    } else if(prevState.source == 'brand-profile') {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to brand profile page from public profile');
      localStorageService.set('trackHistory', viewHistory);
      $state.go('profile',{Id:prevState.id, type:'brand', source: 0});
    } else if(prevState.source == 'user-profile') {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to user profile page from public profile');
      localStorageService.set('trackHistory', viewHistory);
      $state.go('profile',{Id:prevState.id, type:'user', source: 0});
    } else if(prevState.source == 'product-detail') {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to product detail page from public profile');
      localStorageService.remove('productDetail');
      localStorageService.set('trackHistory', viewHistory);
      $state.go('product',{productId:prevState.id});
    } else {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Back to home page from public profile');
      localStorageService.remove('trackHistory');
      $state.go('main.home');

    }

  };

  $scope.mediaDetail = function(discoverMedia) {
    UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Media detail page from public profile - Media: ' + discoverMedia.id);
    discoverMedia.source = $scope.profileData.source;
    localStorageService.set('discoverMedia', discoverMedia);
    $state.go('media', {mediaId: discoverMedia.id});
  };

  $scope.getMediaOwner = function(mediaOwner) {
    console.log(mediaOwner);
    MediaTagService.getMediaOwner(mediaOwner.id).then(function(res){
      console.log(res);
      if(UtilityService.validateResult(res)) {
        UtilityService.gaTrackAppEvent('Public Profile Page', 'Get Media Owner', 'Media owner id - ' + mediaOwner.id + ' from public profile page');
        var profileType = '';
        if (!!res.data.payload.MEDIA_OWNER) {
          var profileId = res.data.payload.MEDIA_OWNER.id;
          if (res.data.payload.MEDIA_OWNER.entityName == 'UserJson') {
            profileType = 'user';
          } else {
            profileType = 'brand';
          }
          if (profileId == localStorageService.get('userId')) {
            return;
          } else {
            $state.go('profile', {Id: profileId, type: profileType, source: $scope.profileData.source});
          }
        }
      }
    });
  };

  $scope.toggleMediaLike = function(discoverMediaTag) {
    var mediaLike = !!discoverMediaTag.socialActionUserMedia ? discoverMediaTag.socialActionUserMedia.liked : false;

    if(!!mediaLike) {
      UserMediaService.unlikeMedia(discoverMediaTag.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          if ($scope.activeProfile == 12) {
            UtilityService.gaTrackAppEvent('Public Profile Page', 'Unlike media', 'Unlike media id - ' + discoverMediaTag.id + ' on public profile - liked posts page');
            $scope.storefrontLiked = setMediaLike(response.data.payload.MEDIA, $scope.storefrontLiked);
          } else {
            UtilityService.gaTrackAppEvent('Public Profile Page', 'Unlike media', 'Unlike media id - ' + discoverMediaTag.id + ' on public profile - imported posts page');
            $scope.profileStorefront = setMediaLike(response.data.payload.MEDIA, $scope.profileStorefront);
          }
        }
      });

    } else {
      UserMediaService.likeMedia(discoverMediaTag.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          if ($scope.activeProfile == 12) {
            UtilityService.gaTrackAppEvent('Public Profile Page', 'Like media', 'Like media id - ' + discoverMediaTag.id + ' on public profile - liked posts page');
            $scope.storefrontLiked = setMediaLike(response.data.payload.MEDIA, $scope.storefrontLiked);
          } else {
            UtilityService.gaTrackAppEvent('Public Profile Page', 'Like media', 'Like media id - ' + discoverMediaTag.id + ' on public profile - imported posts page');
            $scope.profileStorefront = setMediaLike(response.data.payload.MEDIA, $scope.profileStorefront);
          }
        }
      });
    }

  };

  $scope.mediaProductDetail = function(product, mediaId) {
    UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Product detail page from public profile - Media: ' + mediaId + ' - Product: ' + product.id);

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

          var productDetail = {
            xapp: product,
            source: $scope.profileData.source
          };

          if(response.data.payload.PRODUCT.twoTapData) {
            productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
          }

          localStorageService.set('productDetail', productDetail);
          $state.go('product', {productId: product.id});

          // if(response.data.payload.PRODUCT.twoTapData) {
          //   product.affiliateURL = decodeURIComponent(product.buyURL);
          //   product.mediaId = mediaId;
          //   product.visualTagId = visualtagid;
          //   var productDetail = {
          //     xapp: product,
          //     twotap: response.data.payload.PRODUCT.twoTapData,
          //     source: $scope.profileData.source
          //   };
          //   localStorageService.set('productDetail', productDetail);
          //   $state.go('product', {productId: product.id});
          //
          // } else {
          //
          //   var productURL = UtilityService.cjProductUrlParser(product.buyURL);
          //   var options = {
          //       products: [productURL]
          //       };
          //
          //   TwoTapService.cart(options).success(function(response) {
          //     var options = {
          //       cart_id: response.cart_id
          //     };
          //
          //     TwoTapService.cartStatus(options).success(function(response) {
          //       product.affiliateURL = decodeURIComponent(product.buyURL);
          //       product.mediaId = mediaId;
          //       product.visualTagId = visualtagid;
          //       var productDetail = {
          //         xapp: product,
          //         twotap: response,
          //         source: $scope.profileData.source
          //       };
          //       localStorageService.set('productDetail', productDetail);
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

  // $scope.productDetail = function(product) {
  //   if (productDetailLocker) {
  //     return;
  //   }
  //   productDetailLocker = true;
  //   product.affiliateURL = decodeURIComponent(product.buyURL);
  //   product.mediaId = !!product.mediaId ? product.mediaId : null;
  //   product.visualTagId = !!product.visualTagId ? product.visualTagId : null;
  //
  //   UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Product detail page from public profile - Product: ' + product.id);
  //
  //   ProductDetailService.getProductDetail(product.id).then(function(response){
  //     if (UtilityService.validateResult(response)) {
  //       console.log(response);
  //       if (response.data.payload.PRODUCT.twoTapData) {
  //         var productDetail = {
  //           xapp: product,
  //           twotap: response.data.payload.PRODUCT.twoTapData,
  //           source: $scope.profileData.source
  //         };
  //         localStorageService.set('productDetail', productDetail);
  //         productDetailLocker = false;
  //
  //         $state.go('product', {productId: product.id});
  //       } else {
  //         var productURL = UtilityService.cjProductUrlParser(product.buyURL);
  //         var options = {
  //           products: [productURL]
  //         };
  //
  //         TwoTapService.cart(options).success(function(response) {
  //           var options = {
  //             cart_id: response.cart_id
  //           };
  //
  //           TwoTapService.cartStatus(options).success(function(response) {
  //             var productDetail = {
  //               xapp: product,
  //               twotap: response,
  //               source: $scope.profileData.source
  //             };
  //             localStorageService.set('productDetail', productDetail);
  //             productDetailLocker = false;
  //
  //             $state.go('product', {productId: product.id});
  //           });
  //         });
  //       }
  //     }
  //   }, function(error) {
  //       console.log(error);
  //   });
  //
  // };

  $scope.userActiveProfile = function(index) {
    if (index === 1) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Switch', 'Switch to posts on public profile page');
      $scope.activeProfile = 11;
      getMyStorefront();
    } else if (index === 11) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Switch', 'Switch to posts - imported on public profile page');
      $scope.activeProfile = 11;
      getMyStorefront();
    // } else if (index === 12) {
    //   UtilityService.gaTrackAppEvent('Brand Profile Page', 'Switch', 'Switch to posts - liked on profile page');
    //   $scope.activeProfile = 12;
    //   getMyStorefrontLiked();
    } else if (index === 2) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Switch', 'Switch to brand products on public profile page');
      $scope.activeProfile = 2;
      // getProfileProducts();
    } else if (index === 3) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Switch', 'Switch to brand following on public profile page');
      $scope.activeProfile = 3;
      getFollowingByProfile();
    } else if (index === 4) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Switch', 'Switch to follwers on public profile page');
      $scope.activeProfile = 4;
      getFollowersForProfile();
    }
  };

  $scope.hasMoreData = function() {
    if ($scope.activeProfile === 1) {
      return storefrontHasMoreData;
    } else if ($scope.activeProfile === 11) {
      return storefrontHasMoreData;
    // } else if ($scope.activeProfile === 12) {
    //   return storefrontLikedHasMoreData;
    } else if ($scope.activeProfile === 2) {
      return productsHasMoreData;
    } else if ($scope.activeProfile === 3) {
      return followingHasMoreData;
    } else if ($scope.activeProfile === 4) {
      return followersHasMoreData;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData()) {
      return;
    }

    if ($scope.activeProfile === 1) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Scroll down', 'Scroll down to load more posts on public profile page');
      getMyStorefront();
    } else if ($scope.activeProfile === 11) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Scroll down', 'Scroll down to load more products - imported on public profile page');
      getMyStorefront();
    // } else if ($scope.activeProfile === 12) {
    //   UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products - liked on profile page');
    //   getMyStorefrontLiked();
    } else if ($scope.activeProfile === 2) {
      if (!!localStorageService.get('filteredProductsHasMoreData')) {
        console.log('emiting...');
        $rootScope.$emit('loadMoreFilteredProducts', {source: 'publicProfile'});
      } else {
        productsHasMoreData = false;
      }
    //   UtilityService.gaTrackAppEvent('Public Profile Page', 'Scroll down', 'Scroll down to load more commission history on public profile page');
    //   getProfileProducts();
    } else if ($scope.activeProfile === 3) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Scroll down', 'Scroll down to load more products on public profile page');
      getFollowingByProfile();
    } else if ($scope.activeProfile === 4) {
      UtilityService.gaTrackAppEvent('Public Profile Page', 'Scroll down', 'Scroll down to load more products - saved on public profile page');
      getFollowersForProfile();
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.toggleLikeProfileProduct = function(toggleLikeProduct) {

    var likeProfileProduct = !!toggleLikeProduct.socialActionUserProduct ? toggleLikeProduct.socialActionUserProduct.liked : false;

    if(!!likeProfileProduct) {
      ProductDetailService.unlikeProduct(toggleLikeProduct.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Unlike product', 'Unlike product id - ' + toggleLikeProduct.id + ' on public profile page');
          $scope.profileProducts = toggleProductLike(response.data.payload.PRODUCT, $scope.profileProducts);
        }
      });
    } else {
      ProductDetailService.likeProduct(toggleLikeProduct.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Public Profile Page', 'Like product', 'Like product id - ' + toggleLikeProduct.id + ' on public profile page');
          $scope.profileProducts = toggleProductLike(response.data.payload.PRODUCT, $scope.profileProducts);
        }
      });
    }
  };

  $scope.toggleFollow = function(toggleProfileFollow) {

    var followProfile = toggleProfileFollow.profileFollow;

    if(!!followProfile) {
      unFollowProfile(toggleProfileFollow);
    } else {
      followProfileFlag(toggleProfileFollow);
    }
  };

  $scope.toggleProfileFollow = function() {
    if(!!$scope.followPublicProfile) {
      unFollowPublicProfile();
    } else {
      followPublicProfile();
    }
  };

  $scope.viewProfile = function(publicProfile) {

    if (publicProfile.id == localStorageService.get('userId')) {
      return;
    }

    UtilityService.gaTrackAppEvent('Public Profile Page', 'Click', 'Go to public profile - ' + publicProfile.id + ' on public profile page');
    console.log(publicProfile);
    var publicProfileType = publicProfile.profileType;
    var profileId = publicProfile.id;
    $state.go('profile', {Id: profileId, type:publicProfileType});
  };

  $scope.toggleGridListView = function(index) {
    if (index === 0) {
      $scope.gridListView = 0;
    } else {
      $scope.gridListView = 1;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.$on('$ionicView.enter', function() {
    console.log('in public profile');
    console.log($stateParams.Id);
    console.log($stateParams.type);
    console.log($stateParams.source);
    $scope.stateParamId = $stateParams.Id;
    $scope.gridListView = 0;
    userProfileType();
    getProfileDetails();
    if($stateParams.type == 'brand') {
      $scope.userActiveProfile(2);
    } else {
      $scope.userActiveProfile(1);
    }

    $scope.loginUserId = localStorageService.get('userId');

    if(!!$stateParams.source) {
      if(!!localStorageService.get('trackHistory')) {
        var trackHistory = localStorageService.get('trackHistory');

      } else {
        var trackHistory = [];
        var prevSource = {
          source: $stateParams.source,
          id: null
        };

        trackHistory.push(prevSource);
        localStorageService.set('trackHistory', trackHistory);
      }

      var prevSource = {
        source: $scope.profileData.source,
        id: $stateParams.Id
      };

      if (trackHistory.length >= 1) {
        var lastSavedState = trackHistory[trackHistory.length - 1];
        if (lastSavedState.source !== prevSource.source ||(lastSavedState.source == prevSource.source && lastSavedState.id !== prevSource.id)) {
          trackHistory.push(prevSource);
          localStorageService.set('trackHistory', trackHistory);
        }
      }

    }

  });
}]);
