'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'config',
  'LocalStorageModule',
  'infinite-scroll',
  'ui.router',
  'ngDialog'
])
.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
  // $httpProvider.defaults.withCredentials = true;
  $stateProvider
    .state('shop', {
      url: '/shop',
      templateUrl: 'views/shop.html',
      controller: 'ShopCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login-register.html',
      controller: 'LoginCtrl'
    })
    .state('search', {
      url: '/search/{keyword}',
      templateUrl: 'views/search-results.html',
      controller: 'SearchResultsCtrl'
    })
    .state('cart', {
      url: '/cart',
      templateUrl: 'views/shopping-cart.html',
      controller: 'ShoppingCartCtrl'
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'views/checkout.html',
      controller: 'CheckoutCtrl'
    })
    .state('product', {
      url: '/product/{productId}',
      templateUrl: 'views/product-detail.html',
      controller: 'ProductDetailCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/shop');
})
// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: 'views/shop.html',
//       controller:  'ShopCtrl'
//     })
//     .when('/product', {
//       templateUrl: 'views/product-detail.html',
//       controller:  'ProductDetailCtrl'
//     })
//     .when('/login', {
//       templateUrl: 'views/login-register.html',
//       controller:  'LoginCtrl'
//     })
//   .otherwise({redirectTo: '/'});
// }])
.run(['$rootScope', function($rootScope){
    $rootScope.xappObj = {
      overlay: false
    };
}]);
