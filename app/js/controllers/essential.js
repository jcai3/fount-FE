'use strict';

angular.module('sywStyleXApp')
.controller('EssentialCtrl', ['$scope', '$state', 'localStorageService', 'UtilityService', 'AdminService', 'EssentialService', function($scope, $state, localStorageService, UtilityService, AdminService, EssentialService) {
	 var departmentId = 1;
	 $scope.departments = [{}];
	 
	 var media = null;
	 var bcType = "Category";
	 $scope.width = [];
	 $scope.height = [];
	 $scope.medias = [];
	 var userId = localStorageService.get('userId');
	 $scope.categoryIds=null;
	 $scope.width.push("500");
	 $scope.height.push("500");
	 var pagenum=1;
	 var ifNext = 1;
	 $scope.ifNext = true;
	 $scope.ifLast = false;
	 
		
		
	 var handleFileSelect = function(evt) {
		    var files = evt.target.files;
		    var file = files[0];

		    if (files && file) {
		        var reader = new FileReader();
		        reader.onload = function(readerEvt) {
		            var binaryString = readerEvt.target.result;
		            media = btoa(binaryString);
		            media = "data:image/png;base64,"+media;
		        };

		        reader.readAsBinaryString(file);
		    }
		};

		if (window.File && window.FileReader && window.FileList && window.Blob) {
		    document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
		} else {
		    alert('The File APIs are not fully supported in this browser.');
		}
		
	
	 $scope.getDepartment = function(pageNumber){
		 EssentialService.getDepartment(pageNumber).then(function(res) {
			 if (UtilityService.validateResult(res)) {
				 $scope.departments = res.data.payload.ESSENTIALS_DEPARTMENTS;
			 }
		 });
	 };
	 
	 $scope.getId = function(department){
		 departmentId = department.id;
		 console.log(departmentId);
		 $scope.getEssentialCategories(departmentId);
	 }
	 
	 $scope.getEssentialCategories = function(departmentId){
		 EssentialService.getEssentialCategories(departmentId,pagenum).then(function(res) {
			 if (UtilityService.validateResult(res)) {
				 $scope.categories = res.data.payload.ESSENTIALS_DEPARTMENT_CATEGORIES;
				// console.log($scope.categories);
				 if ($scope.categories.length == 0) {
						$scope.ifNext= false;
						}
			 }
			 
		 });
	 };

	 $scope.deleteCategory = function(essentialCategoryId) {
		 console.log(essentialCategoryId);
		 EssentialService.deleteEssentialCategories(essentialCategoryId).then(function(res) {
			 if (UtilityService.validateResult(res)) {
				 console.log("category deleted:"+essentialCategoryId);
				 $scope.getEssentialCategories(departmentId);
			 }
		 });
	 };
	 
	
	 
	 $scope.createEssentialCategories = function() {
		 $scope.medias.length=0;
		 departmentId = $scope.department.id;
		 $scope.medias.push(media);
			 console.log('begin insert');
		 $scope.successmsg = false;
		 $scope.successmsg = true;
		 console.log("userId is: "+userId);
		 EssentialService.createEssentialCategories(userId, $scope.medias, $scope.width, $scope.height, $scope.bcName, bcType, departmentId, $scope.categoryIds).then(function(res) {
			 if (UtilityService.validateResult(res)) {
				 console.log("category created:"+categoryIds);
			 }
			 else{
				 console.log('create category fails');
			 }		 
		 });	 
	 };
		 
	 
	 $scope.nextPage = function() {
		 pagenum = pagenum+1;
		 $scope.getEssentialCategories(departmentId);
		 $scope.ifLast = true;	 	
	 }
	 
	 $scope.lastPage = function() {
		 pagenum = pagenum-1;
		 $scope.ifNext=true;
		 $scope.getEssentialCategories(departmentId);
		 if(pagenum == 1){
			 $scope.ifLast = false;
		 }
		 
	 }
	 
	 $scope.getDepartment(1);
	 $scope.getEssentialCategories(departmentId);
}]);
