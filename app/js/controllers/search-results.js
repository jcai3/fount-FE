'use strict';

angular.module('sywStyleXApp')
.controller('SearchResultsCtrl', ['UtilityService', 'ProductDetailService', 'ProductSearchService', '$scope', '$stateParams',function(UtilityService, ProductDetailService, ProductSearchService, $scope, $stateParams) {

  var apiLocker = false;

  var searchFilters = {
    sellerIds: [],
    brandIds: [],
    categoryIds: [],
    minPrice: '',
    maxPrice: '',
    sale: '',
    selectedSortby: 'relevancy'
  }

  $scope.searchKeyword = $stateParams.keyword;

  $scope.filterInfo = {
    allListItemsSelected : true,
    productCount: '',
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
    ],
    selectedSortby: 'relevancy',
    refineByOptions: {
      "STORE": {
        value: 'store',
        options: []
      },
      "CATEGORY": {
        value: 'category',
        options: []
      },
      "BRANDS": {
        value: 'brands',
        options: []
      },
      "PRICE": {
        value: 'price',
        options: []
      },
      "SALE": {
        value: 'sale',
        options: []
      }
    }
  };

  $scope.searchObj = {
    noMoreData: false,
    pageNumber: 1,
    emptySearchResults: false,
    products: []
  };

  $scope.loadMore = function() {
    if ($scope.searchObj.noMoreData || $scope.searchObj.pageNumber > 5) {
      return;
    }
    searchProducts();
  };

  $scope.loadNextPage = function() {
    if ($scope.searchObj.noMoreData) {
      return;
    }
    searchProducts();
  };

  $scope.changeSortByOptions = function() {
    // localStorageService.set('filteredProductsHasMoreData', 1);
    $scope.searchObj.pageNumber = 1,
    apiLocker = false;
    $scope.searchObj.noMoreData = false;
    $scope.searchObj.products = [];
    searchFilters.selectedSortby = $scope.filterInfo.selectedSortby;
    searchProducts();
  };

  $scope.toggleRefineOptions = function(filter, option) {
    if (filter == 'STORE') {
      var index = searchFilters.sellerIds.indexOf(option.id);
      if (index != -1) {
        option.selected = false;
        searchFilters.sellerIds.splice(index, 1);
      } else {
        option.selected = true;
        searchFilters.sellerIds.push(option.id);
      }
    } else if (filter == 'CATEGORY') {
      var index = searchFilters.categoryIds.indexOf(option.id);
      if (index != -1) {
        option.selected = false;
        searchFilters.categoryIds.splice(index, 1);
      } else {
        option.selected = true;
        searchFilters.categoryIds.push(option.id);
      }
    } else if (filter == 'BRANDS') {
      var index = searchFilters.brandIds.indexOf(option.id);
      if (index != -1) {
        option.selected = false;
        searchFilters.brandIds.splice(index, 1);
      } else {
        option.selected = true;
        searchFilters.brandIds.push(option.id);
      }
    } else if (filter == 'PRICE') {
      if (option.selected == true) {
        option.selected = false;
        searchFilters.minPrice = '';
        searchFilters.maxPrice = '';
      } else {
        var options = $scope.filterInfo.refineByOptions.PRICE.options;
        for (var i=0,j=options.length; i<j; i++) {
          options[i].selected = false;
        }
        option.selected = true;
        searchFilters.minPrice = option.minPrice;
        searchFilters.maxPrice = option.maxPrice;
      }
    } else if (filter == 'SALE') {
      if (option.selected == true) {
        option.selected = false;
        searchFilters.sale = '';
      } else {
        var options = $scope.filterInfo.refineByOptions.SALE.options;
        for (var i=0,j=options.length; i<j; i++) {
          options[i].selected = false;
        }
        option.selected = true;
        searchFilters.sale = option.value;
      }
    }
    getFacetsData();
    $scope.changeSortByOptions();
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
        if(priceObj.maxPrice == searchFilters.maxPrice) {
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
        if(saleObj.value == searchFilters.sale) {
          saleObj.selected = true;
        }
        filterArray.push(saleObj);
      };
    }
    return filterArray;

  };

  var getFacetsData = function() {
    // console.log(searchKeyword);
    // scope.loadingSpinnerEnabled = true;
    ProductSearchService.getAggregation($scope.searchKeyword, searchFilters.sellerIds, searchFilters.brandIds, searchFilters.categoryIds, searchFilters.minPrice, searchFilters.maxPrice, searchFilters.sale).then(function(res) {
      console.log(res);
      if (UtilityService.validateResult(res)) {
        $scope.filterInfo.productCount = res.data.payload.PRODUCTS_COUNT;
        if(!!res.data.payload.CATEGORIES) {
          $scope.filterInfo.refineByOptions.CATEGORY.options = res.data.payload.CATEGORIES;
        } else {
          $scope.filterInfo.refineByOptions.CATEGORY.options = [];
        }

        if(!!res.data.payload.BRANDS) {
          $scope.filterInfo.refineByOptions.BRANDS.options = [];
          var brandsObj = res.data.payload.BRANDS;
          for(var key in brandsObj) {
            for(var i = 0, j = brandsObj[key].length; i < j; i++) {
              $scope.filterInfo.refineByOptions.BRANDS.options.push(brandsObj[key][i]);
            }
          }
        } else {
          $scope.filterInfo.refineByOptions.BRANDS.options = [];
        }

        if(!!res.data.payload.SELLERS) {
          $scope.filterInfo.refineByOptions.STORE.options = res.data.payload.SELLERS;
        } else {
          $scope.filterInfo.refineByOptions.STORE.options = [];
        }

        if(!!res.data.payload.PRICES) {
          $scope.filterInfo.refineByOptions.PRICE.options = changeFilterObj(res.data.payload.PRICES, 'price');
        } else {
          $scope.filterInfo.refineByOptions.PRICE.options = [];
        }

        if(!!res.data.payload.SALES) {
          $scope.filterInfo.refineByOptions.SALE.options = changeFilterObj(res.data.payload.SALES, 'sale');
        } else {
          $scope.filterInfo.refineByOptions.SALE.options = [];
        }
      //  switchFiltersList();
      //  filterOptionsSelected = false;

        console.log($scope.filterInfo.refineByOptions);
      } else {
        console.log('invalid getAggregation response');
      }
    }, function(error) {
      console.log('error');
    });
  };

  var searchProducts = function() {
    if (apiLocker) {
      return;
    }
    apiLocker = true;

    ProductSearchService.searchProducts($scope.searchObj.pageNumber, $scope.searchKeyword, searchFilters).then(function(result) {
      if (UtilityService.validateResult(result)) {
        $scope.filterInfo.productCount = result.data.payload.COUNT;
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.searchObj.noMoreData = true;
          if($scope.searchObj.pageNumber == 1) {
            $scope.searchObj.emptySearchResults = true;
          }

        } else {
          if (result.data.payload.PRODUCTS.length === 20) {
            $scope.searchObj.pageNumber++;
            $scope.searchObj.noMoreData = false;
          } else {
            $scope.searchObj.noMoreData = true;
          }
          $scope.searchObj.emptySearchResults = false;
          var products = result.data.payload.PRODUCTS;
          for (var i = 0, j = products.length; i < j; i++) {
            if(!!products[i].twoTapData) {
              var sites = [];
              for (var key in products[i].twoTapData.sites) {
                sites.push(products[i].twoTapData.sites[key]);
              }

              var addToCart = [];
              if (!!sites[0]) {
                for (var key in sites[0].add_to_cart) {
                  addToCart.push(sites[0].add_to_cart[key]);
                }
              }

              if(!!addToCart[0]) {
                products[i].price =  Number(addToCart[0].price.substr(1));
              }
            }
          }
          $scope.searchObj.products.push.apply($scope.searchObj.products, products);
        }
      } else {
        $scope.searchObj.noMoreData = true;
        console.log('error');
      }
      apiLocker = false;
    }, function(error) {
      console.log('error');
    });
  };

  getFacetsData();
  searchProducts();

}]);
