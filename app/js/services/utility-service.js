'use strict';

angular.module('sywStyleXApp')
.service('UtilityService', ['$rootScope', '$http', 'ENV', function($rootScope, $http, ENV) {
  var getQueryStrings = function(location) {
    var assoc = {};
    var decode = function(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }

    return assoc;
  };

  var getParameterByName = function (paramName) {
    paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  this.updateTopFilter = function(filter) {
    $rootScope.$emit('event.updateTopFilter', {topFilter: filter});
  };

  this.getQueryStringFromUrl = function (location, queryString) {
    //alert(getParameterByName(queryString));
    return getParameterByName(queryString);
    //var queryStrings = getQueryStrings(location);
    //return queryStrings[queryString];
  };

  this.emojiParse = function(string) {
    // return string;
    return string.replace(/\\u[0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z]/g, '');
  };

  this.productNameParser = function(string, substring) {
    return string.replace(substring, '').replace(/[?]/g, '').trim();
  };

  this.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }

    return "";
  };


  this.cjProductUrlParser = function(url) {
    var productURL = decodeURIComponent(url.split('?url=')[1]).split('&cjsku')[0];

    if (productURL.indexOf('targetUrl=') != -1) {
      productURL = productURL.split('targetUrl=')[1];
    }

    // handling with bluefly
    if (productURL.indexOf('&cm_mmc=') != -1) {
      productURL = productURL.split('&cm_mmc=')[0];
    }

    return productURL;
  };

  this.numberParser = function(number) {
    if (typeof(number) != 'number') {
      number = Number(number.replace('$',''));
    }

    return Number(parseFloat(Math.round(number * 100) / 100).toFixed(2));
  };

  this.getProductsFromVisualTags = function(visualTags) {
    var productIds = [];

    for (var i=0, j=visualTags.length; i<j; i++) {
      var products = visualTags[i].products;
      for (var m=0, n=products.length; m<n; m++) {
        productIds.push(products[m].id);
      }
    }

    return productIds;
  };

  this.getProductFromArrayByUrl = function(array, originalUrl) {
    for (var i=0, j=array.length; i<j; i++) {
      if (array[i].originalUrl == originalUrl) {
        return array[i];
      }
    }
  };

  this.getMatchedFromArray = function(array, product) {
    var index = -1;

    for (var i=0, j=array.length; i<j; i++) {
      if (array[i].productId == product.productId) {
        if (!!product.color && (array[i].color != product.color)) {
          continue;
        }

        if (!!product.size && (array[i].size != product.size)) {
          continue;
        }

        index = i;
      }
    }

    return index;
  };

  this.truncateToLimit = function(input, limitTo){

  	var name = new String(input);
  	if(name.length <= limitTo){
  		return name.valueOf();
  	}

  	var truncatedStr = input.substr(0, limitTo);
  	var lastSpaceIndex = truncatedStr.lastIndexOf(' ');

  	if(lastSpaceIndex != -1){
  		truncatedStr = truncatedStr.substr(0, lastSpaceIndex) + '...';
  	}
  	return truncatedStr;
  };

  this.validateResult = function(result) {
    return result && result.data && !result.data.error && !result.data.errors;
  };

  this.getImageHeight = function(numOfColumn) {
    var deviceWidth = screen.width;
    if (deviceWidth > 640) {
      deviceWidth = 640;
    }

    if (numOfColumn == 1) {
      return (deviceWidth - 2);
    } else if (numOfColumn == 2) {
      return deviceWidth/2.0 - 12;
    } else if (numOfColumn == 3) {
      return (deviceWidth-12)/3.0;
    } else if (numOfColumn == 0) {
      return (deviceWidth * 307.0)/750.0;
    } else {
      return deviceWidth;
    }
  };

  this.getCreditCardType = function(number) {
    // visa
    var re = new RegExp('^4');
    if (number.match(re) != null)
        return 'Visa';

    // Mastercard
    re = new RegExp('^5[1-5]');
    if (number.match(re) != null)
        return 'Mastercard';

    // AMEX
    re = new RegExp('^3[47]');
    if (number.match(re) != null)
        return 'American Express';

    // Discover
    re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5])|64[4-9]|65)');
    if (number.match(re) != null)
        return 'Discover';

    return 'unsupported';
  };

}])
.service('LoginRegisterService', ['apiRepository', function(apiRepository) {
  this.login = function(email, password) {
    return apiRepository.login(email, password);
  };

  this.logout = function(user) {
    return apiRepository.logout(user);
  };

  this.register = function(email, password, displayName, termsOfUse, instagramUserId) {
    return apiRepository.register(email, password, displayName, termsOfUse, instagramUserId);
  };

  this.registerCheckemail = function(email) {
    return apiRepository.registerCheckemail(email);
  };

  this.registerCheckpassword = function(password) {
    return apiRepository.registerCheckpassword(password);
  };

  this.passwordChange = function(oldPassword, newPassword, newPasswordConfirm) {
    return apiRepository.passwordChange(oldPassword, newPassword, newPasswordConfirm);
  };

  this.passwordForgot = function(email) {
    return apiRepository.passwordForgot(email);
  };

  this.passwordReset = function(code, password, passwordConfirm) {
    return apiRepository.passwordReset(code, password, passwordConfirm);
  };
}])
.service('UserInstagramService', ['apiRepository', function(apiRepository) {

  this.getUserInstagramFeed = function(userId, next_max_id) {
    return apiRepository.getUserInstagramFeed(userId, next_max_id);
  };

  this.getUserInstagramMedia = function(userId, next_max_id) {
    return apiRepository.getUserInstagramMedia(userId, next_max_id);
  };

}])
.service('UserMediaService', ['apiRepository', function(apiRepository) {
  this.formatMediaObj = function(instagramMedias) {
    var medias = [];
    for(var i=0, j=instagramMedias.length; i<j; i++) {
      var media = {};
      media.mediaType = instagramMedias[i].type.toUpperCase();
      media.tags = instagramMedias[i].tags.toString();
      media.instagramId = instagramMedias[i].id;
      media.instagramUserProfileUrl = instagramMedias[i].user.profile_picture;
      media.instagramUserName = instagramMedias[i].user.username;
      media.thumbnailURL = instagramMedias[i].images.thumbnail.url;
      media.thumbnailWidth = instagramMedias[i].images.thumbnail.width;
      media.thumbnailHeight = instagramMedias[i].images.thumbnail.height;
      media.lowResolutionURL = instagramMedias[i].images.low_resolution.url;
      media.lowResolutionWidth = instagramMedias[i].images.low_resolution.width;
      media.lowResolutionHeight = instagramMedias[i].images.low_resolution.height;
      media.standardResolutionURL = instagramMedias[i].images.standard_resolution.url;
      media.standardResolutionWidth = instagramMedias[i].images.standard_resolution.width;
      media.standardResolutionHeight = instagramMedias[i].images.standard_resolution.height;

      if (!!instagramMedias[i].location) {
        media.locationName = instagramMedias[i].location.name;
        media.latitude = instagramMedias[i].location.latitude;
        media.longitude = instagramMedias[i].location.longitude;
        media.locationId = instagramMedias[i].location.id;
      } else {
        media.locationName = '';
        media.latitude = '';
        media.longitude = '';
        media.locationId = '';
      }
      media.caption = (!!instagramMedias[i].caption) ? instagramMedias[i].caption.text : '';
      media.likes = (!!instagramMedias[i].likes.count) ? instagramMedias[i].likes.count : '';

      medias.push(media);
    }

    return medias;
  };

  this.importUserMedia = function(user, medias) {
    return apiRepository.importUserMedia(user, medias);
  };

  this.getCurrentUserMedia = function(userId, pageNumber) {
    return apiRepository.getCurrentUserMedia(userId, pageNumber);
  };

  this.getAllMedia = function(longitude, latitude, pageNumber) {
    return apiRepository.getAllMedia(longitude, latitude, pageNumber);
  };

  this.getAllPopularMedia = function(pageNumber) {
    return apiRepository.getAllPopularMedia(pageNumber);
  };

  this.getLatestMedia = function(pageNumber) {
    return apiRepository.getLatestMedia(pageNumber);
  };

  this.getCurrentMedia = function(id) {
    return apiRepository.getCurrentMedia(id);
  };

  this.getMediasLikedByUser = function(pageNumber) {
    return apiRepository.getMediasLikedByUser(pageNumber);
  };

  this.likeMedia = function(mediaId) {
    return apiRepository.likeMedia(mediaId);
  };

  this.unlikeMedia = function(mediaId) {
    return apiRepository.unlikeMedia(mediaId);
  };
}])
.service('ProductSearchService', ['apiRepository', function(apiRepository) {

  this.searchProducts = function(pageNumber, keyword, filterParams) {
    return apiRepository.searchProducts(pageNumber, keyword, filterParams);
  };

  this.createProducts = function(affiliateProducts) {
    return apiRepository.createProducts(affiliateProducts);
  };

  this.getAggregation = function(keyword, sellerIds, brandIds, categoryIds, minPrice, maxPrice, sale) {
    return apiRepository.getAggregation(keyword, sellerIds, brandIds, categoryIds, minPrice, maxPrice, sale);
  }

}])
.service('MediaTagService', ['apiRepository', function(apiRepository) {

  this.addMediaTag = function(user, media, visualTag, productIds) {
    return apiRepository.addMediaTag(user, media, visualTag, productIds);
  };

  this.deleteMediaTag = function(visualTag) {
    return apiRepository.deleteMediaTag(visualTag);
  };

  this.getMediaTags = function(id) {
    return apiRepository.getMediaTags(id);
  };

  this.addTagProducts = function(visualTag, productIds) {
    return apiRepository.addTagProducts(visualTag, productIds);
  };

  this.deleteTagProduct = function(visualTag, product) {
    return apiRepository.deleteTagProduct(visualTag, product);
  };

  this.getVisualTagId = function(productId, mediaId) {
    return apiRepository.getVisualTagId(productId, mediaId);
  };

  this.getMediaOwner = function(id){
    return apiRepository.getMediaOwner(id);
  };

}])
.service('CartService', ['apiRepository', function(apiRepository) {

  this.addProductsToCart = function(user, product,  media, visualTag, productMetadata, quantity, shippingMethod, originalUrl) {
    return apiRepository.addProductsToCart(user, product, media, visualTag, productMetadata, quantity, shippingMethod, originalUrl);
  };

  this.addShopProductsToCart = function(user, product, productMetadata, quantity, shippingMethod, originalUrl) {
    return apiRepository.addShopProductsToCart(user, product, productMetadata, quantity, shippingMethod, originalUrl);
  };

  this.updateProductsInCart = function(user, cartProductId, color, size, quantity) {
    return apiRepository.updateProductsInCart(user, cartProductId, color, size, quantity);
  };

  this.deleteProductsFromCart = function(cart, cartProduct) {
    return apiRepository.deleteProductsFromCart(cart, cartProduct);
  };

  this.getProductsFromCart = function(userId, twoTapForceSync) {
    return apiRepository.getProductsFromCart(userId, twoTapForceSync);
  };

  this.saveForLaterFromCart = function(cartProduct) {
    return apiRepository.saveForLaterFromCart(cartProduct);
  };

  this.addBackToCart = function(cartProduct) {
    return apiRepository.addBackToCart(cartProduct);
  };

}])
.service('AddressService', ['apiRepository', function(apiRepository) {

  this.addAddress = function(user, address) {
    return apiRepository.addAddress(user, address);
  };

  this.updateAddress = function(user, address) {
    return apiRepository.updateAddress(user, address);
  };

  this.deleteAddress = function(user, address) {
    return apiRepository.deleteAddress(user, address);
  };

  this.verifyAddress = function(user, address) {
    return apiRepository.verifyAddress(user, address);
  };

  this.getAddress = function(addressType) {
    return apiRepository.getAddress(addressType);
  };

}])
.service('OrderCommissionService', ['apiRepository', function(apiRepository) {
  this.createOrder = function(user, shippingAddress, billingAddress, salesTax, shippingPrice, totalPrice, items) {
    return apiRepository.createOrder(user, shippingAddress, billingAddress, salesTax, shippingPrice, totalPrice, items);
  };

  this.getOrderHistory = function(userId, pageNumber) {
    return apiRepository.getOrderHistory(userId, pageNumber);
  };

  this.getOutstandingCommission = function(userId) {
    return apiRepository.getOutstandingCommission(userId);
  };

  this.getAvailablePoints = function(userId) {
    return apiRepository.getAvailablePoints(userId);
  };

  this.getRedeemableCommission = function(userId) {
    return apiRepository.getRedeemableCommission(userId);
  };

  this.getCommissionHistory = function(userId, pageNumber) {
    return apiRepository.getCommissionHistory(userId, pageNumber);
  };

}])
.service('ProductDetailService', ['apiRepository', function(apiRepository) {

  this.getProductDetail = function(productId) {
    return apiRepository.getProductDetail(productId);
  };

  this.likeProduct = function(productId) {
    return apiRepository.likeProduct(productId);
  };

  this.unlikeProduct = function(productId) {
    return apiRepository.unlikeProduct(productId);
  };

  this.getRelevantPosts = function(pageNumber, productId) {
    return apiRepository.getRelevantPosts(pageNumber, productId);
  };

  this.getProductsByBrand = function(id, pageNumber) {
    return apiRepository.getProductsByBrand(id, pageNumber);
  };

}])
.service('SocialActionService', ['apiRepository', function(apiRepository) {

  this.likeProduct = function(productId) {
    return apiRepository.likeProduct(productId);
  };

  this.unlikeProduct = function(productId) {
    return apiRepository.unlikeProduct(productId);
  };

  this.getProductsSavedForLater = function(pageNumber) {
    return apiRepository.getProductsSavedForLater(pageNumber);
  };

  this.getProductsLikedByUser = function(pageNumber) {
    return apiRepository.getProductsLikedByUser(pageNumber);
  };

  this.followUser = function(id) {
    return apiRepository.followUser(id);
  };

  this.unfollowUser = function(id) {
    return apiRepository.unfollowUser(id);
  };

  this.followBrand = function(id) {
    return apiRepository.followBrand(id);
  };

  this.unfollowBrand = function(id) {
    return apiRepository.unfollowBrand(id);
  };

}])
.service('BrandsService', ['apiRepository', function(apiRepository) {

  this.getAllBrands = function() {
    return apiRepository.getAllBrands();
  };

  this.getBrandsAtoZ = function(atoz, pageNumber) {
    return apiRepository.getBrandsAtoZ(atoz, pageNumber);
  };

  this.getRecommendedBrands = function() {
    return apiRepository.getRecommendedBrands();
  };

  this.getMyBrands = function(pageNumber) {
    return apiRepository.getMyBrands(pageNumber);
  };

  this.getBrandDetail = function(id) {
    return apiRepository.getBrandDetail(id);
  };

  this.getBrandFollowers = function(id, pageNumber) {
    return apiRepository.getBrandFollowers(id,pageNumber);
  };

  this.getBrandPosts = function(id, pageNumber) {
    return apiRepository.getBrandPosts(id, pageNumber);
  };

}])
.service('PublicProfileService', ['apiRepository', function(apiRepository) {

  this.getPublicProfile = function(id) {
    return apiRepository.getPublicProfile(id);
  };

  this.getUserFollowers = function(id, pageNumber) {
    return apiRepository.getUserFollowers(id, pageNumber);
  };

  this.getUserFollowing = function(id, pageNumber) {
    return apiRepository.getUserFollowing(id, pageNumber);
  };

}])
.service('SortFilterService', ['apiRepository', function(apiRepository) {

  this.getFilteredProducts = function(brandIds, sellerIds, sortBy, pageNumber, filterRequest) {
    return apiRepository.getFilteredProducts(brandIds, sellerIds, sortBy, pageNumber, filterRequest);
  };

  this.getFilteredBrandSellers = function(id, pageNumber) {
    return apiRepository.getFilteredBrandSellers(id, pageNumber);
  };

  this.getFilteredSellers = function(key, pageNumber) {
    return apiRepository.getFilteredSellers(key, pageNumber);
  };

  this.getFilteredBrands = function(key, pageNumber) {
    return apiRepository.getFilteredBrands(key, pageNumber);
  };

  this.getShopSellers = function(filter) {
    return apiRepository.getShopSellers(filter);
  };

  this.getSellerProducts = function(sellerId, filter, pageNumber) {
    return apiRepository.getSellerProducts(sellerId, filter, pageNumber);
  };

}])
.service('SocialAccountLinkedService', ['apiRepository', function(apiRepository) {

  this.updateFacebookInfo = function(facebookAccessToken, facebookFullName, facebookUserId) {
    return apiRepository.updateFacebookInfo(facebookAccessToken, facebookFullName, facebookUserId);
  };

  this.getUserSocialAccounts = function(userId) {
    return apiRepository.getUserSocialAccounts(userId);
  };

}])
.service('CheckoutService', ['apiRepository', function(apiRepository) {

  this.getCheckoutSummary = function(selectedProducts) {
    return apiRepository.getCheckoutSummary(selectedProducts);
  };

  this.placeOrder = function(shoppingCartProductGroups, cartId, pidMap, noauthCheckout, totalPrice, shippingPrice, salesTax) {
    return apiRepository.placeOrder(shoppingCartProductGroups, cartId, pidMap, noauthCheckout, totalPrice, shippingPrice, salesTax);
  };

}])
.service('AdminService', ['apiRepository', function(apiRepository) {

  this.getAdminSellers = function() {
    return apiRepository.getAdminSellers();
  };

  this.updateAdminSellers = function(sellers) {
    return apiRepository.updateAdminSellers(sellers);
  };

}])
.service('ReviewOrderService', function(){
    var primaryAddress = {};
    var paymentInfo = {};

    this.getPrimaryAddress = function() {
      return primaryAddress;
    };

    this.setPrimaryAddress = function(address) {
      primaryAddress = address;
    };

    this.getPaymentInfo = function() {
      return paymentInfo;
    };

    this.setPaymentInfo = function(payment) {
      paymentInfo = payment;
    };

})
.filter('inSlicesOf', ['$rootScope', function($rootScope) {
  var makeSlices = function(items, count) {
    if (!count)
      count = 3;

    if (!angular.isArray(items) && !angular.isString(items)) return items;

    var array = [];
    for (var i = 0; i < items.length; i++) {
      var chunkIndex = parseInt(i / count, 10);
      var isFirst = (i % count === 0);
      if (isFirst)
        array[chunkIndex] = [];
      array[chunkIndex].push(items[i]);
    }

    if (angular.equals($rootScope.arrayinSliceOf, array))
      return $rootScope.arrayinSliceOf;
    else
      $rootScope.arrayinSliceOf = array;

    return array;
  };

  return makeSlices;
}])
.filter('reverse', function() {
  return function(items) {
    if (!!items) {
      return items.slice().reverse();
    }
  };
})
.filter('currencyWithComma', function() {
  return function(currency) {
    if (typeof currency === 'number') {
      currency = currency.toString();
    }

    if (currency.indexOf(',') == -1) {
      var parts = currency.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }

    return currency;
  };
})
.filter('productPrice', function() {
  return function(number) {

    number = '$' + parseFloat(Math.round(number * 100) / 100).toFixed(2);

    // number = '$' + number;
    // var decimalIndex = number.indexOf('.');
    //
    // if(decimalIndex != -1) {
    //   if(decimalIndex + 2 > (number.length - 1 )) {
    //     return number + '0';
    //   }
    // } else {
    //   return number + '.00';
    // }

    return number;
  }
})
.filter('capitalizeFirstLetter', function() {
  return function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
})
.filter('numberWithPlusSign', function() {
  return function(currency) {
    if (currency.indexOf(',') !== -1) {
      var parts = currency.split(',');
      if(Number(parts[parts.length - 1]) == 0) {
        parts[parts.length - 1] = '000';
        return parts.join(',');
      }

      if(Number(parts[0]) < 10) {
        parts[parts.length - 1] = Math.floor(Number(parts[parts.length - 1]) /100) + '00+';
      } else {
        parts[parts.length - 1] = '000+';
      }

      return parts.join(',');

    } else {
      return currency;
    }
  };
});
