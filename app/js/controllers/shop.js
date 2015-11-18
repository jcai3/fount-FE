'use strict';

angular.module('sywStyleXApp')
.controller('ShopCtrl', ['$rootScope','$scope', 'UtilityService', 'SortFilterService', function($rootScope, $scope, UtilityService, SortFilterService) {
  $scope.shopObj = {
    topFilter: 'SALE',
    topSellerId: 0
  };

  $scope.setTopFilter = function(filter) {
    if ($scope.shopObj.topFilter == filter) {
      return;
    }

    $scope.shopObj.topFilter = filter;
  };

  var getShopSellers = function() {
    SortFilterService.getShopSellers($scope.shopObj.topFilter).then(function(result) {
      if (UtilityService.validateResult(result)) {
        // $scope.shopObj.sellers = result.data.payload.SELLERS;
        $scope.shopObj.sellers = [
        {
        id: 41,
        name: "Sears",
        productsCount: 156458,
        selected: true
        },
        {
        id: 42,
        name: "Kmart",
        productsCount: 133212,
        selected: true
        },
        {
        id: 30,
        name: "Office Depot and OfficeMax",
        productsCount: 106699,
        selected: true
        },
        {
        id: 5,
        name: "Old Navy",
        productsCount: 49193,
        selected: true
        },
        {
        id: 4,
        name: "Gap",
        productsCount: 20447,
        selected: true
        },
        {
        id: 3,
        name: "Vitamin Shoppe",
        productsCount: 10809,
        selected: true
        },
        {
        id: 11,
        name: "Athleta",
        productsCount: 7787,
        selected: true
        },
        {
        id: 34,
        name: "Shopbop",
        productsCount: 5727,
        selected: true
        },
        {
        id: 6,
        name: "Banana Republic",
        productsCount: 3464,
        selected: true
        },
        {
        id: 12,
        name: "Adorama",
        productsCount: 3177,
        selected: true
        },
        {
        id: 18,
        name: "Ted Baker",
        productsCount: 2900,
        selected: true
        },
        {
        id: 23,
        name: "Sur La Table",
        productsCount: 2038,
        selected: true
        },
        {
        id: 22,
        name: "Under Armour",
        productsCount: 1921,
        selected: true
        },
        {
        id: 16,
        name: "MANGO",
        productsCount: 1812,
        selected: true
        },
        {
        id: 10,
        name: "ashford",
        productsCount: 1286,
        selected: true
        },
        {
        id: 33,
        name: "ULTA Beauty",
        productsCount: 980,
        selected: true
        },
        {
        id: 28,
        name: "Cost Plus World Market",
        productsCount: 874,
        selected: true
        },
        {
        id: 38,
        name: "Fossil",
        productsCount: 692,
        selected: true
        },
        {
        id: 29,
        name: "DisneyStore",
        productsCount: 481,
        selected: true
        },
        {
        id: 25,
        name: "Sunglass Hut Affiliate Program",
        productsCount: 354,
        selected: true
        },
        {
        id: 37,
        name: "Dwell",
        productsCount: 95,
        selected: true
        },
        {
        id: 15,
        name: "Stuart Weitzman - US",
        productsCount: 57,
        selected: true
        }
      ];
      }
    });
  };

  var getSellerProducts = function() {
    SortFilterService.getSellerProducts($scope.shopObj.topSellerId, $scope.shopObj.topFilter, pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {

      }
    });
  };

  getShopSellers();


//   UtilityService.gaTrackAppView('Shop Page View');
//
//   var pageNumber = 1;
//   var apiLocker = false;
//   var productDetailLocker = false;
//   $scope.products = [];
//   $scope.hasMoreData = false;
//   $scope.emptySearchResults = false;
//   $scope.showShopSearch = true;
//   $scope.loadingSpinnerEnabled = false;
//   $scope.imageHeight = UtilityService.getImageHeight(2);
//   $scope.searchObj = {
//     keyword: ''
//   };
//   $scope.filterData = {
//     sortBy: false,
//     refineBy: false,
//     productsCount: 0,
//     selectedSortby: '',
//     showFilters: false,
//     searchSource: 'shop',
//     filterParams : {
//       sellerIds: [],
//       brandIds: [],
//       categoryIds: [],
//       minPrice: '',
//       maxPrice: '',
//       sale: '',
//       selectedSortby: 'relevancy'
//     }
//   };
//
//   var searchProducts = function() {
//     $scope.showShopSearch = false;
//     if (apiLocker || $scope.searchObj.keyword == '') {
//       return;
//     }
//
//     apiLocker = true;
//     $scope.loadingSpinnerEnabled = true;
//
//     ProductSearchService.searchProducts(pageNumber, $scope.searchObj.keyword, $scope.filterData.filterParams).then(function(result) {
//       if (UtilityService.validateResult(result)) {
//         if (result.data.payload.PRODUCTS.length === 0) {
//           $scope.hasMoreData = false;
//           if(pageNumber == 1) {
//             $scope.emptySearchResults = true;
//             $scope.filterData.showFilters = false;
//           }
//
//         } else {
//           $scope.filterData.productsCount = result.data.payload.COUNT;
//           $scope.filterData.showFilters = true;
//           pageNumber++;
//           $scope.hasMoreData = true;
//           $scope.emptySearchResults = false;
//           var products = result.data.payload.PRODUCTS;
//           for (var i = 0, j = products.length; i < j; i++) {
//             if(!!products[i].twoTapData) {
//               var sites = [];
//               for (var key in products[i].twoTapData.sites) {
//                 sites.push(products[i].twoTapData.sites[key]);
//               }
//
//               var addToCart = [];
//               if (!!sites[0]) {
//                 for (var key in sites[0].add_to_cart) {
//                   addToCart.push(sites[0].add_to_cart[key]);
//                 }
//               }
//
//               if(!!addToCart[0]) {
//                 products[i].price =  Number(addToCart[0].price.substr(1));
//               }
//             }
//           }
//           $scope.products.push.apply($scope.products, products);
//         }
//       } else {
//         $scope.hasMoreData = false;
//         console.log('error');
//       }
//       $scope.loadingSpinnerEnabled = false;
//       apiLocker = false;
// //      $scope.filterData.emptySearchResults = $scope.emptySearchResults;
//     }, function(error) {
//       console.log('error');
//       $scope.loadingSpinnerEnabled = false;
//     });
//   };
//
//   var setDefaultValues = function(userAction) {
//     pageNumber = 1;
//     apiLocker = false;
//     $scope.products = [];
//     $scope.hasMoreData = false;
//     $scope.filterData.showFilters = false;
//     $scope.filterData.sortBy = false;
//     $scope.filterData.refineBy = false;
//     $scope.filterData.productsCount = 0;
//     $scope.filterData.searchKeyword = $scope.searchObj.keyword;
//     $scope.filterData.filterParams.sellerIds = [];
//     $scope.filterData.filterParams.brandIds = [];
//     $scope.filterData.filterParams.categoryIds = [];
//     $scope.filterData.filterParams.minPrice = '';
//     $scope.filterData.filterParams.maxPrice = '';
//     $scope.filterData.filterParams.sale = '';
//     $scope.filterData.filterParams.selectedSortby = 'relevancy';
//     $scope.$emit('setDefaultFilterValues', {action: userAction});
//   };
//
//   $scope.searchProducts = function() {
//     if (window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.close();
//     }
//
//     UtilityService.gaTrackAppEvent('Shop Page', 'Search', 'Search on shop page - keyword: ' + $scope.searchObj.keyword);
//     // pageNumber = 1;
//     // apiLocker = false;
//     // $scope.products = [];
//     // $scope.hasMoreData = false;
//     // $scope.emptySearchResults = false;
//     // $scope.filterData.selectedSortby = 'relevancy';
//     // $scope.filterData.showFilters = false;
//     // $scope.filterData.sortBy = false;
//     // $scope.filterData.refineBy = false;
//     // $scope.filterData.productsCount = 0;
//     $scope.emptySearchResults = false;
//     setDefaultValues('search');
//     searchProducts();
//   };
//
//   $scope.loadMore = function() {
//     if (!$scope.hasMoreData) {
//       return;
//     }
//
//     UtilityService.gaTrackAppEvent('Shop Page', 'Scroll down', 'Load more search results on shop page');
//     searchProducts();
//
//     $scope.$broadcast('scroll.infiniteScrollComplete');
//     $scope.$broadcast('scroll.resize');
//   };
//
//   $scope.backToShop = function() {
//     UtilityService.gaTrackAppEvent('Shop Page', 'Click', 'Back to shop page from search results');
//     // pageNumber = 1;
//     // apiLocker = false;
//     $scope.searchObj.keyword = '';
//     $scope.showShopSearch = true;
//     setDefaultValues('back');
//     // $scope.products = [];
//     // $scope.hasMoreData = false;
//     // $scope.showShopSearch = true;
//     // $scope.filterData.selectedSortby = 'relevancy';
//     // $scope.filterData.sortBy = false;
//     // $scope.filterData.refineBy = false;
//     // $scope.filterData.productsCount = 0;
//     // $scope.filterData.showFilters = false;
//   };
//
//   $scope.productDetail = function(product) {
//     if (productDetailLocker) {
//       return;
//     }
//     productDetailLocker = true;
//
//     UtilityService.gaTrackAppEvent('Shop Page', 'Click', 'Product detail page from shop page - Product: ' + product.id);
//
//     ProductDetailService.getProductDetail(product.id).then(function(response){
//       if (UtilityService.validateResult(response)) {
//         console.log(response);
//         product.affiliateURL = decodeURIComponent(product.buyURL);
//         product.mediaId = null;
//         product.visualTagId = null;
//         product.brandName = !!product.brand ? product.brand.name : null;
//         product.brandId = !!product.brand ? product.brand.id : null;
//         product.sellerName = !!product.seller ? product.seller.name : null;
//
//         if(!!response.data.payload.PRODUCT.socialActionUserProduct) {
//           product.socialActionUserProduct = response.data.payload.PRODUCT.socialActionUserProduct;
//         }
//
//         var productDetail = {
//           xapp: product,
//           source: 'shop'
//         };
//
//         if(response.data.payload.PRODUCT.twoTapData) {
//           productDetail.twotap = response.data.payload.PRODUCT.twoTapData;
//         }
//
//         localStorageService.set('productDetail', productDetail);
//         productDetailLocker = false;
//
//         $state.go('product', {productId: product.id});
//       }
//     }, function(error) {
//         console.log(error);
//     });
//
//   };
//
//   $scope.$watch('searchObj.keyword', function(newVal, oldVal) {
// //    $scope.filterData.searchKeyword = $scope.searchObj.keyword;
//     if ($scope.hasMoreData) {
//       $scope.searchDisabled = false;
//     } else {
//       $scope.searchDisabled = true;
//     }
//   });
//
//   $rootScope.$on('changeFilterOption', function(event, data){
//     console.log(data.source);
//     if(data.source == 'shop') {
//       pageNumber = 1;
//       apiLocker = false;
//       $scope.products = [];
//       $scope.hasMoreData = false;
//       $scope.showShopSearch = true;
//       searchProducts();
//     }
//   });
//
//   $rootScope.$on('changeSortByOption', function(event, data){
//     console.log(data.source);
//     if(data.source == 'shop') {
//       pageNumber = 1;
//       apiLocker = false;
//       $scope.products = [];
//       $scope.hasMoreData = false;
//       $scope.showShopSearch = true;
//       searchProducts();
//     }
//   });
//
//   $scope.$on('$ionicView.enter', function() {
//     var shoppingCartInfo = localStorageService.get('shoppingCartInfo');
//     $scope.shoppingCartInfo = {
//       count: !!shoppingCartInfo ? shoppingCartInfo.count : 0,
//       // subtotal: !!shoppingCartInfo ? UtilityService.numberParser(shoppingCartInfo.subtotal) : 0
//       subtotal: 0
//     };
//   });

}]);
