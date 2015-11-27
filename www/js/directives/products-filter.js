'use strict';

angular.module('sywStyleXApp')
.directive('productsFilter', ['UtilityService', 'SortFilterService', 'ProductDetailService', 'localStorageService', 'TwoTapService', '$state', '$ionicScrollDelegate', '$ionicModal', '$rootScope', function(UtilityService, SortFilterService, ProductDetailService, localStorageService, TwoTapService, $state, $ionicScrollDelegate, $ionicModal, $rootScope){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'products-filter.html',
    scope: {
      profileData: '='
    },
    link: function(scope, element, attrs) {
      scope.toggleBtngroup = {
        sortBy: false,
        refine: false,
        productsCount: 0,
        profileType: '',
        // overlayHeight: !!(screen.height > 452) ? (screen.height - 452) : 0,
        overlayHeight: screen.height,
        iphone6Available: (screen.height > 600) ? true : false,
        sortByOptions: [
          {
            name: 'Most Relevant',
            value: 'relevancy'
          },
          {
            name: 'Price Low to High',
            value: 'price_low_to_high'
          },
          {
            name: 'Price High to Low',
            value: 'price_high_to_low'
          },
          // {
          //   name: 'On Sales Price Low to High',
          //   value: 'sale_price_low_to_high'
          // },
          {
            name: 'On Sales',
            value: 'sale_price_high_to_low'
          }
        ],
        selectedSortby: 'relevancy',
        selectedRefine: {
          brandIds: [],
          sellerIds: []
        }
      };

      if (!!scope.profileData) {
        if (!!scope.profileData.profileType) {
          scope.toggleBtngroup.profileType = scope.profileData.profileType;
        }

        if (!!scope.profileData.brandId) {
          scope.toggleBtngroup.selectedRefine.brandIds = [];
          scope.toggleBtngroup.selectedRefine.sellerIds = [];
          scope.toggleBtngroup.selectedRefine.brandIds.push(parseInt(scope.profileData.brandId));
        } else if (!!scope.profileData.productsType) {
          scope.toggleBtngroup.selectedRefine.brandIds = [];
          scope.toggleBtngroup.selectedRefine.sellerIds = [];

          if (scope.profileData.productsType == 'liked') {
            scope.toggleBtngroup.selectedRefine.brandIds = scope.profileData.likedBrandIds;
            scope.toggleBtngroup.selectedRefine.sellerIds = scope.profileData.likedSellerIds;
          } else {
            scope.toggleBtngroup.selectedRefine.brandIds = scope.profileData.savedBrandsIds;
            scope.toggleBtngroup.selectedRefine.sellerIds = scope.profileData.savedSellerIds;
          }
        }
      }

      var filteredProductsPageNumber = 1;
      var filteredProductsApiLocker = false;
      var filteredProductsHasMoreData = true;
      var filteredSellersPageNumber = 1;
      var filteredSellersApiLocker = false;
      var filteredSellersHasMoreData = true;
      var filteredBrandsPageNumber = 1;
      var filteredBrandsApiLocker = false;
      var filteredBrandsHasMoreData = true;
      var productDetailLocker = false;
      var filterRequest = '';
      var brandTempSellerIds = [];
      scope.filteredProducts = [];
      scope.filteredSellers = [];
      scope.filteredBrands = [];
      scope.productImageHeight = UtilityService.getImageHeight(2);
      localStorageService.set('filteredProductsHasMoreData', 1);

      var getFilteredSellers = function(productsType) {
        if (filteredSellersApiLocker || !filteredSellersHasMoreData) {
          return;
        }

        filteredSellersApiLocker = true;

        SortFilterService.getFilteredSellers(productsType, filteredSellersPageNumber).then(function(res) {
          if (UtilityService.validateResult(res)) {
            if (res.data.payload.SELLERS.length === 0) {
              filteredSellersHasMoreData = false
            } else {
              filteredSellersPageNumber++;
              filteredSellersHasMoreData = true;
              var filteredSellers = res.data.payload.SELLERS;
              scope.filteredSellers.push.apply(scope.filteredSellers, filteredSellers);
            }
          } else {
            filteredSellersHasMoreData = false;
            console.log('error');
          }

          filteredSellersApiLocker = false;
        });
      };

      var getFilteredBrands = function(productsType) {
        if (filteredBrandsApiLocker || !filteredBrandsHasMoreData) {
          return;
        }

        filteredBrandsApiLocker = true;

        SortFilterService.getFilteredBrands(productsType, filteredBrandsPageNumber).then(function(res) {
          if (UtilityService.validateResult(res)) {
            if (res.data.payload.BRANDS.length === 0) {
              filteredBrandsHasMoreData = false
            } else {
              filteredBrandsPageNumber++;
              filteredBrandsHasMoreData = true;
              var filteredBrands = res.data.payload.BRANDS;
              scope.filteredBrands.push.apply(scope.filteredBrands, filteredBrands);
            }
          } else {
            filteredBrandsHasMoreData = false;
            console.log('error');
          }

          filteredBrandsApiLocker = false;
        });
      };

      var getFilteredProducts = function() {

        if ((scope.toggleBtngroup.profileType == 'user') || filteredProductsApiLocker || !filteredProductsHasMoreData) {
          return;
        }

        if (scope.toggleBtngroup.profileType == 'self') {
          if (scope.profileData.productsType == 'liked') {
            filterRequest = 'LIKED_PRODUCTS';
          } else {
            filterRequest = 'SAVED_PRODUCTS';
          }
        } else {
          filterRequest = '';
        }

        filteredProductsApiLocker = true;

        SortFilterService.getFilteredProducts(scope.toggleBtngroup.selectedRefine.brandIds, scope.toggleBtngroup.selectedRefine.sellerIds, scope.toggleBtngroup.selectedSortby, filteredProductsPageNumber, filterRequest).then(function(res) {
          if (UtilityService.validateResult(res)) {
            if (filteredProductsPageNumber == 1) {
              scope.toggleBtngroup.productsCount = res.data.payload.COUNT;
            }

            if (res.data.payload.PRODUCTS.length === 0) {
              filteredProductsHasMoreData = false;
              localStorageService.set('filteredProductsHasMoreData', 0);
            } else {
              filteredProductsPageNumber++;
              filteredProductsHasMoreData = true;
              var filteredProducts = res.data.payload.PRODUCTS;
              scope.filteredProducts.push.apply(scope.filteredProducts, filteredProducts);
              localStorageService.set('filteredProductsHasMoreData', 1);
            }
          } else {
            filteredProductsHasMoreData = false;
            console.log('error');
          }

          filteredProductsApiLocker = false;
        });
      };

      var getFilteredBrandSellers = function() {
        if (filteredSellersApiLocker || !filteredSellersHasMoreData) {
          return;
        }

        filteredSellersApiLocker = true;

        SortFilterService.getFilteredBrandSellers(scope.profileData.brandId, filteredSellersPageNumber).then(function(res) {
          if (UtilityService.validateResult(res)) {
            if (res.data.payload.SELLERS.length === 0) {
              filteredSellersHasMoreData = false;
            } else {
              filteredSellersPageNumber++;
              filteredSellersHasMoreData = true;
              var filteredBrandSellers = res.data.payload.SELLERS;
              scope.filteredSellers.push.apply(scope.filteredSellers, filteredBrandSellers);
            }
          } else {
            filteredSellersHasMoreData = false;
            console.log('error');
          }

          filteredSellersApiLocker = false;
        });
      };

      var toggleProductLike = function(product, profileProductsArray) {
        for (var i = 0, j = profileProductsArray.length; i < j; i++) {
          if (profileProductsArray[i].id == product.id) {
            profileProductsArray[i].socialActionUserProduct = {
              liked: product.socialActionUserProduct.liked
            };
          }
        };
        return profileProductsArray;
      };

      scope.resetAllFilters = function() {
        scope.toggleBtngroup.selectedRefine.sellerIds = [];
        scope.toggleBtngroup.selectedRefine.brandIds = [];

        if (!!scope.profileData.brandId) {
          scope.toggleBtngroup.selectedRefine.brandIds.push(parseInt(scope.profileData.brandId));
        }

        for (var i=0, j=scope.filteredSellers.length; i<j; i++) {
          scope.filteredSellers[i].selected = false;
        }

        for (var i=0, j=scope.filteredBrands.length; i<j; i++) {
          scope.filteredBrands[i].selected = false;
        }
      };

      scope.toggleFilteredSellers = function(item) {
        if (scope.toggleBtngroup.selectedRefine.sellerIds.indexOf(item.id) == -1) {
          item.selected = true;
          scope.toggleBtngroup.selectedRefine.sellerIds.push(item.id);
          console.log(scope.toggleBtngroup.selectedRefine.sellerIds);
        } else {
          item.selected = false;
          var index = scope.toggleBtngroup.selectedRefine.sellerIds.indexOf(item.id);
          scope.toggleBtngroup.selectedRefine.sellerIds.splice(index, 1);
          console.log(scope.toggleBtngroup.selectedRefine.sellerIds);
        }

        brandTempSellerIds = scope.toggleBtngroup.selectedRefine.sellerIds;
      };

      scope.toggleFilteredBrands = function(item) {
        if (scope.toggleBtngroup.selectedRefine.brandIds.indexOf(item.id) == -1) {
          item.selected = true;
          scope.toggleBtngroup.selectedRefine.brandIds.push(item.id);
          console.log(scope.toggleBtngroup.selectedRefine.brandIds);
        } else {
          item.selected = false;
          var index = scope.toggleBtngroup.selectedRefine.brandIds.indexOf(item.id);
          scope.toggleBtngroup.selectedRefine.brandIds.splice(index, 1);
          console.log(scope.toggleBtngroup.selectedRefine.brandIds);
        }
      };

      scope.changeSortByOptions = function(option) {
        localStorageService.set('filteredProductsHasMoreData', 1);
        filteredProductsPageNumber = 1;
        filteredProductsApiLocker = false;
        filteredProductsHasMoreData = true;
        // scope.toggleBtngroup.selectedRefine.brandIds = [];
        // scope.toggleBtngroup.selectedRefine.sellerIds = [];
        scope.toggleBtngroup.selectedSortby = option.value;
        scope.filteredProducts = [];
        getFilteredProducts();
        scope.toggleBtngroup.sortBy = false;
        $ionicScrollDelegate.freezeAllScrolls(false);
      };

      scope.toggleSortby = function() {
        if (scope.toggleBtngroup.refine) {
          scope.toggleBtngroup.refine = false;
        }

        if (scope.toggleBtngroup.sortBy) {
          UtilityService.gaTrackAppEvent('Product Filter', 'Toggle', 'Hide sortby on product filter');
          scope.toggleBtngroup.sortBy = false;
          $ionicScrollDelegate.freezeAllScrolls(false);
        } else {
          UtilityService.gaTrackAppEvent('Product Filter', 'Toggle', 'Show sortby on product filter');
          scope.toggleBtngroup.sortBy = true;
          $ionicScrollDelegate.freezeAllScrolls(true);
        }
      };

      scope.openRefineOption = function() {
        if (scope.toggleBtngroup.sortBy) {
          scope.toggleBtngroup.sortBy = false;
          $ionicScrollDelegate.freezeAllScrolls(false);
        }

        $ionicModal.fromTemplateUrl('filter-refine.html', {
          scope: scope,
          animation: 'slide-in-left'
        }).then(function(modal) {
          scope.modal = modal;
          scope.modal.title = 'FILTER';
          scope.modal.show();

          scope.modal.showSellersFilter = function() {
            scope.modal.title = 'SELECT SELLER';
            if (!!scope.profileData.productsType) {
              getFilteredSellers(scope.profileData.productsType);
            } else {
              getFilteredBrandSellers();
            }
          };

          scope.modal.showBrandsFilter = function() {
            scope.modal.title = 'SELECT BRAND';
            if (!!scope.profileData.productsType) {
              getFilteredBrands(scope.profileData.productsType);
            }
          };

          scope.modal.backToFiltersOption = function() {
            scope.modal.title = 'FILTER';
          };

          scope.modal.hasMoreData = function() {
            if (scope.modal.title == 'SELECT SELLER') {
              return filteredSellersHasMoreData;
            } else if (scope.modal.title == 'SELECT BRAND') {
              return filteredBrandsHasMoreData;
            }
          };

          scope.modal.loadMore = function() {
            if (!scope.modal.hasMoreData()) {
              return;
            }

            if (scope.modal.title == 'SELECT SELLER') {
              if (!!scope.profileData.productsType) {
                getFilteredSellers(scope.profileData.productsType);
              } else {
                getFilteredBrandSellers();
              }
            } else if (scope.modal.title == 'SELECT BRAND') {
              getFilteredBrands(scope.profileData.productsType);
            }
          };
        });
      };

      scope.closeRefineOption = function(title) {
        if (title == 'FILTER') {
          localStorageService.set('filteredProductsHasMoreData', 1);
          filteredProductsHasMoreData = true;
          filteredProductsPageNumber = 1;
          scope.filteredProducts = [];
          getFilteredProducts();

          if (scope.toggleBtngroup.selectedRefine.brandIds.length > 0 || scope.toggleBtngroup.selectedRefine.sellerIds.length > 0) {
            if (!!scope.profileData.brandId && scope.toggleBtngroup.selectedRefine.brandIds.length == 1 && scope.toggleBtngroup.selectedRefine.sellerIds.length == 0) {
              scope.toggleBtngroup.refine = false;
            } else {
              scope.toggleBtngroup.refine = true;
            }
          } else {
            scope.toggleBtngroup.refine = false;
          }

          scope.modal.hide();
        } else {
          scope.modal.title = 'FILTER';
        }
      };

      scope.toggleLikeProfileProduct = function(toggleLikeProduct) {

        var likeProfileProduct = !!toggleLikeProduct.socialActionUserProduct ? toggleLikeProduct.socialActionUserProduct.liked : false;

        if(!!likeProfileProduct) {
          ProductDetailService.unlikeProduct(toggleLikeProduct.id).then(function(response){
            if(UtilityService.validateResult(response)) {
              UtilityService.gaTrackAppEvent('Product Filter', 'Unlike product', 'Unlike product id - ' + toggleLikeProduct.id + ' on product filter');
              scope.profileProducts = toggleProductLike(response.data.payload.PRODUCT, scope.filteredProducts);
            }
          });
        } else {
          ProductDetailService.likeProduct(toggleLikeProduct.id).then(function(response){
            if(UtilityService.validateResult(response)) {
              UtilityService.gaTrackAppEvent('Product Filter', 'Like product', 'Like product id - ' + toggleLikeProduct.id + ' on product filter');
              scope.profileProducts = toggleProductLike(response.data.payload.PRODUCT, scope.filteredProducts);
            }
          });
        }
      };

      scope.productDetail = function(product) {
        if (productDetailLocker) {
          return;
        }
        productDetailLocker = true;
        product.affiliateURL = decodeURIComponent(product.buyURL);
        product.mediaId = !!product.mediaId ? product.mediaId : null;
        product.visualTagId = !!product.visualTagId ? product.visualTagId : null;

        UtilityService.gaTrackAppEvent('Product Filter', 'Click', 'Product detail page from product filter - Product: ' + product.id);

        ProductDetailService.getProductDetail(product.id).then(function(response){
          if (UtilityService.validateResult(response)) {
            console.log(response);
            var productDetail = {
              xapp: product,
              source: scope.profileData.source
            };
            
            if(response.data.payload.PRODUCT.twoTapData) {
              productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
            }

            localStorageService.set('productDetail', productDetail);
            productDetailLocker = false;

            $state.go('product', {productId: product.id});

      //logic to call twoTap status

            // if (response.data.payload.PRODUCT.twoTapData) {
            //   var productDetail = {
            //     xapp: product,
            //     twotap: response.data.payload.PRODUCT.twoTapData,
            //     source: scope.profileData.source
            //   };
            //   localStorageService.set('productDetail', productDetail);
            //   productDetailLocker = false;
            //
            //   $state.go('product', {productId: product.id});
            // } else {
            //   var productURL = UtilityService.cjProductUrlParser(product.buyURL);
            //   var options = {
            //     products: [productURL]
            //   };
            //
            //   TwoTapService.cart(options).success(function(response) {
            //     var options = {
            //       cart_id: response.cart_id
            //     };
            //
            //     TwoTapService.cartStatus(options).success(function(response) {
            //       var productDetail = {
            //         xapp: product,
            //         twotap: response,
            //         source: scope.profileData.source
            //       };
            //       localStorageService.set('productDetail', productDetail);
            //       productDetailLocker = false;
            //
            //       $state.go('product', {productId: product.id});
            //     });
            //   });
            // }
          }
        }, function(error) {
            console.log(error);
        });

      };

      getFilteredProducts();

      scope.$watch('scope.profileData.productsType', function(newVal, oldVal) {

        filteredSellersPageNumber = 1;
        filteredSellersApiLocker = false;
        filteredSellersHasMoreData = true;
        filteredBrandsPageNumber = 1;
        filteredBrandsApiLocker = false;
        filteredBrandsHasMoreData = true;
        productDetailLocker = false;
        scope.filteredProducts = [];
        scope.filteredSellers = [];
        scope.filteredBrands = [];
        scope.toggleBtngroup.selectedSortby = 'relevancy';

        if (scope.profileData.productsType == 'liked') {
          scope.toggleBtngroup.selectedRefine.brandIds = scope.profileData.likedBrandIds;
          scope.toggleBtngroup.selectedRefine.sellerIds = scope.profileData.likedSellerIds;
        } else {
          scope.toggleBtngroup.selectedRefine.brandIds = scope.profileData.savedBrandsIds;
          scope.toggleBtngroup.selectedRefine.sellerIds = scope.profileData.savedSellerIds;
        }
        localStorageService.set('filteredProductsHasMoreData', 1);
      });

      $rootScope.$on('loadMoreFilteredProducts', function(event, data) {
        console.log('from - ' + data.source);

        if (!!localStorageService.get('filteredProductsHasMoreData')) {
          if (!!scope.profileData.productsType) {
            console.log('from settings page - ' + scope.profileData.productsType);
          } else {
            scope.toggleBtngroup.selectedRefine.brandIds = [];
            scope.toggleBtngroup.selectedRefine.sellerIds = brandTempSellerIds;
            scope.toggleBtngroup.selectedRefine.brandIds.push(parseInt(scope.profileData.brandId));
            console.log('from public profile page');
          }

          UtilityService.gaTrackAppEvent('Product Filter', 'Scroll down', 'Scroll down to load more products on product filter');
          getFilteredProducts();
        }
      });


    }
  };
}]);
