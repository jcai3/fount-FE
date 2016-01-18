'use strict';

angular.module('sywStyleXApp')
.controller('FavoritesCtrl', ['$scope', '$q', 'InstagramService', 'localStorageService', 'LocationService', '$location', '$state', '$stateParams', 'uiGmapIsReady', 'uiGmapGoogleMapApi', '$timeout', '$ionicLoading', function($scope, $q, InstagramService, localStorageService, LocationService, $location, $state, $stateParams, uiGmapIsReady, uiGmapGoogleMapApi, $timeout, $ionicLoading) {

  var getCurrentPosition = function() {
    var options = {
      timeout: 10000,
      maximumAge: 30000,
      enableHighAccuracy: false
    };

    LocationService.getCurrentPosition(options).then(
      function(position) {
        console.log(position.coords);
      },
      function() {
        console.log('error');
      }
    );
  };

  var getNearbyPosts = function(coords) {
    var deferred = $q.defer();
    var options = {
      lat: coords.latitude,
      lng: coords.longitude,
      access_token: localStorageService.get('instagramAccessToken')
    };

    if (options.lat && options.lng) {
      InstagramService.getNearbyPosts(options).success(function(response) {
        // model.currentPosts = response.data;
        deferred.resolve(response.data);
      });
    } else {
      console.log('Unable to obtain both latitude and longitude.  position:' + angular.toJson(coords));
      deferred.reject();
    }

    return deferred.promise;
  };

  // Main map object for this view
  $scope.map = {
    zoom: 15,
    center: LocationService.getDefaultPosition(),
    control: {},
    markers: []
  };

  $scope.$on('$ionicView.enter', function() {

    console.log('in home test');

    var userObj = $location.search();
    if (userObj.USER_ID) {
      localStorageService.set('userId', userObj.USER_ID);
    }

    // if (localStorageService.get('isLoggedIn') !== true) {
    //   $state.go('landing');
    // }
    uiGmapGoogleMapApi.then(function(maps) {
      if ($stateParams.latitude && $stateParams.longitude) {
        $scope.map.center = $stateParams;
        uiGmapGoogleMapApi.then(function(maps) {
          $scope.refresh($stateParams);
        });
      } else {
        $timeout(function() {
          var options = {
            timeout: 10000,
            maximumAge: 600000,
            enableHighAccuracy: false
          };
          $scope.locate(options);
        });
      }
    });
  });

  // Helper function for refreshing new posts from map pin
  $scope.refresh = function(position) {
    var pinPos = position || {
      latitude: $scope.map.control.getGMap().getCenter().lat(),
      longitude: $scope.map.control.getGMap().getCenter().lng()
    };

    getNearbyPosts(pinPos).then(function(posts) {
      var markers = [];
      _.each(posts, function(post) { // jshint ignore:line
        var image = {
          url: post.images.thumbnail.url,
          scaledSize: new google.maps.Size(20, 20),
          origin: new google.maps.Point(0, 0)
        };
        var marker = {
          coords: post.location,
          id: post.id,
          title: post.link,
          icon: image,
          data: post
        };

        // marker.showPost = function() {
        //   $scope.showPost(post);
        // };
        markers.push(marker);
      });

      $scope.map.markers = markers;
    });
  };

  // Helper function for locating the user before refreshing
  $scope.locate = function(options) {
    $ionicLoading.show();
    LocationService.getCurrentPosition(options).then(
      function(position) {
        $scope.map.center = position.coords;
        $scope.map.control.refresh(position.coords);
        $scope.refresh(position.coords);
        $ionicLoading.hide();
      },
      function() {
        $ionicLoading.hide();
      }
    );
  };
}]);
