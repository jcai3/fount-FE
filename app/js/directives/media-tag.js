'use strict';

angular.module('sywStyleXApp')
.directive('mediaTag', [ '$timeout', '$state', '$compile', '$rootScope', '$ionicModal', '$ionicPopup', 'UtilityService', 'MediaTagService', 'ProductSearchService', 'localStorageService', 'TwoTapService', 'ProductDetailService', function($timeout, $state, $compile, $rootScope, $ionicModal, $ionicPopup, UtilityService, MediaTagService, ProductSearchService, localStorageService, TwoTapService, ProductDetailService){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'media-tag.html',
    scope: {
      discoverMedia: '=',
      tnpOverlayEnabled: '@',
      showTagProductSuccessMsg: '='
    },
    link: function(scope, element) {
      var activeTagId = 0;
      var img = element.find('img');

      scope.user = {
        id: localStorageService.get('userId')
      };

      var hideTagProductMsg = function() {
        $timeout(function () {
          scope.showTagProductSuccessMsg = false;
        }, 2000);
      };

      var clearAllVisualTags = function() {
        element.find('div[data-mediatag-id]').remove();
      };

      var setupTagArea = function(width, height) {
        clearAllVisualTags();
        // need to do this for ie compatibility

        element.find('.tagging-area')[0].style.width = width + 'px';
        element.find('.tagging-area')[0].style.height = height + 'px';
      };

      var compileMarker = function(visualTag, left, top) {

        var marker, $marker, markerScope;
        marker = angular.element('<div media-tag-marker></div>');

        // create child scope
        markerScope = scope.$new();

        // pass info to child scope
        // markerScope.tagMarkerClass = 'priceTagOutline';
        markerScope.visualTag = visualTag;
        markerScope.offset = {
          left: left,
          top: top
        };

        markerScope.showImage = true;
        markerScope.enableDelete = true;
        markerScope.onDeleteCallback = scope.deleteMediaTag;
        markerScope.onSwitch2Tag = scope.switch2Tag;

        $marker = $compile(marker)(markerScope);

        return $marker;
      };

      var spliceProductFrmArray = function(productId, productArray) {
        var result = $.grep(productArray, function(e){
          return e.id != productId;
        });

        result.userId = productArray.userId;

        return result;
      };

      var spliceProductIdFrmArray = function(productId, productIdArray){
        var result = $.grep(productIdArray, function(id){
            return id != productId;
        });
        return result;
      };

      var toggleProductLike = function(product, productArray){
          $.each(productArray, function(idx, obj){
            if(obj.id == product.id){

              obj.socialActionUserProduct = {
                liked: product.socialActionUserProduct.liked
              };
            }
          });
          return productArray;
      };

      img.bind('load', function() {
        console.log('test 001');

        // init the tag area
        setupTagArea(this.width, this.height);

        // need this to calculate marker position
        scope.imgWidth = this.width;
        scope.imgHeight = this.height;

        // fetch visual tags for this image
        MediaTagService.getMediaTags(scope.discoverMedia.id).then(function(result) {
          if (UtilityService.validateResult(result)) {
            var mediaTagsArray = result.data.payload.VISUALTAGS;
            scope.existingProductIds = UtilityService.getProductsFromVisualTags(mediaTagsArray);
            scope.mediaTagsArray = mediaTagsArray;
            var updatedTaggedProducts = [];

            for (var i=0,j=scope.mediaTagsArray.length; i<j; i++) {
              scope.mediaTagsArray[i].active = false;
              var mediaProducts = mediaTagsArray[i].products;
              if(!!mediaProducts){
                for(var k = 0, l = mediaProducts.length; k < l; k++){
                  updatedTaggedProducts.push(mediaProducts[k]);
                }
              }
            }

            localStorageService.set('taggedProducts', updatedTaggedProducts);
            console.log(localStorageService.get('taggedProducts'));

            if (mediaTagsArray.length > 0) {
              activeTagId = scope.mediaTagsArray[mediaTagsArray.length-1].id;
              scope.mediaTagsArray[mediaTagsArray.length-1].active = true;
              scope.taggedProducts = mediaTagsArray[mediaTagsArray.length-1].products;
              scope.taggedProducts.userId = scope.mediaTagsArray[mediaTagsArray.length-1].user.id;
              scope.taggedProducts[scope.taggedProducts.length] = {
                addMoreProducts: true
              };

              // draw the visual tags
              for(var i = 0, j = mediaTagsArray.length; i < j; i++) {
                var $marker, marker, markerScope;
                var left = mediaTagsArray[i].percentageX * scope.imgWidth - 11;
                var top = mediaTagsArray[i].percentageY * scope.imgHeight - 9;

                if(mediaTagsArray[i].products.length === 0) {
                  console.log('product must have visual tag');
                } else {
                  mediaTagsArray[i].tagMarkerClass = 'priceTagOutline';
                  marker = compileMarker(mediaTagsArray[i], left, top);

                  // add marker visually
                  element.find('.tag-marker-container').append(marker);
                }
              }
            }
             else {
              scope.taggedProducts = [];
            }

          } else {
            console.log('error');
          }
        }, function(error){
          console.log('error');
        });

        scope.$apply();

      });

      element.find('.tagging-area').bind('click', function(event){
        scope.tnpOverlayEnabled = false;

        var rect = event.currentTarget.getBoundingClientRect();
        var localMouseX = event.pageX - (rect.left + window.scrollX);
        var localMouseY = event.pageY - (rect.top + window.scrollY);
        var percentageX = localMouseX / rect.width;
        var percentageY = localMouseY / rect.height;

        console.log(percentageX);
        console.log(percentageY);

        //tag products modal START

        $ionicModal.fromTemplateUrl('tag-products.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          // for angular error
          scope.taggedProducts = undefined;
          scope.modal = modal;
          scope.modal.show();

          var pageNumber = 1;
          var apiLocker = false;
          var tagProductsApiLocker = false;
          scope.modal.addedProductsArray = [];
          scope.modal.products = [];
          scope.modal.hasMoreData = false;
          scope.modal.emptySearchResults = false;
          scope.modal.searchKeyword = scope.modal.keyword;
          scope.modal.loadingSpinnerEnabled = false;
          scope.modal.imageHeight = UtilityService.getImageHeight(2);
          scope.modal.filterData = {
            sortBy: false,
            refineBy: false,
            productsCount: 0,
            selectedSortby: '',
            showFilters: false,
            searchSource: 'tagProducts',
            filterParams : {
              sellerIds: [],
              brandIds: [],
              categoryIds: [],
              minPrice: '',
              maxPrice: '',
              sale: '',
              selectedSortby: 'relevancy'
            }
          };

          var searchProducts = function() {

            if (apiLocker || scope.modal.keyword == '') {
              return;
            }

            apiLocker = true;
            scope.modal.loadingSpinnerEnabled = true;
            ProductSearchService.searchProducts(pageNumber, scope.modal.keyword, scope.modal.filterData.filterParams).then(function(result) {
              if (UtilityService.validateResult(result)) {
                if (result.data.payload.PRODUCTS.length === 0) {
                  scope.modal.hasMoreData = false;
                  if (pageNumber == 1) {
                    scope.modal.emptySearchResults = true;
                    scope.modal.filterData.showFilters = false;
                  }

                } else {
                  scope.modal.filterData.showFilters = true;
                  scope.modal.filterData.productsCount = result.data.payload.COUNT;
                  pageNumber++;
                  scope.modal.hasMoreData = true;
                  scope.modal.emptySearchResults = false;
                  var products = result.data.payload.PRODUCTS;
                  scope.modal.products.push.apply(scope.modal.products, products);
                }
              } else {
                scope.modal.hasMoreData = false;
                console.log('error');
              }
              scope.modal.loadingSpinnerEnabled = false;
              apiLocker = false;
//              scope.modal.filterData.emptySearchResults = scope.modal.emptySearchResults;
            }, function(error) {
              console.log('error');
              scope.modal.loadingSpinnerEnabled = false;
            });
          };

          scope.$watch('modal.keyword', function(newVal, oldVal) {
            if (scope.modal.hasMoreData) {
              scope.modal.searchDisabled = false;
              scope.modal.addedProductsArray = [];
            } else {
              scope.modal.searchDisabled = true;
            }
          });

          scope.modal.searchProducts = function() {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Search', 'Search on media detail for new tag - keyword: ' + scope.modal.keyword);
            pageNumber = 1;
            apiLocker = false;
            scope.modal.addedProductsArray = [];
            scope.modal.products = [];
            scope.modal.hasMoreData = false;
            scope.modal.emptySearchResults = false;
            // scope.modal.filterData.selectedSortby = 'relevancy';
            scope.modal.filterData.filterParams.sellerIds = [];
            scope.modal.filterData.filterParams.brandIds = [];
            scope.modal.filterData.filterParams.categoryIds = [];
            scope.modal.filterData.filterParams.minPrice = '';
            scope.modal.filterData.filterParams.maxPrice = '';
            scope.modal.filterData.filterParams.sale = '';
            scope.modal.filterData.filterParams.selectedSortby = 'relevancy';
            scope.modal.filterData.searchKeyword = scope.modal.keyword;
            scope.modal.filterData.sortBy = false;
            scope.modal.filterData.refineBy = false;
            scope.modal.filterData.productsCount = 0;
            scope.modal.filterData.showFilters = false;
            scope.$emit('setDefaultFilterValues', {action: 'search'});
            searchProducts();
          };

          scope.modal.addProduct = function(product) {
            if (scope.existingProductIds.indexOf(product.id) != -1) {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Already tagged product on media detail for new tag - Product: ' + product.id);
              var alertPopup = $ionicPopup.alert({
                cssClass: 'reach-tagging-limit',
                template: 'It is already tagged in this image!'
              });
              alertPopup.then(function(res) {
                console.log('It is already tagged in this image!');
              });
            } else {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'New product on media detail for new tag - Product: ' + product.id);
              product.isAdded = true;
              scope.modal.addedProductsArray.push(product);
              console.log(scope.modal.addedProductsArray);
            }
          };

          scope.modal.removeProduct = function(product) {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Remove product on media detail for new tag - Product: ' + product.id);
            product.isAdded = false;
            var removedProduct = scope.modal.addedProductsArray.indexOf(product);
            scope.modal.addedProductsArray.splice(removedProduct, 1);
            console.log(scope.modal.addedProductsArray);
          };

          scope.modal.loadMore = function() {
            if (!scope.modal.hasMoreData) {
              return;
            }
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Scroll down', 'Load more search results on media detail for new tag');
            searchProducts();

            scope.$broadcast('scroll.infiniteScrollComplete');
            scope.$broadcast('scroll.resize');
          };


          scope.modal.backToMedia = function() {
            // the following statement doesnt work
            // $state.go('media');
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Cancel tagging on media detail page for new tag');
            scope.modal.products = undefined;

            MediaTagService.getMediaTags(scope.discoverMedia.id).then(function(result) {
              if (UtilityService.validateResult(result)) {
                var mediaTagsArray = result.data.payload.VISUALTAGS;
                scope.existingProductIds = UtilityService.getProductsFromVisualTags(mediaTagsArray);
                scope.mediaTagsArray = mediaTagsArray;

                var updatedTaggedProducts = [];

                for (var i=0,j=scope.mediaTagsArray.length; i<j; i++) {
                  scope.mediaTagsArray[i].active = false;
                  var mediaProducts = mediaTagsArray[i].products;
                  if(!!mediaProducts){
                    for(var k = 0, l = mediaProducts.length; k < l; k++){
                      updatedTaggedProducts.push(mediaProducts[k]);
                      updatedTaggedProducts = updatedTaggedProducts.reverse();
                    }
                  }
                }

                localStorageService.set('taggedProducts', updatedTaggedProducts);
                console.log(localStorageService.get('taggedProducts'));

                if (mediaTagsArray.length > 0) {
                  activeTagId = scope.mediaTagsArray[mediaTagsArray.length-1].id;
                  scope.mediaTagsArray[mediaTagsArray.length-1].active = true;
                  scope.taggedProducts = mediaTagsArray[mediaTagsArray.length-1].products;
                  scope.taggedProducts.userId = scope.mediaTagsArray[mediaTagsArray.length-1].user.id;
                  scope.taggedProducts[scope.taggedProducts.length] = {
                    addMoreProducts: true
                  };
                }
                 else {
                  scope.taggedProducts = [];
                }
            } else {
                console.log('error');
              }
            }, function(error){
              console.log('error');
            });

            scope.modal.remove();
          };

          scope.modal.taggingProducts = function() {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Tagging products on media detail page for new tag');

            if(tagProductsApiLocker) {
              console.log('return from tagging');
              return;
            }

            tagProductsApiLocker = true;

            var media = {
              id: scope.discoverMedia.id
            };

            var visualTag = {
              percentageX: percentageX,
              percentageY: percentageY,
              isVisible: true
            };

            var productIds = [];
            for(var i = 0, j=scope.modal.addedProductsArray.length; i < j; i++) {
              productIds.push(scope.modal.addedProductsArray[i].id);
            }

            MediaTagService.addMediaTag(scope.user, media, visualTag, productIds).then(function(result) {
              if (UtilityService.validateResult(result)) {
                console.log('media tag added');

                visualTag.id = result.data.payload.VISUALTAG.id;
                visualTag.tagMarkerClass = 'priceTagOutline';
                var left = percentageX * scope.imgWidth - 11;
                var top = percentageY * scope.imgHeight - 9;

                var marker = compileMarker(visualTag, left, top);
                element.find('.tag-marker-container').append(marker);
                scope.showTagProductSuccessMsg = true;
                var productTagged = true;
                hideTagProductMsg();
                localStorageService.set('mediaProductsUpdated', true);
                scope.modal.backToMedia();
              } else {
                console.log('error');
              }
            }, function(error) {
              console.log('error');
            });
          };

          $rootScope.$on('changeFilterOption', function(event, data){
            console.log(data.source);
            if(data.source == 'tagProducts') {
              pageNumber = 1;
              apiLocker = false;
              scope.modal.addedProductsArray = [];
              scope.modal.products = [];
              scope.modal.hasMoreData = false;
              scope.modal.emptySearchResults = false;
              searchProducts();
            }
          });

          $rootScope.$on('changeSortByOption', function(event, data){
            console.log(data.source);
            if(data.source == 'tagProducts') {
              pageNumber = 1;
              apiLocker = false;
              scope.modal.addedProductsArray = [];
              scope.modal.products = [];
              scope.modal.hasMoreData = false;
              scope.modal.emptySearchResults = false;
              searchProducts();
            }
          });
        });

          //tag products modal END

        element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            // event.preventDefault();

            console.log('press enter key');
            // searchProducts();
          }
        });

      });

      scope.switch2Tag = function(mediaTag) {
        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Switch tag on media detail page');
        // var tagMarkerArray = element.find('.tag-marker-container').find('.media-tag-marker');
        // for (var i=0, j=tagMarkerArray.length; i<j; i++) {
        //   if (tagMarkerArray[i].getAttribute('data-mediatag-id') == mediaTag.id) {
        //     console.log('data-mediatag-id: ' + tagMarkerArray[i].getAttribute('data-mediatag-id'));
        //     console.log('mediaTag.id: ' + mediaTag.id);
        //
        //     mediaTag.tagMarkerClass = 'priceTag';
        //   } else {
        //     mediaTag.tagMarkerClass = 'priceTagOutline';
        //   }
        // }

        for (var i=0, j=scope.mediaTagsArray.length; i<j; i++) {
          scope.mediaTagsArray[i].active = false;

          if (scope.mediaTagsArray[i].id === mediaTag.id) {
            scope.mediaTagsArray[i].tagMarkerClass = 'priceTag';
          } else {
            scope.mediaTagsArray[i].tagMarkerClass = 'priceTagOutline';
          }
        }

        mediaTag.active = true;
        activeTagId = mediaTag.id;

        // scope.mediaTagsArray[index].active = true;
        // activeTagId = scope.mediaTagsArray[index].id;

        scope.taggedProducts = mediaTag.products;
        scope.taggedProducts.userId = mediaTag.user.id;
        if (scope.taggedProducts[scope.taggedProducts.length - 1].addMoreProducts !== true) {
          scope.taggedProducts[scope.taggedProducts.length] = {
            addMoreProducts: true
          };
        }
      };

      scope.enableTagging = function() {
        if (scope.mediaTagsArray.length >= 9) {
          return;
        }

        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Enable tagging on media detail page for new tag');
        scope.tnpOverlayEnabled = true;
      };

      scope.reachTaggingLimit = function() {
        if (scope.mediaTagsArray.length < 9) {
          return;
        }

        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Reach tagging limit on media detail page');
        var alertPopup = $ionicPopup.alert({
          cssClass: 'reach-tagging-limit',
          template: 'Reached to tagging limit!'
        });
        alertPopup.then(function(res) {
          console.log('reach to tagging limit');
        });
      };

      scope.addMoreProducts = function() {
        console.log('add more products');
        console.log('activeTagId: ' + activeTagId);
        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Enable tagging on media detail page for existing tag');

        //Add products Modal START

        $ionicModal.fromTemplateUrl('add-products.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          // for angular error
          scope.taggedProducts = undefined;
          scope.modal = modal;
          scope.modal.show();

          var pageNumber = 1;
          var apiLocker = false;
          var addProductsApiLocker = false;
          scope.modal.addedProductsArray = [];
          scope.modal.products = [];
          scope.modal.hasMoreData = false;
          scope.modal.emptySearchResults = false;
          scope.modal.loadingSpinnerEnabled = false;
          scope.modal.imageHeight = UtilityService.getImageHeight(2);
          scope.modal.filterData = {
            sortBy: false,
            refineBy: false,
            productsCount: 0,
            selectedSortby: '',
            showFilters: false,
            searchSource: 'addProducts',
            filterParams : {
              sellerIds: [],
              brandIds: [],
              categoryIds: [],
              minPrice: '',
              maxPrice: '',
              sale: '',
              selectedSortby: 'relevancy'
            }
          };

          var searchProducts = function() {
            if (apiLocker || scope.modal.keyword == '') {
              return;
            }

            apiLocker = true;
            scope.modal.loadingSpinnerEnabled = true;
            ProductSearchService.searchProducts(pageNumber, scope.modal.keyword, scope.modal.filterData.filterParams).then(function(result) {
              if (UtilityService.validateResult(result)) {
                if (result.data.payload.PRODUCTS.length === 0) {
                  scope.modal.hasMoreData = false;
                  if (pageNumber == 1) {
                    scope.modal.emptySearchResults = true;
                    scope.modal.filterData.showFilters = false;
                  }

                } else {
                  scope.modal.filterData.showFilters = true;
                  scope.modal.filterData.productsCount = result.data.payload.COUNT;
                  pageNumber++;
                  scope.modal.hasMoreData = true;
                  scope.modal.emptySearchResults = false;
                  var products = result.data.payload.PRODUCTS;
                  scope.modal.products.push.apply(scope.modal.products, products);
                }
              } else {
                scope.modal.hasMoreData = false;
                console.log('error');
              }

              scope.modal.loadingSpinnerEnabled = false;
              apiLocker = false;
            }, function(error) {
              console.log('error');
              scope.modal.loadingSpinnerEnabled = false;
            });
          };

          scope.$watch('modal.keyword', function(newVal, oldVal) {
            if (scope.modal.hasMoreData) {
              scope.modal.searchDisabled = false;
              scope.modal.addedProductsArray = [];
            } else {
              scope.modal.searchDisabled = true;
            }
          });

          scope.modal.searchProducts = function() {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Search', 'Search on media detail for existing tag - keyword: ' + scope.modal.keyword);
            pageNumber = 1;
            apiLocker = false;
            scope.modal.addedProductsArray = [];
            scope.modal.products = [];
            scope.modal.hasMoreData = false;
            scope.modal.emptySearchResults = false;
            scope.modal.filterData.filterParams.sellerIds = [];
            scope.modal.filterData.filterParams.brandIds = [];
            scope.modal.filterData.filterParams.categoryIds = [];
            scope.modal.filterData.filterParams.minPrice = '';
            scope.modal.filterData.filterParams.maxPrice = '';
            scope.modal.filterData.filterParams.sale = '';
            scope.modal.filterData.filterParams.selectedSortby = 'relevancy';
            scope.modal.filterData.searchKeyword = scope.modal.keyword;
            scope.modal.filterData.sortBy = false;
            scope.modal.filterData.refineBy = false;
            scope.modal.filterData.productsCount = 0;
            scope.modal.filterData.showFilters = false;
            scope.$emit('setDefaultFilterValues', {action: 'search'});

            searchProducts();
          };

          scope.modal.addProduct = function(product) {
            if (scope.existingProductIds.indexOf(product.id) != -1) {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Already tagged product on media detail for existing tag - Product: ' + product.id);
              var alertPopup = $ionicPopup.alert({
                cssClass: 'reach-tagging-limit',
                template: 'It is already tagged in this image!'
              });
              alertPopup.then(function(res) {
                console.log('It is already tagged in this image!');
              });
            } else {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'New product on media detail for existing tag - Product: ' + product.id);
              product.isAdded = true;
              scope.modal.addedProductsArray.push(product);
              console.log(scope.modal.addedProductsArray);
            }
          };

          scope.modal.removeProduct = function(product) {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Remove product on media detail for existing tag - Product: ' + product.id);
            product.isAdded = false;
            var removedProduct = scope.modal.addedProductsArray.indexOf(product);
            scope.modal.addedProductsArray.splice(removedProduct, 1);
            console.log(scope.modal.addedProductsArray);
          };

          scope.modal.loadMore = function() {
            if (!scope.modal.hasMoreData) {
              return;
            }
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Scroll down', 'Load more search results on media detail for existing tag');
            searchProducts();

            scope.$broadcast('scroll.infiniteScrollComplete');
            scope.$broadcast('scroll.resize');
          };

          scope.modal.backToMedia = function() {
            // the following statement doesnt work
            // $state.go('media');
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Cancel tagging on media detail page for existing tag');
            scope.modal.products = undefined;
            scope.modal.addedProductsArray = undefined;

            MediaTagService.getMediaTags(scope.discoverMedia.id).then(function(result) {
              if (UtilityService.validateResult(result)) {
                var mediaTagsArray = result.data.payload.VISUALTAGS;
                scope.existingProductIds = UtilityService.getProductsFromVisualTags(mediaTagsArray);
                scope.mediaTagsArray = mediaTagsArray;

                var updatedTaggedProducts = [];

                for (var i=0,j=scope.mediaTagsArray.length; i<j; i++) {
                  scope.mediaTagsArray[i].active = false;
                  var mediaProducts = mediaTagsArray[i].products;
                  if(!!mediaProducts){
                    for(var k = 0, l = mediaProducts.length; k < l; k++){
                      updatedTaggedProducts.push(mediaProducts[k]);
                    }
                  }
                }

                localStorageService.set('taggedProducts', updatedTaggedProducts);
                console.log(localStorageService.get('taggedProducts'));

                if (mediaTagsArray.length > 0) {
                  activeTagId = scope.mediaTagsArray[mediaTagsArray.length-1].id;
                  scope.mediaTagsArray[mediaTagsArray.length-1].active = true;
                  scope.taggedProducts = mediaTagsArray[mediaTagsArray.length-1].products;
                  scope.taggedProducts.userId = scope.mediaTagsArray[mediaTagsArray.length-1].user.id;
                  scope.taggedProducts[scope.taggedProducts.length] = {
                    addMoreProducts: true
                  };
                }
                 else {
                  scope.taggedProducts = [];
                }

            } else {
                console.log('error');
              }
            }, function(error){
              console.log('error');
            });

            scope.modal.remove();
          };

          scope.modal.addingProducts = function() {
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Tagging products on media detail page for existing tag');

            if(addProductsApiLocker) {
              console.log('returning from adding products');
              return;
            }
            addProductsApiLocker = true;

            var visualTag = {
              id: activeTagId
            };

            var productIds = [];
            for(var i = 0, j=scope.modal.addedProductsArray.length; i < j; i++) {
              productIds.push(scope.modal.addedProductsArray[i].id);
            }

            MediaTagService.addTagProducts(visualTag, productIds).then(function(result) {
              if (UtilityService.validateResult(result)) {
                console.log('products added');
                localStorageService.set('mediaProductsUpdated', true);
                scope.modal.backToMedia();
              } else {
                console.log('error');
              }
            }, function(error) {
              console.log('error');
            });
          };

          $rootScope.$on('changeFilterOption', function(event, data){
            console.log(data.source);
            if(data.source == 'addProducts') {
              pageNumber = 1;
              apiLocker = false;
              scope.modal.addedProductsArray = [];
              scope.modal.products = [];
              scope.modal.hasMoreData = false;
              scope.modal.emptySearchResults = false;
              searchProducts();
            }
          });

          $rootScope.$on('changeSortByOption', function(event, data){
            console.log(data.source);
            if(data.source == 'addProducts') {
              pageNumber = 1;
              apiLocker = false;
              scope.modal.addedProductsArray = [];
              scope.modal.products = [];
              scope.modal.hasMoreData = false;
              scope.modal.emptySearchResults = false;
              searchProducts();
            }
          });

        });

        //Add products Modal END
      };

      scope.toggleFavoriteProduct = function(taggedProduct) {
        var productLike = !!taggedProduct.socialActionUserProduct ? taggedProduct.socialActionUserProduct.liked : false;

        if(!!productLike) {
          ProductDetailService.unlikeProduct(taggedProduct.id).then(function(response){
            if(UtilityService.validateResult(response)) {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Unlike product', 'Unlike product id - ' + taggedProduct.id + ' on media detail page');
              scope.taggedProducts =toggleProductLike(response.data.payload.PRODUCT, scope.taggedProducts);
            }
          });
        } else {
          ProductDetailService.likeProduct(taggedProduct.id).then(function(response){
            if(UtilityService.validateResult(response)) {
              UtilityService.gaTrackAppEvent('Media Detail Page', 'Like product', 'Like product id - ' + taggedProduct.id + ' on media detail page');
              scope.taggedProducts =toggleProductLike(response.data.payload.PRODUCT, scope.taggedProducts);
            }
          });
        }
      };

      scope.deleteProduct = function(productId) {
        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Delete tagged product on media detail page - Product: ' + productId);

        var visualTag = {
          id: activeTagId
        };

        var product = {
          id: productId
        };

        MediaTagService.deleteTagProduct(visualTag, product).then(function(result) {
          if (UtilityService.validateResult(result)) {
            scope.taggedProducts = spliceProductFrmArray(productId, scope.taggedProducts);
            scope.existingProductIds = spliceProductIdFrmArray(result.data.payload.PRODUCT.id, scope.existingProductIds);

            if (scope.taggedProducts.length === 1 && scope.taggedProducts[0].addMoreProducts === true) {
              scope.deleteMediaTag(visualTag);
            }
            //Adding fetch mediaTag call to serivce to update the mediatags after deleting the PRODUCT
            MediaTagService.getMediaTags(scope.discoverMedia.id).then(function(result) {
              if (UtilityService.validateResult(result)) {
                var mediaTagsArray = result.data.payload.VISUALTAGS;
                scope.existingProductIds = UtilityService.getProductsFromVisualTags(mediaTagsArray);
                scope.mediaTagsArray = mediaTagsArray;

                var updatedTaggedProducts = [];

                for (var i=0,j=scope.mediaTagsArray.length; i<j; i++) {
                  scope.mediaTagsArray[i].active = false;
                  var mediaProducts = mediaTagsArray[i].products;
                  if(!!mediaProducts){
                    for(var k = 0, l = mediaProducts.length; k < l; k++){
                      updatedTaggedProducts.push(mediaProducts[k]);
                    }
                  }
                }
                localStorageService.set('mediaProductsUpdated', true);
                localStorageService.set('taggedProducts', updatedTaggedProducts);
                console.log(localStorageService.get('taggedProducts'));

                if (mediaTagsArray.length > 0) {
                  activeTagId = scope.mediaTagsArray[mediaTagsArray.length-1].id;
                  scope.mediaTagsArray[mediaTagsArray.length-1].active = true;
                  scope.taggedProducts = mediaTagsArray[mediaTagsArray.length-1].products;
                  scope.taggedProducts.userId = scope.mediaTagsArray[mediaTagsArray.length-1].user.id;
                  scope.taggedProducts[scope.taggedProducts.length] = {
                    addMoreProducts: true
                  };

                  // draw the visual tags
                  for(var i = 0, j = mediaTagsArray.length; i < j; i++) {
                    var $marker, marker, markerScope;
                    var left = mediaTagsArray[i].percentageX * scope.imgWidth - 11;
                    var top = mediaTagsArray[i].percentageY * scope.imgHeight - 9;

                    if(mediaTagsArray[i].products.length === 0) {
                      console.log('product must have visual tag');
                    } else {
                      mediaTagsArray[i].tagMarkerClass = 'priceTagOutline';
                      marker = compileMarker(mediaTagsArray[i], left, top);

                      // add marker visually
                      element.find('.tag-marker-container').append(marker);
                    }
                  }
                }
                 else {
                  scope.taggedProducts = [];
                }

            } else {
                console.log('error');
              }
            }, function(error){
              console.log('error');
            });

          } else {
            console.log('error');
          }
        }, function(error) {
          console.log(error);
        });

      };

      scope.deleteMediaTag = function(visualTag) {
        UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Delete media tag on media detail page - VisualTag: ' + visualTag.id);

        var visualTag = {
          id: visualTag.id
        };

        MediaTagService.deleteMediaTag(visualTag).then(function(result) {
          if (UtilityService.validateResult(result)) {
            console.log('delete media tag successfully');

            var selector = 'div[data-mediatag-id=' + visualTag.id + ']';
            element.find(selector).remove();

            scope.mediaTagsArray = spliceProductFrmArray(visualTag.id, scope.mediaTagsArray);
            console.log(scope.mediaTagsArray);
            scope.existingProductIds = UtilityService.getProductsFromVisualTags(scope.mediaTagsArray);

            if (scope.mediaTagsArray.length > 0) {
              scope.switch2Tag(scope.mediaTagsArray[scope.mediaTagsArray.length-1]);
            } else {
              console.log('needs to take care of mediaTagsArray 0 case');
              scope.taggedProducts = [];
              scope.existingProductIds = [];
            }
            var updatedTaggedProducts = [];

            for (var i=0,j=scope.mediaTagsArray.length; i<j; i++) {
              var mediaProducts = scope.mediaTagsArray[i].products;
              if(!!mediaProducts){
                for(var k = 0, l = mediaProducts.length; k < l; k++){
                  updatedTaggedProducts.push(mediaProducts[k]);
                }
              }
            }
            localStorageService.set('mediaProductsUpdated', true);
            localStorageService.set('taggedProducts', updatedTaggedProducts);
            console.log(localStorageService.get('taggedProducts'));

          }
        }, function(error) {
          console.log(error);
        });
      };

      scope.productDetail = function(product) {
        UtilityService.gaTrackAppEvent('Media Detail Page', 'Click', 'Product detail page from media detail - Media: ' + scope.discoverMedia.id + ' - Product: ' + product.id);
        console.log(product);
        ProductDetailService.getProductDetail(product.id).then(function(response){
          if (UtilityService.validateResult(response)) {
              console.log(response);
              product.affiliateURL = decodeURIComponent(product.buyURL);
              product.mediaId = scope.discoverMedia.id;
              product.visualTagId = activeTagId;
              var productDetail = {
                xapp: product,
                source: 'media'
              };

              if(response.data.payload.PRODUCT.twoTapData) {
                productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
              }

              localStorageService.set('productDetail', productDetail);
              $state.go('product', {productId: product.id});

              // if(response.data.payload.PRODUCT.twoTapData) {
              //   product.affiliateURL = decodeURIComponent(product.buyURL);
              //   product.mediaId = scope.discoverMedia.id;
              //   product.visualTagId = activeTagId;
              //   var productDetail = {
              //     xapp: product,
              //     twotap: response.data.payload.PRODUCT.twoTapData,
              //     source: 'media'
              //   };
              //   localStorageService.set('productDetail', productDetail);
              //   $state.go('product', {productId: product.id});
              //
              // } else {
              //
              //   var productURL = UtilityService.cjProductUrlParser(product.buyURL);
              //   var options = {
              //       products: [productURL]
              //       };
              //
              //   TwoTapService.cart(options).success(function(response) {
              //     var options = {
              //       cart_id: response.cart_id
              //     };
              //
              //     TwoTapService.cartStatus(options).success(function(response) {
              //       product.affiliateURL = decodeURIComponent(product.buyURL);
              //       product.mediaId = scope.discoverMedia.id;
              //       product.visualTagId = activeTagId;
              //       var productDetail = {
              //         xapp: product,
              //         twotap: response,
              //         source: 'media'
              //       };
              //       localStorageService.set('productDetail', productDetail);
              //
              //       $state.go('product', {productId: product.id});
              //     });
              //   });
              // }
          }
        }, function(error) {
            console.log(error);
        });

        //
        // var productURL = UtilityService.cjProductUrlParser(product.buyURL);
        // var options = {
        //   products: [productURL]
        // };

        // TwoTapService.cart(options).success(function(response) {
        //   var options = {
        //     cart_id: response.cart_id
        //   };
        //
        //   TwoTapService.cartStatus(options).success(function(response) {
        //     product.affiliateURL = decodeURIComponent(product.buyURL);
        //     product.mediaId = scope.discoverMedia.id;
        //     product.visualTagId = activeTagId;
        //     var productDetail = {
        //       xapp: product,
        //       twotap: response,
        //       source: 'media'
        //     };
        //     localStorageService.set('productDetail', productDetail);
        //
        //     $state.go('product', {productId: product.id});
        //   });
        // });
      };

    }
  }
}])
.directive('mediaTagMarker', [ '$timeout', 'UtilityService', function($timeout, UtilityService){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'media-tag-marker.html',
      link: function(scope, element) {
        var timer;
        element[0].style.left = scope.offset.left + 'px';
        element[0].style.top = scope.offset.top + 'px';
        element[0].style.position = 'absolute';
        element[0].setAttribute('data-mediatag-id', scope.visualTag.id);

        scope.onDelete = function() {

          if(scope.enableDelete) {
            scope.onDeleteCallback(scope.visualTag.id);
          }

        };

        scope.activeTagMarker = function() {
          // if (scope.visualTag.tagMarkerClass === 'priceTag') {
          //   return;
          // } else {
            // scope.tagMarkerClass = 'priceTag';
            UtilityService.gaTrackAppEvent('Media Detail Page', 'Tagging', 'Switch tag marker on media detail page');
            scope.onSwitch2Tag(scope.visualTag);
          // }
        };

      }
    }
}]);
