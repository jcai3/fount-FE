'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/shop.html',
      controller:  'ShopCtrl'
    })
  .otherwise({redirectTo: '/'});
}]);
