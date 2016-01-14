'use strict';

angular.module('sywStyleXApp')
.service('apiRepository', ['$rootScope', '$http', 'ENV', function($rootScope, $http, ENV) {

  var self = this;
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  // Any service call must be made through this method only.
  // Repository's public methods should call this private method.
  var serviceCall = function(httpMethod, path, inputParams) {

    var nocache = "&nocache=" + Math.random();
    var url = ENV.apiEndpoint + path + "?" +  ((httpMethod == "GET" || httpMethod == "DELETE") ? nocache : '');

    return $http({
      method: httpMethod,
      cache: false,
      url: url,
      params: (httpMethod == "GET" || httpMethod == "DELETE") ? inputParams : "",
      data: (httpMethod == "POST") ? jQuery.param(inputParams) : ""
    }).success(function(data, status, headers, config) {
      if (data.error) {
        // if (path != 'mail/notifyapierror') {
        //   self.postAlertEmail(path, data);
        // }
        console.log(data.error);
      }
      return data;
    // }).error(function(data, status, headers, config) {
    //   if (path != 'mail/notifyapierror') {
    //     self.postAlertEmail(path, data);
    //   }
    //   return data;
    });

  };

  var validateInputs = function(inputParams) {
    // go thru every prop and make sure it's not null
    for (var prop in inputParams) {
      if(prop === null) {
        return false;
      }
    }
    return true;
  };

  this.getAppVersion = function() {
    return serviceCall('GET', 'getAppVersion');
  };

  // this.postAlertEmail = function(api, error) {
  //   var userId = !!localStorageService.get('userId') ? localStorageService.get('userId') : '000000';
  //   var inputParams = {
  //     api: api,
  //     error: JSON.stringify(error),
  //     userId: userId
  //   };
  //
  //   return serviceCall('POST', 'mail/notifyapierror', inputParams);
  // };

  this.login = function(email, password) {
    var inputParams = {
      email: email,
      password: password
    };

    return serviceCall('POST', 'user/login', inputParams);
  };

  this.logout = function(user) {
    var inputParams = {
      user: user
    };

    return serviceCall('POST', 'user/logout', inputParams);
  };

  this.register = function(email, password, displayName, termsOfUse, instagramUserId) {
    var inputParams = {
      email: email,
      password: password,
      displayName: displayName,
      termsOfUse: termsOfUse,
      instagramUserId: instagramUserId
    };

    return serviceCall('POST', 'user/register', inputParams);
  };

  this.registerCheckemail = function(email) {
    var inputParams = {
      email: email
    };

    return serviceCall('GET', 'user/register/checkemail', inputParams);
  };

  this.registerCheckpassword = function(password) {
    var inputParams = {
      password: password
    };

    return serviceCall('GET', 'user/register/checkpassword', inputParams);
  };

  this.passwordChange = function(oldPassword, newPassword, newPasswordConfirm) {
    var inputParams = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      newPasswordConfirm: newPasswordConfirm
    };

    return serviceCall('POST', 'user/change/password', inputParams);
  };

  this.passwordForgot = function(email) {
    var inputParams = {
      email: email
    };

    return serviceCall('POST', 'user/forgot/password', inputParams);
  };

  this.passwordReset = function(code, password, passwordConfirm) {
    var inputParams = {
      code: code,
      password: password,
      passwordConfirm: passwordConfirm
    };

    return serviceCall('POST', 'user/reset/password', inputParams);
  };

  this.importUserMedia = function(user, medias) {
    var inputParams = {
      user: user,
      medias: medias
    };

    return serviceCall('POST', 'user/add/media', inputParams);
  };

  this.getCurrentUserMedia = function(userId, pageNumber) {
    var inputParams = {
      userId: userId,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'user/get/media', inputParams);
  };

  this.getAllMedia = function(longitude, latitude, pageNumber) {
    var inputParams = {
      longitude: longitude,
      latitude: latitude,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'media/all', inputParams);
  };

  this.getAllPopularMedia = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'media/popular', inputParams);
  };

  this.getLatestMedia = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'media/latest', inputParams);
  };

  this.getCurrentMedia = function(id) {
    return serviceCall('GET', 'media/' + id);
  };

  this.searchProducts = function(pageNumber, keyword, filterParams) {
    var inputParams = {
      pageNumber: pageNumber,
      keyword: keyword,
      sellerIds: filterParams.sellerIds,
      brandIds: filterParams.brandIds,
      categoryIds: filterParams.categoryIds,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
      sale: filterParams.sale,
      sortBy: filterParams.selectedSortby
    };

    return serviceCall('POST', 'products/search', inputParams);
  };

  this.addMediaTag = function(user, media, visualTag, productIds) {
    var inputParams = {
      user: user,
      media: media,
      visualTag: visualTag,
      productIds: productIds
    };

    return serviceCall('POST', 'media/add/tag', inputParams);
  };

  this.deleteMediaTag = function(visualTag) {
    var inputParams = {
      visualTag: visualTag
    };

    return serviceCall('POST', 'media/delete/tag', inputParams);
  };

  this.getMediaTags = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('GET', 'media/get/tags', inputParams);
  };

  this.addTagProducts = function(visualTag, productIds) {
    var inputParams = {
      visualTag: visualTag,
      productIds: productIds
    };

    return serviceCall('POST', 'tag/add/products', inputParams);
  };

  this.deleteTagProduct = function(visualTag, product) {
    var inputParams = {
      visualTag: visualTag,
      product: product
    };

    return serviceCall('POST', 'tag/delete/product', inputParams);
  };

  this.getVisualTagId = function(productId, mediaId) {
    var inputParams = {
      productId: productId,
      mediaId: mediaId
    };

    return serviceCall('GET', 'product/visualtagid', inputParams);
  };

  this.getUserInstagramFeed = function(userId, next_max_id) {
    var inputParams = {
      userId: userId,
      next_max_id: next_max_id
    };

    return serviceCall('GET', 'instagram/user/feed', inputParams);
  };

  this.getUserInstagramMedia = function(userId, next_max_id) {
    var inputParams = {
      userId: userId,
      next_max_id: next_max_id
    };

    return serviceCall('GET', 'instagram/user/media', inputParams);
  };

  this.addAddress = function(user, address) {
    var inputParams = {
      user: user,
      address: address
    };

    return serviceCall('POST', 'address/add', inputParams);
  };

  this.updateAddress = function(user, address) {
    var inputParams = {
      user: user,
      address: address
    };

    return serviceCall('POST', 'address/update', inputParams);
  };

  this.deleteAddress = function(user, address) {
    var inputParams = {
      user: user,
      address: address
    };

    return serviceCall('POST', 'address/delete', inputParams);
  };

  this.verifyAddress = function(user, address) {
    var inputParams = {
      user: user,
      address: address
    };

    return serviceCall('POST', 'address/verify', inputParams);
  };

  this.getAddress = function(addressType) {
    var inputParams = {
      addressType: addressType
    };

    return serviceCall('GET', 'address/get', inputParams);
  };

  this.addProductsToCart = function(user, product, media, visualTag , productMetadata, quantity, shippingMethod, originalUrl) {
    var inputParams = {
      user: user,
      product: product,
      media: media,
      visualTag: visualTag,
      productMetadata: productMetadata,
      quantity: quantity,
      shippingMethod: shippingMethod,
      originalUrl: originalUrl
    };

    return serviceCall('POST', 'cart/discover/add', inputParams);
  };

  this.addShopProductsToCart = function(user, product, productMetadata, quantity, shippingMethod, originalUrl) {
    var inputParams = {
      user: user,
      product: product,
      productMetadata: productMetadata,
      quantity: quantity,
      shippingMethod: shippingMethod,
      originalUrl: originalUrl
    };

    return serviceCall('POST', 'cart/shop/add', inputParams);
  };

  this.updateProductsInCart = function(user, cartProductId, color, size, quantity) {
    var inputParams = {
      user: user,
      cartProductId: cartProductId,
      color: color,
      size: size,
      quantity: quantity
    };

    return serviceCall('POST', 'cart/update', inputParams);
  };

  this.deleteProductsFromCart = function(shoppingCart, cartProduct) {
    var inputParams = {
      shoppingCart: shoppingCart,
      cartProduct: cartProduct
    };

    return serviceCall('POST', 'cart/delete', inputParams);
  };

  this.getProductsFromCart = function(userId, twoTapForceSync) {
    var inputParams = {
      userId: userId,
      twoTapForceSync: twoTapForceSync
    };

    return serviceCall('GET', 'cart/get', inputParams);
  };

  this.saveForLaterFromCart = function(cartProduct) {
    var inputParams = {
      cartProduct: cartProduct
    };

    return serviceCall('POST', 'cart/saveforlater', inputParams);
  };

  this.addBackToCart = function(cartProduct) {
    var inputParams = {
      cartProduct: cartProduct
    };

    return serviceCall('POST', 'cart/addback', inputParams);
  };

  this.createProducts = function(affiliateProducts) {
    var inputParams = {
      affiliateProducts: affiliateProducts
    };

    return serviceCall('POST', 'products/create', inputParams);
  };

  this.createOrder = function(user, shippingAddress, billingAddress, salesTax, shippingPrice, totalPrice, items) {
    var inputParams = {
      user: user,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      salesTax: salesTax,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      offer: {
        id: 1
      },
      items: items
    };

    return serviceCall('POST', 'order/createorder', inputParams);
  };

  this.getOrderHistory = function(userId, pageNumber) {
    var inputParams = {
      id: userId,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'order/getorders', inputParams);
  };

  this.getOutstandingCommission = function(userId) {
    var inputParams = {
      id: userId
    };

    return serviceCall('GET', 'order/commission/outstanding', inputParams);
  };

  this.getAvailablePoints = function(userId) {
    var inputParams = {
      id: userId
    };

    return serviceCall('GET', 'points/available', inputParams);
  };

  this.getRedeemableCommission = function(userId) {
    var inputParams = {
      id: userId
    };

    return serviceCall('GET', 'order/commission/redeemable', inputParams);
  };

  this.getCommissionHistory = function(userId, pageNumber) {
    var inputParams = {
      userId: userId,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'user/commission/history', inputParams);
  };

  this.getProductDetail = function(productId) {
    var inputParams = {
      id: productId
    };

    return serviceCall('GET', 'products/get', inputParams);
  };

  this.getRelevantPosts = function(pageNumber, productId) {
    var inputParams = {
      pageNumber: pageNumber,
      id: productId
    };

    return serviceCall('GET', 'media/relevant', inputParams);
  };

  this.likeProduct = function(productId) {
    var inputParams = {
      product: {
        id: productId
      }
    };

    return serviceCall('POST', 'product/like', inputParams);
  };

  this.unlikeProduct = function(productId) {
    var inputParams = {
      product: {
        id: productId
      }
    };

    return serviceCall('POST', 'product/unlike', inputParams);
  };

  this.likeMedia = function(mediaId) {
    var inputParams = {
      media: {
        id: mediaId
      }
    };

    return serviceCall('POST', 'social/medialike', inputParams);
  };

  this.unlikeMedia = function(mediaId) {
    var inputParams = {
      media: {
        id: mediaId
      }
    };

    return serviceCall('POST', 'social/mediaunlike', inputParams);
  };

  this.getProductsSavedForLater = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'cart/savedforlater', inputParams);
  };

  this.getProductsLikedByUser = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'products/likedbyuser', inputParams);
  };

  this.getMediasLikedByUser = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'social/mediauserliked', inputParams);
  };

  this.getAllBrands = function() {
    return serviceCall('GET', 'brand/getall');
  };

  this.getBrandsAtoZ = function(atoz, pageNumber) {
    var inputParams = {
      atoz: atoz,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/getbrandsatoz', inputParams);
  };

  this.getRecommendedBrands = function() {
    return;
  };

  this.getMyBrands = function(pageNumber) {
    var inputParams = {
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/followedbyme', inputParams);
  };

  this.getBrandDetail = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('GET', 'brand/get', inputParams);
  };

  this.followBrand = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('POST', 'brand/follow', inputParams);
  };

  this.unfollowBrand = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('POST', 'brand/unfollow', inputParams);
  };

  this.followUser = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('POST', 'user/follow', inputParams);
  };

  this.unfollowUser = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('POST', 'user/unfollow', inputParams);
  };

  this.getBrandFollowers = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/followers', inputParams);
  };

  this.getProductsByBrand = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'product/getbybrand', inputParams);
  };

  this.getFilteredProducts = function(brandIds, sellerIds, sortBy, pageNumber, filterRequest) {
    var inputParams = {
      brandIds: brandIds,
      sellerIds: sellerIds,
      sortBy: sortBy,
      pageNumber: pageNumber,
      filterRequest: filterRequest
    };

    return serviceCall('POST', 'product/filter', inputParams);
  };

  this.getFilteredBrandSellers = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/sellers', inputParams);
  };

  this.getFilteredSellers = function(key, pageNumber) {
    var inputParams = {
      key: key,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'seller/getfiltered', inputParams);
  };

  this.getFilteredBrands = function(key, pageNumber) {
    var inputParams = {
      key: key,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/getfiltered', inputParams);
  };

  this.getBrandPosts = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'brand/posts', inputParams);
  };

  this.getPublicProfile = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('GET', 'user/get/publicprofile', inputParams);
  };

  this.getUserFollowers = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'user/followsme', inputParams);
  };

  this.getUserFollowing = function(id, pageNumber) {
    var inputParams = {
      id: id,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'user/followedbyme', inputParams);
  };

  this.getMediaOwner = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('GET', 'media/owner', inputParams);
  };

  this.updateFacebookInfo = function(facebookAccessToken, facebookFullName, facebookUserId) {
    var inputParams = {
      facebookAccessToken: facebookAccessToken,
      facebookFullName: facebookFullName,
      facebookUserId: facebookUserId
    };

    return serviceCall('POST', 'social/updatefacebookuser', inputParams);
  };

  this.getUserSocialAccounts = function(id) {
    var inputParams = {
      id: id
    };

    return serviceCall('GET', 'user/getUser', inputParams);
  };

  this.getCheckoutSummary = function(selectedProducts) {
    var inputParams = {
      selectedProducts: selectedProducts
    };

    return serviceCall('POST', 'checkout/get', inputParams);
  };

  this.placeOrder = function(shoppingCartProductGroups, cartId, pidMap, noauthCheckout, totalPrice, shippingPrice, salesTax) {
    var inputParams = {
      shoppingCartProductGroups: shoppingCartProductGroups,
      cartId: cartId,
      pidMap: pidMap,
      noauthCheckout: noauthCheckout,
      totalPrice: totalPrice,
      shippingPrice: shippingPrice,
      salesTax: salesTax
    };

    return serviceCall('POST', 'checkout/purchase', inputParams);
  };

  this.getAggregation = function(keyword, sellerIds, brandIds, categoryIds, minPrice, maxPrice, sale) {
    var inputParams = {
      keyword: keyword,
      sellerIds: sellerIds,
      brandIds: brandIds,
      categoryIds: categoryIds,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sale: sale
    };

    return serviceCall('POST', 'products/getaggregation', inputParams);

  };

  this.getShopSellers = function(filter) {
    var inputParams = {
      filter: filter
    };

    return serviceCall('GET', 'seller/shop', inputParams);
  };

  this.getSellerProducts = function(sellerId, filter, pageNumber) {
    var inputParams = {
      sellerId: sellerId,
      filter: filter,
      pageNumber: pageNumber
    };

    return serviceCall('GET', 'seller/products', inputParams);
  };

  this.getAdminSellers = function() {
    return serviceCall('GET', 'seller/getall');
  };

  this.updateAdminSellers = function(sellers) {
    var inputParams = {
      sellers: sellers
    };

    return serviceCall('POST', 'seller/updateall', inputParams);
  };

}]);
