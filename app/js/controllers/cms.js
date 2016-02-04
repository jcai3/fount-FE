'use strict';

angular.module('sywStyleXApp')
.controller('CmsCtrl', ['$scope', 'UtilityService', '$state', '$stateParams', 
                        'localStorageService', function($scope, UtilityService, UserMediaService, MediaTagService, 
                        		$state, $stateParams, localStorageService) {
  UtilityService.gaTrackAppView('CMS Page View');
}]);
