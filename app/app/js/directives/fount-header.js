'use strict';

angular.module('sywStyleXApp')
.directive('fountHeader', ['$rootScope', '$state', '$location', 'localStorageService', 'ngDialog', 'CartService', 'ProductDetailService', 'ProductSearchService', 'PublicProfileService', 'LoginRegisterService', 'InstagramService', 'UtilityService', function($rootScope, $state, $location, localStorageService, ngDialog, CartService, ProductDetailService, ProductSearchService, PublicProfileService, LoginRegisterService, InstagramService, UtilityService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-header.html',
    scope: {},
    link: function(scope, element, attrs) {
      var userObj = $location.search();
      if (userObj.USER_ID) {
        localStorageService.set('userId', userObj.USER_ID);
      }

      var shoppingCartDict = {};
      scope.isLoggedIn = false;
      scope.topFilter = 'DISCOVER';

      var filterParams = {
        sellerIds: [],
        brandIds: [],
        categoryIds: [],
        minPrice: '',
        maxPrice: '',
        sale: '',
        selectedSortby: 'relevancy'
      };

      var searchTimer = false;
      var goToSearchResults = function(){
        $state.go('search', {keyword: scope.searchObj.keyword});

        scope.searchObj = {
          keyword: '',
          showSearchBar: false,
          results: {}
        };
      };

      angular.element(document).ready(function () {
    	  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    		  $("#smartWebBanner").css("display", "block");
    	  };
 
    	  $("#swb-close").click(function(){
   		   $("#smartWebBanner").css("display", "none");
    	  });
        });
      
      var getProfileDetails = function() {
        var userId = localStorageService.get('userId');
        PublicProfileService.getPublicProfile(userId).then(function(response){
          if (UtilityService.validateResult(response)) {
            console.log(response);
            var publicProfileObj = response.data.payload;
            var profileDisplayName = publicProfileObj.USER.USER.displayName;
            scope.profileDisplayName = UtilityService.emojiParse(profileDisplayName.toUpperCase());
            scope.publicProfilePicture = !!publicProfileObj.USER.USER.profilePicture ? publicProfileObj.USER.USER.profilePicture : '';
            scope.totalPosts = publicProfileObj.USER_POSTS_COUNT[userId];
            scope.totalProducts = publicProfileObj.USER_PRODUCTS_COUNT[userId];
            scope.totalFollowing = publicProfileObj.USER_FOLLOWING_COUNT[userId];
            scope.totalFollowers = publicProfileObj.USER_FOLLOWER_COUNT[userId];
          } else {
            console.log('error');
          }
        });
      };

      scope.searchObj = {
        keyword: '',
        showSearchBar: false
      };

      scope.searchProducts = function() {
        clearTimeout(searchTimer);
        if (scope.searchObj.keyword.trim().length >= 3) {
          searchTimer = setTimeout(function() {
            ProductSearchService.searchProducts(1, scope.searchObj.keyword, filterParams).then(function(result) {
              if (UtilityService.validateResult(result)) {
                scope.searchObj.results = result.data.payload;
                goToSearchResults();
              }
            });
          }, 400);
        }
      };

      scope.hoverIn = function() {
        scope.showCartOverlay = true;
      };

      scope.hoverOut = function() {
        scope.showCartOverlay = false;
      };

      scope.profileHoverIn = function() {
        scope.showProfileLogout = true;
      };

      scope.profileHoverOut = function() {
        scope.showProfileLogout = false;
      };

      scope.showMobileMenu = function() {
       /* var $body = element.find('.navbar').parent().parent();
        $body.css('margin-left', '70%').css('margin-right', '-70%').css('overflow', 'hidden');*/
        scope.enableMobileMenu = true;
      };

      scope.hideMobileMenu = function() {
        var $body = element.find('.navbar').parent().parent();
        $body.css('margin-left', '0').css('margin-right', '0').css('overflow', 'auto');;
        scope.enableMobileMenu = false;
      };

      scope.productDetail = function(product) {

        if (scope.enableMobileMenu == true) {
          scope.hideMobileMenu();
        }

        $state.go('product', {productId: product.id});
      };

      scope.setTopFilter = function(filter) {
   //     if (scope.topFilter == filter) {
    //      return;
     //   }

        if (scope.enableMobileMenu == true) {
          scope.hideMobileMenu();
        }

        scope.topFilter = filter;

        if (filter == 'SALE') {
          $state.go('on-sale');
        } else if (filter == 'ARRIVALS') {
          $state.go('new-arrivals');
        } else if (filter == 'DISCOVER') {
          $state.go('discover');
        }

      };

      if (!!localStorageService.get('shoppingCartInfo')) {
        scope.shoppingCartInfo = localStorageService.get('shoppingCartInfo');
      } else {
        scope.shoppingCartInfo = {
          count: 0,
          subtotal: 0
        };
      }

      var getProductsFromCart = function() {
        CartService.getProductsFromCart(localStorageService.get('userId'), false).success(function(response) {
          scope.username = response.payload.SHOPPING_CART.user.displayName;
          scope.fountCartProducts = response.payload.SHOPPING_CART.cartProducts;
          scope.shoppingCartInfo.count = response.payload.SHOPPING_CART.cartProducts.length;
          scope.shoppingCartInfo.subtotal = 0;
          for (var i=0,j=scope.shoppingCartInfo.count; i<j; i++) {
            scope.shoppingCartInfo.subtotal += response.payload.SHOPPING_CART.cartProducts[i].product.finalPrice;
          }
          localStorageService.set('shoppingCartInfo', scope.shoppingCartInfo);
          localStorageService.set('isInstagramLinked', response.payload.SHOPPING_CART.user.isInstagramLinked);
          localStorageService.set('isFacebookLinked', response.payload.SHOPPING_CART.user.isFacebookLinked);
        });
      };

      var collateShoppingCartItems = function(cartProducts) {
        var shoppingBagObj = {
          id:cartProducts.id,
          availability: (cartProducts.productMetadata.availability == 'AVAILABLE') ? true : false,
          productId: cartProducts.product.id ,
          sellerName: cartProducts.product.seller.name,
          name: cartProducts.product.name,
          imageURL: cartProducts.product.imageURL,
          price: cartProducts.productMetadata.price,
          fit: (cartProducts.productMetadata.fit !== 'NA')? cartProducts.productMetadata.fit : null,
          color: (cartProducts.productMetadata.color !== 'NA')? cartProducts.productMetadata.color : null,
          size: (cartProducts.productMetadata.size !== 'NA')? cartProducts.productMetadata.size : null,
          option: (cartProducts.productMetadata.option !== 'NA')? cartProducts.productMetadata.option : null,
          shippingOptions: cartProducts.shippingMethod,
          buyURL: cartProducts.product.buyURL,
          originalUrl: cartProducts.originalUrl,
          mediaId: !!cartProducts.media ? cartProducts.media.id : null,
          visualTagId: !!cartProducts.visualTag ? cartProducts.visualTag.id : null,
          qty: cartProducts.quantity,
          prices: {subtotal: "$0.00"},
          itemSelected: false
        };

        if (shoppingBagObj.sellerName in shoppingCartDict) {
          shoppingCartDict[shoppingBagObj.sellerName].push(shoppingBagObj);
        } else {
          shoppingCartDict[shoppingBagObj.sellerName] = [];
          shoppingCartDict[shoppingBagObj.sellerName].push(shoppingBagObj);
        }

      };

      var updateProductsFromCart = function() {
        shoppingCartDict = {};
        var userId = localStorageService.get('userId');
        CartService.getProductsFromCart(userId, true).success(function(response) {
          var userCartProducts = response.payload.SHOPPING_CART.cartProducts;
          var userCartLength = userCartProducts.length;
          if (userCartLength > 0) {
            var shoppingCartId = response.payload.SHOPPING_CART.id;
            for (var i=0; i< userCartLength; i++) {
              collateShoppingCartItems(userCartProducts[i]);
            };
            console.log(shoppingCartDict);
            localStorageService.set('shoppingCart', shoppingCartDict);
            localStorageService.set('shoppingCartId', shoppingCartId);

            var shoppingBagDetail = {
              twotap: response,
              source: 'shoppingBagDetail'
            };
            localStorageService.set('shoppingBagDetail', shoppingBagDetail);
            $state.go('cart');
          } else {
            $state.go('cart');
          }
        });
      };

      scope.goToCart = function() {
        updateProductsFromCart();
      };

      scope.checkout = function() {
        $state.go('checkout');
      };

      scope.searchObj = {
        keyword: '',
        showSearchBar: false
      };

      if (!localStorageService.get('userId')) {
        scope.isLoggedIn = false;
        //$state.go('login');
      } else {
        scope.isLoggedIn = true;
        getProductsFromCart();
        getProfileDetails();

      }

      scope.login = function() {
        $state.go('login');
      };

      scope.logout = function() {
        var user = {
          id: localStorageService.get('userId')
        };
        scope.isLoggedIn = false;
        $rootScope.$emit('event.updateFountLogout', {isLoggedIn: false});

        LoginRegisterService.logout(user).then(function(res) {
          console.log('logout');
        });

        InstagramService.logout();
        localStorageService.clearAll();

        $state.go('login');
      };

      $rootScope.$on('event.updateTopFilter', function(event, data) {
        scope.topFilter = data.topFilter;
      });

      $rootScope.$on('event.updateFountLogin', function(event, data) {
        scope.isLoggedIn = data.isLoggedIn;
        scope.topFilter = 'DISCOVER';
        getProductsFromCart();
        $state.go('discover');
      });

      $rootScope.$on('event.updateShoppingCart', function(event, data) {
        getProductsFromCart();
      });

      $rootScope.$on('event.updateFountLogout', function(event, data) {
        scope.isLoggedIn = data.isLoggedIn;
        scope.shoppingCartInfo.subtotal = 0;
      });

      $rootScope.$on('event.closeMobileOverlay', function(event, data) {
        if (scope.enableMobileMenu == true) {
          scope.hideMobileMenu();
        }
      });
    }
  };
}]);
