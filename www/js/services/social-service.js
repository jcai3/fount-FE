'use strict';

angular.module('sywStyleXApp')
.service('SocialService', ['$rootScope', '$http', '$cordovaOauth', 'localStorageService', 'SocialAccountLinkedService', 'ENV', function($rootScope, $http, $cordovaOauth, localStorageService, SocialAccountLinkedService, ENV) {
  var self = this;
//  var API_ENDPOINT = ionic.Platform.isWebView() ? 'https://api.instagram.com/v1' : '/instagram/api';
//  var APP_URL = 'http://localhost:8100/'
  // var facebookAccessToken = localStorageService.get('facebookAccessToken');
  // var LOGOUT_URL = 'https://facebook.com/logout.php?next=' + ENV.facebookAppUrl + '&access_token=' + facebookAccessToken;

  this.facebookLogin = function() {
    $cordovaOauth.facebook("478872125626689", ["email", "public_profile", "user_friends"]).then(function(result) {
      var facebookOauthAccessToken = result.access_token;
      localStorageService.set('facebookOauthAccessToken', facebookOauthAccessToken);
      console.log('facebookAccess: ' + facebookOauthAccessToken);
      $http.get("https://graph.facebook.com/v2.4/me", { params: { access_token: facebookOauthAccessToken, fields: "id,name,gender,picture", format: "json" }}).then(function(result) {
        console.log(result.data);
        SocialAccountLinkedService.updateFacebookInfo(facebookOauthAccessToken, result.data.name, parseInt(result.data.id)).then(function(res) {
          console.log('done');
          localStorageService.set('isFacebookLinked', 'true');
        }, function(error) {
          console.log(error);
        });
      }, function(error) {
        console.log(error);
      });
    }, function(error) {
      console.log(error);
    });
  };

  this.login = function(userId, redirectTo) {
    var loginWindow;

    if (ionic.Platform.isWebView()) {

      if(!!redirectTo) {
        loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=' + ENV.facebookClientId +
          '&redirect_uri=' + ENV.facebookRedirectDomain + ENV.facebookRedirectUri +
          '&scope=public_profile&response_type=code&state='+ userId + '~~' + redirectTo, '_blank', 'width=400,height=400,location=no,clearsessioncache=yes,clearcache=yes'
        );

      } else {
        loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=' + ENV.facebookClientId  +
          '&redirect_uri=' + ENV.facebookRedirectDomain + ENV.facebookRedirectUri +
          '&scope=public_profile&response_type=code', '_blank', 'width=400,height=400,location=no,clearsessioncache=yes,clearcache=yes'
        );
      }

      loginWindow.addEventListener('loadstart', function (event) {
        if ((event.url).indexOf('?SPREE_USER_ID') !== -1 ) {
          var userId = (event.url).split('SPREE_USER_ID=')[1];
          console.log('UserId: ' + userId);
          // localStorageService.set('userId', userId);
          // localStorageService.set('socialSettingsViewMode', 1);
          $rootScope.$emit('eventSettingsLinkAccountsConfirmed', {userId: userId});
          loginWindow.close();
        }
      });
    } else {

        if(!!redirectTo) {
          localStorageService.set('isFacebookLinked', true);
          loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=' + ENV.facebookClientId  +
            '&redirect_uri=' + ENV.facebookRedirectDomain + ENV.facebookRedirectUri +
            '&scope=public_profile&response_type=code&state='+ userId + '~~' + redirectTo, '_self', 'width=400,height=400,location=no,clearsessioncache=yes,clearcache=yes'
          );

        } else {
          loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=' + ENV.facebookClientId  +
            '&redirect_uri=' + ENV.facebookRedirectDomain + ENV.facebookRedirectUri +
            '&scope=public_profile&response_type=code', '_self', 'width=400,height=400,location=no,clearsessioncache=yes,clearcache=yes'
          );
        }

    }
  };

  this.logout = function() {
    var facebookAccessToken = localStorageService.get('facebookAccessToken');
    var LOGOUT_URL = 'https://facebook.com/logout.php?next=' + ENV.facebookAppUrl + '&access_token=' + facebookAccessToken;
    console.log(LOGOUT_URL);
    var promise = ionic.Platform.isWebView() ? $http.post(LOGOUT_URL) : $http.jsonp(LOGOUT_URL);
    promise.error(function (data, status) {
      console.log('logout returned status:' + status);
    }).finally(function() {
  //    localStorageService.remove('instagramAccessToken');
    });
    return promise;
  };
}]);
