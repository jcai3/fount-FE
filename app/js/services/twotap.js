'use strict';

angular.module('sywStyleXApp')
.service('TwoTapService', ['$http', 'localStorageService', 'ENV', function($http, localStorageService, ENV) {

  var API_ENDPOINT = 'https://api.twotap.com/v1.0/';
  var PUBLIC_TOKEN = '0a6a8f0335de330f440c878de167f2';
  var PRIVATE_TOKEN = '86961ef9f4df7ec1f0950e921d7d801b9a952ee36a3c84ae7a';
  var USER_TOKEN = '';
  var TEST_MODE = 'fake_confirm';

  var serviceCall = function(httpMethod, path, inputParams) {
    // var nocache = '&nocache=' + Math.random();
    // var url = API_ENDPOINT + path + '?public_token=' + PUBLIC_TOKEN +  ((httpMethod === 'GET' || httpMethod === 'DELETE') ? nocache : '');
    var url = API_ENDPOINT + path + '?public_token=' + PUBLIC_TOKEN;
    if (path == 'purchase/confirm') {
      url = API_ENDPOINT + path;
    }

    inputParams = inputParams || {};

    if (ENV.apiEnvname != 'prod') {
      inputParams.test_mode = TEST_MODE;
    }

    if (httpMethod === 'POST') {
      return $http({
        method: httpMethod,
        cache: false,
        url: url,
        data: inputParams,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        if (data.error) {
          console.log(data.error);
        }
        return data;
      }).error(function(data, status, headers, config) {
        return data;
      });
    } else {
      return $http({
        method: httpMethod,
        cache: false,
        url: url,
        params: inputParams,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        if (data.error) {
          console.log(data.error);
        }
        return data;
      }).error(function(data, status, headers, config) {
        return data;
      });
    }

  };

  this.cart = function(inputParams) {
    return serviceCall('POST', 'cart', inputParams);
  };

  this.cartStatus = function(inputParams) {
    return serviceCall('GET', 'cart/status', inputParams);
  };

  this.cartEstimates = function(inputParams) {
    return serviceCall('POST', 'cart/estimates', inputParams);
  };

  this.purchase = function(inputParams) {
    return serviceCall('POST', 'purchase', inputParams);
  };

  this.purchaseStatus = function(inputParams) {
    return serviceCall('GET', 'purchase/status', inputParams);
  };

  this.purchaseConfirm = function(inputParams) {
    inputParams.private_token = PRIVATE_TOKEN;
    return serviceCall('POST', 'purchase/confirm', inputParams);
  };

  this.fieldsInputValidate = function(inputParams) {
    return serviceCall('POST', 'fields_input_validate', inputParams);
  };

  // this.cart = function(options) {
  //   options = options || {};
  //   options.test_mode = 'fake_confirm';
  //
  //   var promise = $http({
  //     method: 'POST',
  //     url: API_ENDPOINT + 'cart?public_token=' + PUBLIC_TOKEN,
  //     data: options,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).error(function(data, status) {
  //     console.log('twotap cart api: '  + status);
  //   });
  //   return promise;
  // };
  //
  // this.cartStatus = function(options) {
  //   options = options || {};
  //   options.test_mode = 'fake_confirm';
  //
  //   var promise = $http.get(API_ENDPOINT + 'cart/status?public_token=' + PUBLIC_TOKEN, {
  //     params: options
  //   }).error(function(data, status) {
  //     console.log('twotap cart status api: '  + status);
  //   });
  //   return promise;
  // }


}]);
