'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'ngRoute',
  'config',
  'LocalStorageModule',
  'infinite-scroll',
  'ui.router'
])
.config(function($httpProvider, $routeProvider, $stateProvider, $urlRouterProvider) {
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
