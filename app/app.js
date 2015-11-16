'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'ngRoute',
  'config'
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
}]);
