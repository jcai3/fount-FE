'use strict';

angular.module('sywStyleXApp')
.directive('fountDiscoverShowcase', ['$state', '$timeout', 'ngDialog',function($state, $timeout, ngDialog) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/templates/fount-discover-showcase.html',
    scope: {
      showcaseProducts: '=',
      caseid: '=',
    },
    link: function(scope, element, attrs) {
    	//var value = $('mediaID').contents().find('html');
    	//var value = mediaID.contentDocument;
    	console.log('outside method. media id issss: ' +  scope.caseid);
    	//console.log('product issss: ' + showcaseProducts);
      scope.showcaseCounter = 3;
      var initializeShowcaseCarousel = function() {

        var startPosition = 0;

        var settings = {
          circular: false,
          infinite: false,
          responsive: true,
          width: '100%',
          align: 'center',
          auto: false,
          items: {
            visible: 3,
            minimum: 3,
            start: startPosition
          },
          scroll: {
            items: 3,
            duration: 50,
            pauseOnHover: true
          },
          prev: {
            button: element.find('#showcase-carousel-prev'),
            key: "left"
          },
          next: {
            button: element.find('#showcase-carousel-next'),
            key: "right"
          }
        };

        $timeout(function(){
          element.find('#discover-showcase-carousel').carouFredSel(settings);
        }, 10);
      };

      scope.productDetail = function(id) {
        $state.go('product', {productId: id});
      };
       scope.quickview=function(id){
    	  ngDialog.open({
  			template:'views/templates/fount-quick-view.html',
  			plain:false,
  			showClose:true,
  			controller:'QuickViewCtrl',
  			scope:scope,
  			data:{productId: id},
  			className:'ngdialog-theme-quickview',
  		});
    	  
      }
      scope.shopAll = function(mediaID) {
    	  console.log('in redirect method. media id is:' + scope.caseid);
     	  $state.go('media', {mediaId: scope.caseid});
       };
      
      scope.plusCounter = function(length) {
        if (length < 3) {
          return;
        }
        if (length >= 6) {
          if (scope.showcaseCounter < 6) {
            scope.showcaseCounter = 6;
          } else {
            scope.showcaseCounter = length;
          }
        } else {
          scope.showcaseCounter = length;
        }
      };

      scope.minusCounter = function(length) {
        if (length < 3) {
          return;
        }
        if (scope.showcaseCounter > 6) {
          scope.showcaseCounter = 6;
        } else if (scope.showcaseCounter > 3 && scope.showcaseCounter <= 6) {
          scope.showcaseCounter = 3;
        } else {
          scope.showcaseCounter = 3;
        }
      };

      
      //angular.element(document.querySelector('[ng-controller="DiscoverCtrl"]')).scope().mediaID;
     /* 
      var dom_el = document.querySelector('[ng-controller="DiscoverCtrl"]');
      var ng_el = angular.element(dom_el);
      var ng_el_scope = ng_el.scope();
      var street_name = ng_el_scope.mediaID;
      console.log('now id is:'+mediaID);*/
      
      initializeShowcaseCarousel();
    }
  };
}]);
