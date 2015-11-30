'use strict';

angular.module('config', [])

.constant('ENV', {
  sharingHost: 'http://localhost:8100/#/media/',
  apiEnvname: 'local',
  // apiEndpoint: '/styleXApp/api/',
  apiEndpoint: 'https://spreest.searshc.com/lifestyle/',
  // instagramRedirectDomain: 'http://localhost:9090/',
  instagramRedirectDomain: 'https://spreest.searshc.com/lifestyle/',
  instagramRedirectUri: 'getInstagramAccessToken',
  // instagramClientId: '7d5af766cffa46c3b045dd5133001533',
  instagramClientId: 'e32a8358d9cf4782b97e0f7c23de7309',
  facebookRedirectDomain: 'http://localhost:9090/',
  facebookRedirectUri: 'getFacebookAccessToken',
  facebookClientId: '829615980485534',
  facebookAppUrl: 'http://localhost:8100/'
})
.constant('CONSTANTS', {
  appVersion: '0.2.11',
  superUsers: '1'
});
