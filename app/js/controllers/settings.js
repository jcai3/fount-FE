'use strict';

angular.module('sywStyleXApp')
.controller('SettingsCtrl', ['$rootScope', '$scope', '$ionicScrollDelegate', '$timeout', '$cookies', 'UtilityService', 'CartService', 'SocialActionService', 'ProductDetailService', 'TwoTapService', 'LoginRegisterService', 'UserMediaService', 'OrderCommissionService', 'InstagramService', 'localStorageService', '$state', 'SocialService', 'SortFilterService', 'PublicProfileService', 'MediaTagService', function($rootScope, $scope, $ionicScrollDelegate, $timeout, $cookies, UtilityService, CartService, SocialActionService, ProductDetailService, TwoTapService, LoginRegisterService, UserMediaService, OrderCommissionService, InstagramService, localStorageService, $state, SocialService, SortFilterService, PublicProfileService, MediaTagService) {
  UtilityService.gaTrackAppView('Profile Page View');

  if (!!localStorageService.get('shoppingCartInfo')) {
    $scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
  } else {
    $scope.shoppingCartInfo = {
      count: 0,
      subtotal: 0
    };
  }

  var productsSavedPageNumber = 1;
  var productsSavedApiLocker = false;
  var productsSavedHasMoreData = true;
  var productsLikedPageNumber = 1;
  var productsLikedApiLocker = false;
  var productsLikedHasMoreData = true;
  var storefrontPageNumber = 0;
  var storefrontApiLocker = false;
  var storefrontHasMoreData = true;
  var storefrontLikedPageNumber = 1;
  var storefrontLikedApiLocker = false;
  var storefrontLikedHasMoreData = true;
  // var commissionPageNumber = 1;
  // var commissionApiLocker = false;
  // var commissionHasMoreData = true;
  // var orderPageNumber = 1;
  // var orderApiLocker = false;
  // var orderHasMoreData = true;
  var followingPageNumber = 1;
  var followingApiLocker = false;
  var followingHasMoreData = true;
  var followersPageNumber = 1;
  var followersApiLocker = false;
  var followersHasMoreData = true;
  var userId = localStorageService.get('userId');
  var productDetailLocker = false;
  $scope.imageHeight = UtilityService.getImageHeight(3);
  $scope.productImageHeight = UtilityService.getImageHeight(2);
  $scope.listImageHeight = UtilityService.getImageHeight(1);
  $scope.storefront = [];
  $scope.storefrontLiked = [];
  // $scope.commissionHistory = [];
  // $scope.orderHistory = [];
  $scope.profileFollowing = [];
  $scope.profileFollowers = [];
  $scope.productsSaved = [];
  $scope.productsLiked = [];
  $scope.outstandingCommission = 0;
  $scope.sywPoints = 0;
  $scope.totalPosts = 0;
  $scope.totalProducts = 0;
  $scope.totalFollowing = 0;
  $scope.totalFollowers = 0;
  $scope.publicProfilePicture = '';
  $scope.profileDisplayName = '';
  $scope.profileData = {
    likedBrandIds: [],
    likedSellerIds: [],
    savedBrandsIds: [],
    savedSellerIds: [],
    profileType: 'self',
    productsType: 'liked',
    source: 'settings'
  };

  var spliceFromArray = function(objArray, responseId) {
    for(var i = 0, j = objArray.length; i < j; i++) {
      if (objArray[i].id == responseId) {
        objArray.splice(i, 1);
        return objArray;
      }
    }
    return objArray;
  };

  var getProfileDetails = function() {
    PublicProfileService.getPublicProfile(userId).then(function(response){
      if (UtilityService.validateResult(response)) {
        console.log(response);
        var publicProfileObj = response.data.payload;
        var profileDisplayName = !!publicProfileObj.USER.USER.userProfile.instagramFullName ? publicProfileObj.USER.USER.userProfile.instagramFullName : publicProfileObj.USER.USER.displayName;
        $scope.profileDisplayName = UtilityService.emojiParse(profileDisplayName.toUpperCase());
        $scope.publicProfilePicture = !!publicProfileObj.USER.USER.userProfile.instagramProfilePicture ? publicProfileObj.USER.USER.userProfile.instagramProfilePicture : '';
        $scope.totalPosts = publicProfileObj.USER_POSTS_COUNT[userId];
        $scope.totalProducts = publicProfileObj.USER_PRODUCTS_COUNT[userId];
        $scope.totalFollowing = publicProfileObj.USER_FOLLOWING_COUNT[userId];
        $scope.totalFollowers = publicProfileObj.USER_FOLLOWER_COUNT[userId];
      } else {
        console.log('error');
      }
    });
  };

  var getLikedFilteredSellers = function() {
    SortFilterService.getFilteredSellers('liked', 1).then(function(res) {
      if (UtilityService.validateResult(res)) {
        var sellers = res.data.payload.SELLERS;
        if (sellers.length != 0) {
          for (var i=0, j=sellers.length; i<j; i++) {
            if ($scope.profileData.likedSellerIds.indexOf(sellers[i].id) == -1) {
              $scope.profileData.likedSellerIds.push(sellers[i].id);
            }
          }
        }
      }
    });
  };

  var getLikedFilteredBrands = function() {
    SortFilterService.getFilteredBrands('liked', 1).then(function(res) {
      if (UtilityService.validateResult(res)) {
        var brands = res.data.payload.BRANDS;
        if (brands.length != 0) {
          for (var i=0, j=brands.length; i<j; i++) {
            if ($scope.profileData.likedBrandIds.indexOf(brands[i].id) == -1) {
              $scope.profileData.likedBrandIds.push(brands[i].id);
            }
          }
        }
      }
    });
  };

  var getSavedFilteredSellers = function() {
    SortFilterService.getFilteredSellers('saved', 1).then(function(res) {
      if (UtilityService.validateResult(res)) {
        var sellers = res.data.payload.SELLERS;
        if (sellers.length != 0) {
          for (var i=0, j=sellers.length; i<j; i++) {
            if ($scope.profileData.savedSellerIds.indexOf(sellers[i].id) == -1) {
              $scope.profileData.savedSellerIds.push(sellers[i].id);
            }
          }
        }
      }
    });
  };

  var getSavedFilteredBrands = function() {
    SortFilterService.getFilteredBrands('saved', 1).then(function(res) {
      if (UtilityService.validateResult(res)) {
        var brands = res.data.payload.BRANDS;
        if (brands.length != 0) {
          for (var i=0, j=brands.length; i<j; i++) {
            if ($scope.profileData.savedBrandsIds.indexOf(brands[i].id) == -1) {
              $scope.profileData.savedBrandsIds.push(brands[i].id);
            }
          }
        }
      }
    });
  };

  var getOutstandingCommission = function() {
    OrderCommissionService.getOutstandingCommission(userId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.outstandingCommission = !!result.data.payload.COMMISSION ? result.data.payload.COMMISSION : 0;
      }
    });
  };

  var getAvailablePoints = function() {
    OrderCommissionService.getAvailablePoints(userId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.sywPoints = !!result.data.payload.POINTS ? result.data.payload.POINTS : 0;
      }
    });
  };
  //
  // var getRedeemableCommission = function() {
  //   OrderCommissionService.getRedeemableCommission(userId).then(function(result) {
  //     if (UtilityService.validateResult(result)) {
  //       console.log(result);
  //     }
  //   });
  // };

  var getProductsLikedByUser = function() {
    if (productsLikedApiLocker || !productsLikedHasMoreData) {
      return;
    }

    productsLikedApiLocker = true;

    SocialActionService.getProductsLikedByUser(productsLikedPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS_LIKED.length === 0) {
          productsLikedHasMoreData = false
        } else {
          productsLikedPageNumber++;
          productsLikedHasMoreData = true;
          var productsLiked = result.data.payload.PRODUCTS_LIKED;
          $scope.productsLiked.push.apply($scope.productsLiked, productsLiked);
        }
      } else {
        productsLikedHasMoreData = false;
        console.log('error');
      }

      productsLikedApiLocker = false;
    });
  };

  var getProductsSavedForLater = function() {
    if (productsSavedApiLocker || !productsSavedHasMoreData) {
      return;
    }

    productsSavedApiLocker = true;

    SocialActionService.getProductsSavedForLater(productsSavedPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.SHOPPING_CART_PRODUCTS.length === 0) {
          productsSavedHasMoreData = false
        } else {
          productsSavedPageNumber++;
          productsSavedHasMoreData = true;
          var productsSaved = result.data.payload.SHOPPING_CART_PRODUCTS;
          for (var i=0, j=productsSaved.length; i<j; i++) {
            productsSaved[i].product.cartId = productsSaved[i].id;
            productsSaved[i].product.mediaId = !!productsSaved[i].media ? productsSaved[i].media.id : null;
            productsSaved[i].product.visualTagId = !!productsSaved[i].visualTag ? productsSaved[i].visualTag.id : null;
            $scope.productsSaved.push(productsSaved[i].product);
          }
        }
      } else {
        productsSavedHasMoreData = false;
        console.log('error');
      }

      productsSavedApiLocker = false;
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

  // var getOrderHistory = function() {
  //   if (orderApiLocker || !orderHasMoreData) {
  //     return;
  //   }
  //
  //   orderApiLocker = true;
  //
  //   OrderCommissionService.getOrderHistory(userId, orderPageNumber).then(function(result) {
  //     if (UtilityService.validateResult(result)) {
  //       if (result.data.payload.ORDERS.length === 0) {
  //         orderHasMoreData = false
  //       } else {
  //         orderPageNumber++;
  //         orderHasMoreData = true;
  //         var orders = result.data.payload.ORDERS;
  //         for (var i=0,j=orders.length; i<j; i++) {
  //           var items = orders[i].itemsJson;
  //           for (var l=0,m=items.length; l<m; l++) {
  //             var item = {
  //               date: orders[i].date,
  //               seller: items[l].shoppingCartProductJson.product.sellerName,
  //               productName: items[l].shoppingCartProductJson.product.name,
  //               totalPrice: items[l].totalPrice,
  //               points: items[l].awardPoints.points
  //             };
  //             $scope.orderHistory.push(item);
  //           }
  //         }
  //       }
  //     } else {
  //       orderHasMoreData = false;
  //       console.log('error');
  //     }
  //
  //     orderApiLocker = false;
  //   });
  // };
  //
  // var getCommissionHistory = function() {
  //   if (commissionApiLocker || !commissionHasMoreData) {
  //     return;
  //   }
  //
  //   commissionApiLocker = true;
  //
  //   OrderCommissionService.getCommissionHistory(userId, commissionPageNumber).then(function(result) {
  //     if (UtilityService.validateResult(result)) {
  //       if (result.data.payload.COMMISSION_HISTORY.length === 0) {
  //         commissionHasMoreData = false
  //       } else {
  //         commissionPageNumber++;
  //         commissionHasMoreData = true;
  //         var commissionHistory = result.data.payload.COMMISSION_HISTORY;
  //         $scope.commissionHistory.push.apply($scope.commissionHistory, commissionHistory);
  //       }
  //     } else {
  //       commissionHasMoreData = false;
  //       console.log('error');
  //     }
  //
  //     commissionApiLocker = false;
  //   });
  // };

  var getMyStorefront = function() {
    if (storefrontApiLocker || !storefrontHasMoreData) {
      return;
    }

    storefrontApiLocker = true;

    UserMediaService.getCurrentUserMedia(userId, storefrontPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (storefrontPageNumber == 0) {
          $scope.user = result.data.payload.USER;
        }

        if (result.data.payload.MEDIAS.length === 0) {
          storefrontHasMoreData = false;
        } else {
          storefrontPageNumber++;
          storefrontHasMoreData = true;
          var storefront = result.data.payload.MEDIAS;
          $scope.storefront.push.apply($scope.storefront, storefront);
        }
      } else {
        storefrontHasMoreData = false;
        console.log('error');
      }

      storefrontApiLocker = false;
    });
  };

  var getMyStorefrontLiked = function() {
    if (storefrontLikedApiLocker || !storefrontLikedHasMoreData) {
      return;
    }

    storefrontLikedApiLocker = true;

    UserMediaService.getMediasLikedByUser(storefrontLikedPageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.MEDIAS_LIKED.length === 0) {
          storefrontLikedHasMoreData = false;
        } else {
          storefrontLikedPageNumber++;
          storefrontLikedHasMoreData = true;
          var storefrontLiked = result.data.payload.MEDIAS_LIKED;
          $scope.storefrontLiked.push.apply($scope.storefrontLiked, storefrontLiked);
        }
      } else {
        storefrontLikedHasMoreData = false;
        console.log('error');
      }

      storefrontLikedApiLocker = false;
    });
  };

  var addBackToCart = function(product) {
    var cartProduct = {
      id: product.cartId
    }

    CartService.addBackToCart(cartProduct).then(function(res) {
      if (UtilityService.validateResult(res)) {
        if (!!res.data.payload.SHOPPING_CART_PRODUCT && !!res.data.payload.SHOPPING_CART_PRODUCT.id) {
          UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Add saved product back to cart - CartProductId: ' + res.data.payload.SHOPPING_CART_PRODUCT.id);
          $scope.shoppingCartInfo.count += 1;
          localStorageService.set('shoppingCartInfo', $scope.shoppingCartInfo);
          productsSavedPageNumber = 1;
          productsSavedApiLocker = false;
          productsSavedHasMoreData = true;
          $scope.productsSaved = [];
          getProductsSavedForLater();
        }
      }
    });
  };

  var toggleSavedProductLike = function(product, savedProductsArray) {
    for(var i = 0, j = savedProductsArray.length; i < j; i++) {
      if(savedProductsArray[i].id == product.id) {
          savedProductsArray[i].socialActionUserProduct = {
            liked: product.socialActionUserProduct.liked
          };
      }
    };
    return savedProductsArray;
  };

  // $scope.logout = function() {
  //   UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Logout on profile page');
  //   var user = {
  //     id: userId
  //   };
  //
  //   LoginRegisterService.logout(user).then(function(res) {
  //     console.log('logout');
  //   });
  //
  //   InstagramService.logout();
  //   if(!!localStorageService.get('facebookAccessToken')) {
  //     SocialService.logout();
  //   }
  //   // localStorageService.remove('shoppingCart');
  //   // localStorageService.remove('shoppingCartInfo');
  //   localStorageService.clearAll();
  //   if (!!$cookies.PLAY_SESSION && $cookies.PLAY_SESSION.indexOf('SPREE_') != -1) {
  //     $cookies.PLAY_SESSION = null;
  //   }
  //
  //   $state.go('landing');
  // };

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

   var getFollowingByProfile = function() {
     if (followingApiLocker || !followingHasMoreData) {
       return;
     }
     followingApiLocker = true;
     PublicProfileService.getUserFollowing(userId, followingPageNumber).then(function(result){
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
     });
   };

  var getFollowersForProfile = function() {
    if (followersApiLocker || !followersHasMoreData) {
      return;
    }
    followersApiLocker = true;
    PublicProfileService.getUserFollowers(userId, followersPageNumber).then(function(result){
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
    });
  };

  var toggleFollowFlag = function(response) {
    if($scope.activeProfile == 2) {
      for(var i = 0, j = $scope.profileFollowing.length; i < j; i++) {
        if($scope.profileFollowing[i].id == response.id) {
          $scope.profileFollowing[i].profileFollow = !$scope.profileFollowing[i].profileFollow;
        }
        followersPageNumber = 1;
      };

    } else if($scope.activeProfile == 0) {
      for(var i = 0, j = $scope.profileFollowers.length; i < j; i++) {
        if($scope.profileFollowers[i].id == response.id) {
          $scope.profileFollowers[i].profileFollow = !$scope.profileFollowers[i].profileFollow;
        }
        followingPageNumber = 1;
      };
     }
  };

  var unFollowProfile = function(toggleProfileFollow) {
    var toggleProfileType = toggleProfileFollow.profileType;

    if(toggleProfileType == 'user') {
      SocialActionService.unfollowUser(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Profile Page', 'un-Follow user', 'un-Follow user ' + toggleProfileFollow.id + ' on profile page');
          toggleFollowFlag(response.data.payload.USER);
          $scope.totalFollowing--;
          $scope.profileFollowing = spliceFromArray($scope.profileFollowing, response.data.payload.USER.id);
        }
      });
    } else {
      SocialActionService.unfollowBrand(toggleProfileFollow.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Profile Page', 'un-Follow brand', 'un-Follow brand ' + toggleProfileFollow.id + ' on profile page');
          toggleFollowFlag(response.data.payload.BRAND);
          $scope.totalFollowing--;
          $scope.profileFollowing = spliceFromArray($scope.profileFollowing, response.data.payload.BRAND.id);
        }
      });
    }

  };

  var followProfileFlag = function(toggleProfileFollow) {
    var toggleProfileType =  toggleProfileFollow.profileType;
    SocialActionService.followUser(toggleProfileFollow.id).then(function(response){
      if(UtilityService.validateResult(response)) {
        UtilityService.gaTrackAppEvent('Profile Page', 'Follow user', 'Follow user ' + toggleProfileFollow.id + ' on profile page');
        toggleFollowFlag(response.data.payload.USER);
        $scope.totalFollowing++
      }
    });
  };

  $scope.toggleFollow = function(toggleProfileFollow) {

    var followProfile = toggleProfileFollow.profileFollow;

    if(!!followProfile) {
      unFollowProfile(toggleProfileFollow);
    } else {
      followProfileFlag(toggleProfileFollow);
    }
  };

  $scope.goToCommissionPage = function() {
    localStorageService.set('earningsTrackHistory', $scope.profileData.source);
    $state.go('earnings');
  };

  $scope.addBackToCart = function(product) {
    addBackToCart(product);
  };

  $scope.mediaDetail = function(discoverMedia) {
    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Media detail page from profile - Media: ' + discoverMedia.id);
    discoverMedia.source = $scope.profileData.source;
    localStorageService.set('discoverMedia', discoverMedia);
    localStorageService.set('gridListViewOption', $scope.gridListView);
    $state.go('media', {mediaId: discoverMedia.id});
  };

  $scope.getMediaOwner = function(mediaOwner) {
    console.log(mediaOwner);
    MediaTagService.getMediaOwner(mediaOwner.id).then(function(res){
      console.log(res);
      if(UtilityService.validateResult(res)) {
        UtilityService.gaTrackAppEvent('Profile Page', 'Get Media Owner', 'Media owner id - ' + mediaOwner.id + ' from profile page');
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
            UtilityService.gaTrackAppEvent('Profile Page', 'Unlike media', 'Unlike media id - ' + discoverMediaTag.id + ' on profile - liked posts page');
            $scope.storefrontLiked = setMediaLike(response.data.payload.MEDIA, $scope.storefrontLiked);
          } else {
            UtilityService.gaTrackAppEvent('Profile Page', 'Unlike media', 'Unlike media id - ' + discoverMediaTag.id + ' on profile - imported posts page');
            $scope.storefront = setMediaLike(response.data.payload.MEDIA, $scope.storefront);
          }
        }
      });

    } else {
      UserMediaService.likeMedia(discoverMediaTag.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          if ($scope.activeProfile == 12) {
            UtilityService.gaTrackAppEvent('Profile Page', 'Like media', 'Like media id - ' + discoverMediaTag.id + ' on profile - liked posts page');
            $scope.storefrontLiked = setMediaLike(response.data.payload.MEDIA, $scope.storefrontLiked);
          } else {
            UtilityService.gaTrackAppEvent('Profile Page', 'Like media', 'Like media id - ' + discoverMediaTag.id + ' on profile - imported posts page');
            $scope.storefront = setMediaLike(response.data.payload.MEDIA, $scope.storefront);
          }
        }
      });
    }

  };

  $scope.mediaProductDetail = function(product, mediaId) {
    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Product detail page from profile - Media: ' + mediaId + ' - Product: ' + product.id);

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

  $scope.productDetail = function(product) {
    if (productDetailLocker) {
      return;
    }
    productDetailLocker = true;
    product.affiliateURL = decodeURIComponent(product.buyURL);
    product.mediaId = !!product.mediaId ? product.mediaId : null;
    product.visualTagId = !!product.visualTagId ? product.visualTagId : null;

    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Product detail page from profile - Product: ' + product.id);

    ProductDetailService.getProductDetail(product.id).then(function(response){
      if (UtilityService.validateResult(response)) {
        console.log(response);
        var productDetail = {
          xapp: product,
          source: $scope.profileData.source
        };

        if(response.data.payload.PRODUCT.twoTapData) {
          productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
        }

        localStorageService.set('productDetail', productDetail);
        productDetailLocker = false;

        $state.go('product', {productId: product.id});

        // if (response.data.payload.PRODUCT.twoTapData) {
        //   var productDetail = {
        //     xapp: product,
        //     twotap: response.data.payload.PRODUCT.twoTapData,
        //     source: $scope.profileData.source
        //   };
        //   localStorageService.set('productDetail', productDetail);
        //   productDetailLocker = false;
        //
        //   $state.go('product', {productId: product.id});
        // } else {
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
        //       var productDetail = {
        //         xapp: product,
        //         twotap: response,
        //         source: $scope.profileData.source
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

  $scope.viewProfile = function(profileDetails) {
    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Go to public profile - ' + profileDetails.id + ' from profile page');
    console.log(profileDetails);
    var profileDetailsType = profileDetails.profileType;
    var profileId = profileDetails.id;
    $state.go('profile', {Id: profileId, type:profileDetailsType, source: 'settings'});
  };

  $scope.toggleGridListView = function(index) {
    if (index === 0) {
      $scope.gridListView = 0;
    } else {
      $scope.gridListView = 1;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.userActiveProfile = function(index) {
    if (index === 0) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to order history on profile page');
      $scope.activeProfile = 0;
      getFollowersForProfile();
    } else if (index === 1) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to posts on profile page');
      $scope.activeProfile = 11;
      getMyStorefront();
    } else if (index === 11) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to posts - imported on profile page');
      $scope.activeProfile = 11;
      getMyStorefront();
      $ionicScrollDelegate.resize();
    } else if (index === 12) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to posts - liked on profile page');
      $scope.activeProfile = 12;
      getMyStorefrontLiked();
      $ionicScrollDelegate.resize();
    } else if (index === 2) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to commission history on profile page');
      $scope.activeProfile = 2;
      getFollowingByProfile();
    } else if (index === 3) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to products on profile page');
      $scope.activeProfile = 31;
      $scope.profileData.productsType = 'liked';
      // getProductsLikedByUser();
    } else if (index === 31) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to products - liked on profile page');
      $scope.activeProfile = 31;
      $scope.profileData.productsType = 'liked';
      // getProductsLikedByUser();
    } else if (index === 32) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Switch', 'Switch to products - saved on profile page');
      $scope.activeProfile = 32;
      $scope.profileData.productsType = 'saved';
      // getProductsSavedForLater();
    }
  };

  $scope.hasMoreData = function() {
    if ($scope.activeProfile === 0) {
      return followersHasMoreData;
    } else if ($scope.activeProfile === 1) {
      return storefrontHasMoreData;
    } else if ($scope.activeProfile === 11) {
      return storefrontHasMoreData;
    } else if ($scope.activeProfile === 12) {
      return storefrontLikedHasMoreData;
    } else if ($scope.activeProfile === 2) {
      return followingHasMoreData;
    } else if ($scope.activeProfile === 3) {
      return productsLikedHasMoreData;
    } else if ($scope.activeProfile === 31) {
      return productsLikedHasMoreData;
    } else if ($scope.activeProfile === 32) {
      return productsSavedHasMoreData;
    }
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData()) {
      return;
    }

    if ($scope.activeProfile === 0) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more followers on profile page');
      getFollowersForProfile();
    } else if ($scope.activeProfile === 1) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more posts on profile page');
      getMyStorefront();
    } else if ($scope.activeProfile === 11) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products - imported on profile page');
      getMyStorefront();
    } else if ($scope.activeProfile === 12) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products - liked on profile page');
      getMyStorefrontLiked();
    } else if ($scope.activeProfile === 2) {
      UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more following on profile page');
      getFollowingByProfile();
    } else if ($scope.activeProfile === 3) {
      // UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products on profile page');
      // getProductsLikedByUser();
      if (!!localStorageService.get('filteredProductsHasMoreData')) {
        console.log('emiting...');
        $rootScope.$emit('loadMoreFilteredProducts', {source: 'settings'});
      } else {
        productsLikedHasMoreData = false;
      }
    } else if ($scope.activeProfile === 31) {
      // UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products - liked on profile page');
      // getProductsLikedByUser();
      if (!!localStorageService.get('filteredProductsHasMoreData')) {
        console.log('emiting...');
        $rootScope.$emit('loadMoreFilteredProducts', {source: 'settings'});
      } else {
        productsLikedHasMoreData = false;
      }
    } else if ($scope.activeProfile === 32) {
      // UtilityService.gaTrackAppEvent('Profile Page', 'Scroll down', 'Scroll down to load more products - saved on profile page');
      // getProductsSavedForLater();
      if (!!localStorageService.get('filteredProductsHasMoreData')) {
        console.log('emiting...');
        $rootScope.$emit('loadMoreFilteredProducts', {source: 'settings'});
      } else {
        productsSavedHasMoreData = false;
      }
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };

  $scope.disLikeProduct = function(disLikeProduct) {

    var likedProduct = !!disLikeProduct.socialActionUserProduct ? disLikeProduct.socialActionUserProduct.liked : false;

    if(!!likedProduct) {
      ProductDetailService.unlikeProduct(disLikeProduct.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          productsLikedPageNumber = 1;
          productsLikedApiLocker = false;
          productsLikedHasMoreData = true;
          $scope.productsLiked = [];
          getProductsLikedByUser();
        }
      });
    }
  };

  $scope.toggleLikeSavedProduct = function(toggleLikeProduct) {

    var likeSavedProduct = !!toggleLikeProduct.socialActionUserProduct ? toggleLikeProduct.socialActionUserProduct.liked : false;

    if(!!likeSavedProduct) {
      ProductDetailService.unlikeProduct(toggleLikeProduct.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Profile Page', 'Unlike product', 'Unlike product id - ' + toggleLikeProduct.id + ' on profile page');
          $scope.productsSaved = toggleSavedProductLike(response.data.payload.PRODUCT, $scope.productsSaved);
        }
      });
    } else {
      ProductDetailService.likeProduct(toggleLikeProduct.id).then(function(response){
        if(UtilityService.validateResult(response)) {
          UtilityService.gaTrackAppEvent('Profile Page', 'Like product', 'Like product id - ' + toggleLikeProduct.id + ' on profile page');
          $scope.productsSaved = toggleSavedProductLike(response.data.payload.PRODUCT, $scope.productsSaved);
        }
      });
    }
  };

  $scope.socialIconSettings = function() {
    if(!!localStorageService.get('socialSettingsViewMode')) {
      localStorageService.remove('socialSettingsViewMode');
    }
    console.log('social icons clicked');
    UtilityService.gaTrackAppEvent('Profile Page', 'Click', 'Go to settings social page from Profile page');
    $state.go('settingsSocial', {mode: 0});
  };

  $scope.$on('$ionicView.enter', function() {
    if (!!localStorageService.get('gridListViewOption')) {
      $scope.gridListView = localStorageService.get('gridListViewOption');
    } else {
      $scope.gridListView = 0;
    }

    getProfileDetails();
    getOutstandingCommission();
    getAvailablePoints();
    $scope.userActiveProfile(1);
    // getLikedFilteredSellers();
    // getLikedFilteredBrands();
    // getSavedFilteredSellers();
    // getSavedFilteredBrands();
  });
}]);
