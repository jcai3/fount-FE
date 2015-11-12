'use strict';

// Declare app level module which depends on views, and components
angular.module('sywStyleXApp', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller:  'LoginCtrl'
    })
  .otherwise({redirectTo: '/login'});
}]);
