'use strict';

angular.module('sywStyleXApp')
.service('InstagramService', ['$rootScope', '$http', 'ENV', '$window', function($rootScope, $http, ENV, $window) {
  var self = this;
  var API_ENDPOINT = 'https://api.instagram.com/v1';
  //var API_ENDPOINT = 'https://api.instagram.com/v1';
  var LOGOUT_URL = 'https://instagram.com/accounts/logout';

  this.getEndpoint = function() {
    return API_ENDPOINT;
  };

  this.login = function(userType) {
    console.log('inside the instagram login function');
    $rootScope.xappObj.overlay = true;
    var loginWindow;
	   //the pop-up window size, change if you want
	  var popupWidth = 400,
		popupHeight = 300,
		popupLeft = (window.screen.width - popupWidth) / 2,
		popupTop = (window.screen.height - popupHeight) / 2;

    loginWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
      '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
      '&scope=likes+comments&response_type=code', '', 'width='+popupWidth+',height='+popupHeight+',left='+popupLeft+',top='+popupTop+''
    );
    loginWindow.addEventListener('load', function(event) {
      console.log('loaded');
      console.log(event);
    });

  };

  this.logout = function() {
    var promise = $http.jsonp(LOGOUT_URL);
    promise.error(function (data, status) {
      console.log('logout returned status:' + status);
    }).finally(function() {
      // localStorageService.remove('instagramAccessToken');
      console.log('instagram logged out');
    });
    return promise;
  };
}]);
