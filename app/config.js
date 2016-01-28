'use strict';

angular.module('config', [])

.constant('ENV', {
  sharingHost: 'http://localhost:8100/#/media/',
 /* apiEnvname: 'local',
  apiEndpoint: 'http://localhost:9090/',
  instagramRedirectDomain: 'http://localhost:9090/',
  instagramClientId: '7d5af766cffa46c3b045dd5133001533',*/
 /* apiEndpoint: 'https://spreest.searshc.com/lifestyle/',
  instagramRedirectDomain: 'https://spreest.searshc.com/lifestyle/',
  instagramClientId: 'e32a8358d9cf4782b97e0f7c23de7309',*/
  apiEndpoint: 'https://fountit.com/lifestyle/',
  instagramRedirectDomain: 'https://fountit.com/lifestyle/',
  instagramClientId: 'ee232f8727414f5cbba4ec881ed2a71f',
  instagramRedirectUri: 'getInstagramAccessToken'
});
