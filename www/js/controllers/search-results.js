'use strict';

angular.module('sywStyleXApp')
.controller('SearchResultsCtrl', ['UtilityService', 'ProductDetailService', 'ProductSearchService', '$scope', '$routeParams',function(UtilityService, ProductDetailService, ProductSearchService, $scope, $routeParams) {
  console.log('inside the search results page');
  console.log($routeParams.searchText);

  var sellerIds = [],
    brandIds = [],
    categoryIds = [],
    minPrice = '',
    maxPrice = '',
    saleDiscount = '',
    searchKeyword = $routeParams.searchText,
    pageNumber = 1,
    apiLocker = false;

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
                  value: 'price',
                  options: []
              }

    }
  };

  $scope.searchObj = {
    noMoreData: false,
    emptySearchResults: false,
    products: []
  };

  var searchFilters = {
      sellerId:'' ,
      brandIds: '',
      categoryIds: '',
      minPrice: '',
      maxPrice: '',
      sale: '',
      selectedSortby: 'relevancy'
  }
  // $scope.loadingSpinnerEnabled = false;

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

  var getFacetsData = function() {
    console.log(searchKeyword);
    // scope.loadingSpinnerEnabled = true;
    ProductSearchService.getAggregation(searchKeyword, sellerIds,brandIds, categoryIds, minPrice, maxPrice, saleDiscount).then(function(res) {
      console.log(res);
      if (UtilityService.validateResult(res)) {
        $scope.filterInfo.productCount = res.data.payload.PRODUCTS_COUNT;
        if(!!res.data.payload.CATEGORIES) {
          $scope.filterInfo.refineByOptions.CATEGORY.options = res.data.payload.CATEGORIES;
        } else {
          $scope.filterInfo.refineByOptions.CATEGORY.options = [];
        }

        if(!!res.data.payload.BRANDS) {
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

    ProductSearchService.searchProducts(pageNumber, searchKeyword, searchFilters).then(function(result) {
      if (UtilityService.validateResult(result)) {
        if (result.data.payload.PRODUCTS.length === 0) {
          $scope.searchObj.hasMoreData = false;
          if(pageNumber == 1) {
            $scope.searchObj.emptySearchResults = true;
          }

        } else {
          pageNumber++;
          $scope.hasMoreData = true;
          $scope.emptySearchResults = false;
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
        $scope.hasMoreData = false;
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
