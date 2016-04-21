'use strict';

angular.module('sywStyleXApp')
.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginRegisterService', 'UtilityService','$state', '$window', 'ENV', 'localStorageService',function($rootScope, $scope, LoginRegisterService, UtilityService, $state, $window, ENV, localStorageService) {

  $scope.loginObj = {
    email: '',
    password: ''
  };

  $scope.registerObj = {
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    termsOfUse: true,
    instagramUserId: '',
    errorMsg: false
  };

  $scope.authErrorMsg = false;
  $scope.authResetMsg = false;
  $scope.errorMessage = '';

  var invokeFountLogin = function() {
    $rootScope.$emit('event.updateFountLogin', {isLoggedIn: true});
  };
  
  $scope.toggleModal = function(){
      $scope.showModal = !$scope.showModal;
  };
  
  $scope.loginAccount = function() {
    $scope.authErrorMsg = false;
    console.log($scope.loginObj);
    LoginRegisterService.login($scope.loginObj.email, $scope.loginObj.password).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);
        localStorageService.set('userId', result.data.payload.USER.id);
        invokeFountLogin();

      } else {
        console.log(result);
        $scope.authErrorMsg = true;
        if(!!result.data.error) {
          $scope.errorMessage = result.data.error.message;
        }

        if(!!result.data.errors) {
          $scope.errorMessage = 'Please enter your login credentials';
        }

      }
    });
    console.log('login clicked');
  };
  
  $scope.resetPassword = function() {
	LoginRegisterService.passwordForgot($scope.loginObj.email).then(function(result) {
		if(UtilityService.validateResult(result)) {
		console.log('reset psw request sent');
		$scope.authResetMsg = true;
		$scope.authErrorMsg = false;
		$scope.resetMessage = "An email is sent to your mailbox. Please change your password from there."
		}
		else{
			console.log('reset psw request not sent');
			$scope.authErrorMsg = true;
			$scope.authResetMsg = false;
			$scope.errorMessage = 'Please enter your email address';
		}
	})
	
  };

  $scope.authErrorMsgR = false;
  //$scope.authResetMsgR = false;
  $scope.errorMessageR = '';
  //$scope.resetMessageR = '';
  $scope.registerAccount = function() {
    console.log($scope.registerObj);
    $scope.authErrorMsg = false;
    LoginRegisterService.register($scope.registerObj.email, $scope.registerObj.password, $scope.registerObj.displayName, $scope.registerObj.termsOfUse, $scope.registerObj.instagramUserId).then(function(result) {
      if (UtilityService.validateResult(result)) {
        console.log(result);
        $scope.showModal = false;
        $scope.authResetMsg = true;
        $scope.resetMessage = 'Registered, now log in';

      } else {
        if (result.data.error || result.data.errors) {
          $scope.authErrorMsgR = true;
          if(!!result.data.error) {
            $scope.errorMessageR = result.data.error.message;
          }

          if(!!result.data.errors) {
            $scope.errorMessageR = 'Please enter all the required fields';
          }
        }
      }
    });
  };

  $scope.instagramLogin = function(userType) {
    var loginWindow;

    loginWindow = $window.open('https://api.instagram.com/oauth/authorize?client_id=' + ENV.instagramClientId +
      '&redirect_uri=' + ENV.instagramRedirectDomain + ENV.instagramRedirectUri +
      '&scope=likes+comments&response_type=code', '_self', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
    );
  }

}]);


angular.module('sywStyleXApp').directive('modal', function () {
    return {
        template: '<div class="modal fade">' + 
            '<div class="modal-dialog">' + 
              '<div class="modal-content">' + 
                '<div class="modal-header">' + 
                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                  '<h4 class="modal-title">{{ title }}</h4>' + 
                '</div>' + 
                '<div class="modal-body" ng-transclude></div>' + 
              '</div>' + 
            '</div>' + 
          '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
          scope.title = attrs.title;

          scope.$watch(attrs.visible, function(value){
            if(value == true)
              $(element).modal('show');
            else
              $(element).modal('hide');
          });

          $(element).on('shown.bs.modal', function(){
            scope.$apply(function(){
              scope.$parent[attrs.visible] = true;
            });
          });

          $(element).on('hidden.bs.modal', function(){
            scope.$apply(function(){
              scope.$parent[attrs.visible] = false;
            });
          });
        }
      };
    });
