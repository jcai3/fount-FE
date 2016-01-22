'use strict';

angular.module('sywStyleXApp')
.directive('fountLogin', ['$rootScope', '$state', 'localStorageService', 'LoginRegisterService', 'InstagramService', function($rootScope, $state, localStorageService, LoginRegisterService, InstagramService) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-login.html',
    scope: {},
    link: function(scope, element, attrs) {
      var userId = localStorageService.get('userId');

      if (!localStorageService.get('userId')) {
        scope.isLoggedIn = false;
      } else {
        scope.isLoggedIn = true;
      }

      scope.login = function() {
        $state.go('login');
      };

      scope.logout = function() {
        var user = {
          id: userId
        };
        scope.isLoggedIn = false;
        $rootScope.$emit('event.updateFountLogout', {isLoggedIn: false});

        LoginRegisterService.logout(user).then(function(res) {
          console.log('logout');
        });

        InstagramService.logout();
        // if(!!localStorageService.get('facebookAccessToken')) {
        //   SocialService.logout();
        // }
        // localStorageService.remove('shoppingCart');
        // localStorageService.remove('shoppingCartInfo');
        localStorageService.clearAll();
        // if (!!$cookies.PLAY_SESSION && $cookies.PLAY_SESSION.indexOf('SPREE_') != -1) {
        //   $cookies.PLAY_SESSION = null;
        // }

        $state.go('login');
      };

      $rootScope.$on('event.updateFountLogin', function(event, data) {
        scope.isLoggedIn = data.isLoggedIn;
        $state.go('discover');
      });

    }
  };
}]);
