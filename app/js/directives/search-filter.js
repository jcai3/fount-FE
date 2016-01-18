'use strict';

angular.module('sywStyleXApp')
.directive('searchFilter', ['UtilityService', 'ProductDetailService', 'ProductSearchService', 'localStorageService', 'TwoTapService', '$state', '$ionicScrollDelegate', '$ionicModal', '$rootScope', '$location', '$timeout',function(UtilityService, ProductDetailService, ProductSearchService, localStorageService, TwoTapService, $state, $ionicScrollDelegate, $ionicModal, $rootScope, $location, $timeout){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'search-filter.html',
    scope: {
      filterData: '='
    },
    link: function(scope, element, attrs) {
      var sellerIds = [],
          brandIds = [],
          categoryIds = [],
          minPrice = '',
          maxPrice = '',
          saleDiscount = '',
          selectedSortby = scope.filterData.filterParams.selectedSortby;

      var categoryFilterList = [];
      var brandFilterList = {};
      var storeFilterList = [];
      var priceFilterList = [];
      var saleFilterList = [];
      var filterOptionsSelected = false;

      scope.toggleBtngroup = {
        profileType: '',
        overlayHeight: screen.height,
        allListItemsSelected : true,
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
          {
            name: 'New Arrivals',
            value: 'arrival'
          }
          // {
          //   name: 'Most Liked',
          //   value: 'most_liked'
          // },
          // {
          //   name: 'Best Sellers',
          //   value: 'best_sellers'
          // }
        ],
        selectedSortby: 'relevancy',
        refineByOptions: [
          {
            name: 'STORE',
            value: 'store'
          },
          {
            name: 'CATEGORY',
            value: 'category'
          },
          {
            name: 'BRANDS',
            value: 'brands'
          },
          {
            name: 'PRICE',
            value: 'price'
          },
          {
            name: 'SALE',
            value: 'sale'
          }
        ],
        selectedRefineBy: 'store',
        refineByTitle: 'All Categories',
        filterList: [],
        filterOptionHeight: 0
      };
      scope.alphabet = [];
      scope.loadingSpinnerEnabled = false;
      scope.filterBrands = {};
      scope.deviceObj = {
        iphone4Height: (screen.height < 500) ? true : false,
        iphone5Height: (screen.height > 500 && screen.height < 600) ? true : false,
        iphone6Height: (screen.height > 600 && screen.height < 700) ? true : false,
        iphone6PlusHeight: (screen.height > 700) ? true : false
      };
      scope.toggleBtngroup.selectedSortby = selectedSortby;

      var setFilterParams = function() {
        scope.filterData.filterParams.sellerIds = sellerIds;
        scope.filterData.filterParams.brandIds = brandIds;
        scope.filterData.filterParams.categoryIds = categoryIds;
        scope.filterData.filterParams.minPrice = minPrice;
        scope.filterData.filterParams.maxPrice = maxPrice;
        scope.filterData.filterParams.sale = saleDiscount;
        scope.filterData.filterParams.selectedSortby = scope.toggleBtngroup.selectedSortby;
      };

      var switchFiltersList = function() {
        switch (scope.toggleBtngroup.selectedRefineBy) {
          case 'category':
            scope.toggleBtngroup.filterList = categoryFilterList;
            scope.toggleBtngroup.refineByTitle = 'All Categories';
            break;
          case 'store':
            scope.toggleBtngroup.filterList = storeFilterList;
            scope.toggleBtngroup.refineByTitle = 'All Sellers';
            break;
          case 'brands':
            scope.filterBrands = brandFilterList;
            scope.toggleBtngroup.refineByTitle = 'All Brands';
            break;
          case 'price':
            scope.toggleBtngroup.filterList = priceFilterList;
            scope.toggleBtngroup.refineByTitle = 'All Prices';
            break;
          case 'sale':
            scope.toggleBtngroup.filterList = saleFilterList;
            scope.toggleBtngroup.refineByTitle = 'Regular and sale items';
            break;
          default:
            console.log('invalid refineBy filter option');
        }
      };

      var toggleListItemId = function(listObj, filterIds) {
        var idx = filterIds.indexOf(listObj.id);
        if(idx >= 0) {
          filterIds.splice(idx, 1);
        } else {
          filterIds.push(listObj.id);
        }

        if(filterIds.length == 0) {
          scope.toggleBtngroup.allListItemsSelected = true;
        } else {
          scope.toggleBtngroup.allListItemsSelected = false;
        }

        if(filterIds.length > 0) {
          filterOptionsSelected = true;
        } else {
          filterOptionsSelected = false;
        }

        return filterIds;
      };

      var changeFilterObj = function(filterObj, type) {
        var filterArray = [];
        if(type == 'price') {
          for(var i = 0, j = filterObj.length; i < j; i++) {
            var priceObj = {
              name: '$0 - $0',
              minPrice: 0,
              maxPrice: 0,
              productsCount: 0,
              selected: false
            };
            var priceParts = filterObj[i].name.split('-');
            priceObj.minPrice = Number(priceParts[0]);
            priceObj.maxPrice = Number(priceParts[1]);
            priceObj.name = '$' + priceObj.minPrice + ' - ' + '$' + priceObj.maxPrice;
            priceObj.productsCount = filterObj[i].productsCount;
            if(priceObj.maxPrice == maxPrice) {
              priceObj.selected = true;
            } else {
              priceObj.selected = filterObj[i].selected;
            }
            filterArray.push(priceObj);
          };
        } else {
          for(var i = 0, j = filterObj.length; i < j; i++) {
            var saleObj = {
              name: 'All Sale Items',
              value: 0,
              productsCount: 0,
              selected: false
            };
            var saleParts = filterObj[i].name.split('-');
            var value = Number(saleParts[0]);
            saleObj.productsCount = filterObj[i].productsCount;
            saleObj.value = value;
            if(value > 1) {
              saleObj.name = value + '%' + ' off or more ';
            }
            if(saleObj.value == saleDiscount) {
              saleObj.selected = true;
            }
            filterArray.push(saleObj);
          };
        }
        return filterArray;

      };

      var getAlphabets = function(brandsObj) {
        var letterArray = [];
        for(var key in brandsObj) {
          if(brandsObj[key].length > 0) {
            letterArray.push(key);
          }
        };
        return letterArray;
      };

      var getFilterOptionHeight = function() {
        if(scope.deviceObj.iphone4Height) {
          scope.toggleBtngroup.filterOptionHeight = 210;
        } else if (scope.deviceObj.iphone5Height) {
          scope.toggleBtngroup.filterOptionHeight = 290;
        } else if (scope.deviceObj.iphone6Height) {
          scope.toggleBtngroup.filterOptionHeight = 327;
        } else if (scope.deviceObj.iphone6PlusHeight) {
          scope.toggleBtngroup.filterOptionHeight = 430;
        }
      };

      var getFacetsData = function() {
        console.log(scope.filterData.searchKeyword);
        scope.loadingSpinnerEnabled = true;
        ProductSearchService.getAggregation(scope.filterData.searchKeyword, sellerIds,brandIds, categoryIds, minPrice, maxPrice, saleDiscount).then(function(res) {
          console.log(res);
          if (UtilityService.validateResult(res)) {
            scope.toggleBtngroup.filterList = [];
            if(!!res.data.payload.CATEGORIES) {
              categoryFilterList = res.data.payload.CATEGORIES;
            } else {
              categoryFilterList = [];
            }

            if(!!res.data.payload.BRANDS) {
              brandFilterList = res.data.payload.BRANDS;
              scope.alphabet = getAlphabets(res.data.payload.BRANDS);
            } else {
              brandFilterList = {};
            }

            if(!!res.data.payload.SELLERS) {
              storeFilterList = res.data.payload.SELLERS;
            } else {
              storeFilterList = [];
            }

            if(!!res.data.payload.PRICES) {
              priceFilterList = changeFilterObj(res.data.payload.PRICES, 'price');
              console.log(priceFilterList);
            } else {
              priceFilterList = [];
            }

            if(!!res.data.payload.SALES) {
//              var SALES = [{name: "1.0-100.0", productsCount: 306},{name: "20.0-100.0", productsCount: 169},{name: "30.0-100.0", productsCount: 105},{name: "40.0-100.0", productsCount: 46},{name: "50.0-100.0", productsCount: 17}];
              saleFilterList = changeFilterObj(res.data.payload.SALES, 'sale');
              // saleFilterList = changeFilterObj(SALES, 'sale');
              console.log(saleFilterList);
            } else {
              saleFilterList = [];
            }
            scope.loadingSpinnerEnabled = false;
            switchFiltersList();
            filterOptionsSelected = false;
            $ionicScrollDelegate.resize();

          } else {
            console.log('invalid getAggregation response');
          }
        }, function(error) {
          console.log('error');
        });
      };

      scope.changeSortByOptions = function(option) {
        scope.toggleBtngroup.selectedSortby = option.value;
//        scope.filterData.selectedSortby = scope.toggleBtngroup.selectedSortby;
        setFilterParams();
        scope.$emit('changeSortByOption', {source: scope.filterData.searchSource});
        scope.filterData.sortBy = false;
        $ionicScrollDelegate.freezeAllScrolls(false);
      };

      scope.toggleSortby = function() {
        if (scope.filterData.refineBy) {
          scope.filterData.refineBy = false;
          $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = true;
        }

        if (scope.filterData.sortBy) {
          UtilityService.gaTrackAppEvent('Search Filter', 'Toggle', 'Hide sortby on search filter');
          scope.filterData.sortBy = false;
          $ionicScrollDelegate.freezeAllScrolls(false);
        } else {
          UtilityService.gaTrackAppEvent('Search Filter', 'Toggle', 'Show sortby on search filter');
          scope.filterData.sortBy = true;
          $ionicScrollDelegate.freezeAllScrolls(true);
        }
      };
      scope.toggleRefineOption = function() {
        if (scope.filterData.sortBy) {
          scope.filterData.sortBy = false;
        }

        if (scope.filterData.refineBy) {
          UtilityService.gaTrackAppEvent('Search Filter', 'Toggle', 'Hide refineBy on search filter');
          scope.filterData.refineBy = false;
        //  $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(false);
          $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = true;
        } else {
          UtilityService.gaTrackAppEvent('Search Filter', 'Toggle', 'Show refineBy on searchfilter');
          scope.toggleBtngroup.selectedRefineBy = 'store';
          getFilterOptionHeight();
          getFacetsData();
          // $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
          $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = false;
          $timeout(function () {
            scope.filterData.refineBy = true;
          }, 100);
          console.log($ionicScrollDelegate.$getByHandle('mainScroll').getScrollView());
        }
      };

      scope.changeRefineByOptions = function(filterName) {
        console.log('filter clicked');
        scope.toggleBtngroup.selectedRefineBy = filterName.value;
        scope.toggleBtngroup.filterList = [];

        if(filterOptionsSelected) {
          getFacetsData();
        } else {
          switchFiltersList();
        }
      //  $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
        $ionicScrollDelegate.$getByHandle('filterScroll').scrollTop();
        $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = false;
      };

      scope.clearAllRefineOptions = function() {
        console.log('clear all options');
        scope.toggleBtngroup.selectedRefineBy = 'store';
        // scope.toggleBtngroup.filterListName = '';
        scope.filterData.filterParams.sellerIds = [];
        scope.filterData.filterParams.brandIds = [];
        scope.filterData.filterParams.categoryIds = [];
        scope.filterData.filterParams.minPrice = '';
        scope.filterData.filterParams.maxPrice = '';
        scope.filterData.filterParams.sale = '';
        scope.filterData.filterParams.selectedSortby = 'relevancy';
        scope.toggleBtngroup.filterList = [];
        scope.toggleBtngroup.allListItemsSelected = true;
        sellerIds = [];
        brandIds = [];
        categoryIds = [];
        minPrice = '';
        maxPrice = '';
        saleDiscount = '';
//        scope.filterData.refineBy = false;
        getFacetsData();
        scope.$emit('changeFilterOption', {source: scope.filterData.searchSource});
      };

      scope.applyRefineOptions = function() {
        console.log('apply refine options');
        setFilterParams();
        scope.$emit('changeFilterOption', {source: scope.filterData.searchSource});
        scope.filterData.refineBy = false;
        // $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(false);
        $ionicScrollDelegate.$getByHandle('mainScroll').getScrollView().options.scrollingY = true;
      };

      scope.gotoList = function(id) {
        $location.hash(id);
        $ionicScrollDelegate.anchorScroll();
      };

      scope.selectFilterListItem = function(filterListObj) {
        if(scope.toggleBtngroup.selectedRefineBy !== 'price' && scope.toggleBtngroup.selectedRefineBy !== 'sale') {
          filterListObj.selected = !filterListObj.selected;
        }

        switch (scope.toggleBtngroup.selectedRefineBy) {
          case 'category':
            categoryIds = toggleListItemId(filterListObj, categoryIds);
            console.log(categoryIds);
            break;
          case 'store':
            sellerIds = toggleListItemId(filterListObj, sellerIds);
            break;
          case 'brands':
            brandIds = toggleListItemId(filterListObj, brandIds);
            break;
          case 'price':
            for(var i = 0, j = priceFilterList.length; i < j; i++) {
              if(priceFilterList[i].name !== filterListObj.name) {
                priceFilterList[i].selected = false;
              }
            }

            filterListObj.selected = !filterListObj.selected;

            if(filterListObj.selected) {
              minPrice = filterListObj.minPrice;
              maxPrice = filterListObj.maxPrice;
              scope.toggleBtngroup.allListItemsSelected = false;
              filterOptionsSelected = true;
            } else {
              minPrice = '';
              maxPrice = '';
              scope.toggleBtngroup.allListItemsSelected = true;
              filterOptionsSelected = false;
            }

            break;
          case 'sale':
            for(var i = 0, j = saleFilterList.length; i < j; i++) {
              if(saleFilterList[i].value !== filterListObj.value) {
                saleFilterList[i].selected = false;
              }
            }

            filterListObj.selected = !filterListObj.selected;

            if(filterListObj.selected) {
              saleDiscount = filterListObj.value;
              scope.toggleBtngroup.allListItemsSelected = false;
              filterOptionsSelected = true;
            } else {
              saleDiscount = '';
              scope.toggleBtngroup.allListItemsSelected = true;
              filterOptionsSelected = false;
            }
            console.log(filterListObj);
            console.log(saleDiscount);
            break;
          default:
            console.log('invalid refineBy option');
        }

      };

      $rootScope.$on('setDefaultFilterValues', function(event, data) {
        scope.toggleBtngroup.selectedSortby = scope.filterData.filterParams.selectedSortby;
        scope.toggleBtngroup.selectedRefineBy = 'store';
        sellerIds = [];
        brandIds = [];
        categoryIds = [];
        minPrice = '';
        maxPrice = '';
        saleDiscount = '';

//         if(data.action == 'search') {
//           getFacetsData();
//         }
      });

    }
  };
}]);
