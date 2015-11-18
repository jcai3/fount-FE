'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'ngRoute',
  'config',
  'LocalStorageModule',
  'infinite-scroll'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/shop.html',
      controller:  'ShopCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login-register.html',
      controller:  'LoginCtrl'

    })
  .otherwise({redirectTo: '/'});
}]).run(['$rootScope', function($rootScope){
    $rootScope.xappObj = {
      overlay: false
    };
}]);
