'use strict';

angular.module('sywStyleXApp')
.service('InstagramService', ['$rootScope', '$http', 'localStorageService', 'ENV', function($rootScope, $http, localStorageService, ENV) {
  var self = this;
  var API_ENDPOINT = ionic.Platform.isWebView() ? 'https://api.instagram.com/v1' : '/instagram/api';
  // var API_ENDPOINT = 'https://api.instagram.com/v1';
  var LOGOUT_URL = 'https://instagram.com/accounts/logout';

  this.getEndpoint = function() {
    return API_ENDPOINT;
  };

  this.login = function(userId, redirectTo) {
    var loginWindow;

    if (ionic.Platform.isWebView()) {

      if(!!redirectTo) {
        loginWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
          '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
          '&scope=likes+comments&response_type=code&state='+ userId + '~~' + redirectTo, '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
        );

      } else {
        loginWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
          '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
          '&scope=likes+comments&response_type=code', '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
        );
      }

      loginWindow.addEventListener('loadstart', function (event) {
        // if ((event.url).indexOf(ENV.instagramRedirectDomain + ENV.instagramRedirectUri) === 0) {
        //   alert('111');
        // }
        if ((event.url).indexOf('?INSTAGRAM_USER_ID') !== -1 ) {
          var instagramUserId = (event.url).split('INSTAGRAM_USER_ID=')[1];
          console.log('instagramUserId: ' + instagramUserId);
          localStorageService.set('instagramUserId', instagramUserId);
          $rootScope.$emit('eventInstagramLoginConfirmed', {instagramUserId: instagramUserId});
          loginWindow.close();
        }

        if ((event.url).indexOf('?USER_ID') !== -1) {
          var userId = (event.url).split('USER_ID=')[1];
          console.log('userId: ' + userId);
          localStorageService.set('userId', userId);
          $rootScope.$emit('eventRegularLoginConfirmed', {userId: userId});
          loginWindow.close();
        }

        if ((event.url).indexOf('?IMPORT_INSTAGRAM_ID') !== -1 ) {
          var instagramUserId = (event.url).split('IMPORT_INSTAGRAM_ID=')[1];
          console.log('instagramUserId: ' + instagramUserId);
          localStorageService.set('instagramUserId', instagramUserId);
          // localStorageService.set('isInstagramLinked', true);
          $rootScope.$emit('eventImportInstagramLoginConfirmed', {instagramUserId: instagramUserId});
          loginWindow.close();
        }

        if ((event.url).indexOf('?SPREE_USER_ID') !== -1 ) {
          var userId = (event.url).split('SPREE_USER_ID=')[1];
          console.log('UserId: ' + userId);
          // localStorageService.set('userId', userId);
          // localStorageService.set('socialSettingsViewMode', 1);
          // localStorageService.set('isInstagramLinked', true);
          $rootScope.$emit('eventSettingsLinkAccountsConfirmed', {userId: userId});
          loginWindow.close();
        }

      });
    } else {

        if(!!redirectTo) {
          localStorageService.set('isInstagramLinked', true);
          loginWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
            '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
            '&scope=likes+comments&response_type=code&state='+ userId + '~~' + redirectTo, '_self', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
          );

        } else {
          loginWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
            '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
            '&scope=likes+comments&response_type=code', '_self', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
          );
        }

    }
  };

  this.getNearbyPosts = function(options) {
    options = options || {};
    options.client_id = ENV.instagramClientId; // jshint ignore:line

    var promise = $http.get(API_ENDPOINT + '/media/search', {
      params: options
    }).error(function(data, status) {
      console.log('getNearbyPosts returned status:'  + status);
    });
    return promise;
  };

  this.logout = function() {
    var promise = ionic.Platform.isWebView() ? $http.post(LOGOUT_URL) : $http.jsonp(LOGOUT_URL);
    promise.error(function (data, status) {
      console.log('logout returned status:' + status);
    }).finally(function() {
      localStorageService.remove('instagramAccessToken');
    });
    return promise;
  };
}]);
