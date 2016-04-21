'use strict';

angular.module('sywStyleXApp')
.controller('BannerCtrl', ['$scope', '$state', '$window', 'UtilityService', 'AdminService', 'BannerService', function($scope, $state, $window, UtilityService, AdminService, BannerService) {

var media = null;
	var handleFileSelect = function(evt) {
	    var files = evt.target.files;
	    var file = files[0];

	    if (files && file) {
	        var reader = new FileReader();

	        reader.onload = function(readerEvt) {
	            var binaryString = readerEvt.target.result;
	            media = btoa(binaryString);
	            media = "data:image/png;base64,"+media;
	            //console.log("media after convert: "+media);
	        };

	        reader.readAsBinaryString(file);
	    }
	};

	if (window.File && window.FileReader && window.FileList && window.Blob) {
	    document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
	} else {
	    alert('The File APIs are not fully supported in this browser.');
	}
	
	
	$scope.items = [{}];
	$scope.images = [{}];
	var successmsg = false;
	//var bcName = null;
	var bcType = "Banner";
	$scope.width = [];
	$scope.height = [];
	$scope.medias = [];
	var userId ="1";
	$scope.width.push("1200");
	$scope.height.push("300");
	$scope.successmsg = false;
	    	 
	 $scope.updateBanner = function(){
		 $scope.medias.push(media);
		 console.log('begin insert');
		 console.log($scope.medias);
		 $scope.successmsg = true;
		 BannerService.createEssentialBanner(userId, $scope.medias, $scope.width, $scope.height, $scope.bcName, bcType, $scope.ctaUrl).then(function(res) {
			 $scope.successmsg = true;
			 if (UtilityService.validateResult(res)) {
				 console.log('new banner insert completed');
				// $scope.successmsg = true;
			 }
			 else{
				 console.log('create banner fails');
			 }
			// $scope.successmsg = true;
			 $scope.medias.length=0;
		 });
		 
	 };
	 
	 var getAllBanner = function(){
		 BannerService.getBanner(1).then(function(res) {
			 if (UtilityService.validateResult(res)) {
		        $scope.images = res.data.payload.ESSENTIALS_BANNERS;
			      }
		 });
	 };
	 
	 $scope.deleteBanner = function(id){
		 BannerService.deleteBanner(id).then(function(res){
			if (UtilityService.validateResult(res)) {
				 console.log("banner deleted");
				 getAllBanner();
			}
		 });
	 };
	 
	 getAllBanner();
}]);
