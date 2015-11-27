'use strict';

angular.module('sywStyleXApp')
.directive('mediaGridList', ['UtilityService', function(UtilityService){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'media-grid-list.html',
    scope: {
      medias: '='
    },
    link: function(scope, element, attrs) {

    }
  };
}]);
