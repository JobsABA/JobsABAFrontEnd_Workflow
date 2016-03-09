app.controller('ABAServiceProviderController', function ($scope, httpService, $http, $rootScope) {
    $scope.init = function () {
        $scope.initModel();
        $scope.getFullCompanyListABAService();
        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {
        $scope.companySearchModel = {
            companyName: '',
            City: ''
        }
    }

    //search fuilter for companuy
    $scope.getFullCompanyListABAService = function () {
        var params = {
            searchText: $scope.companySearchModel.companyName,
            //City: $scope.companySearchModel.City
            from: 1,
            to:1000
        }
        $("#abaServiceProviderMainDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        //$http.get($rootScope.API_PATH + "/Company/GetBusinessList", { params: params }).success(function (data) {
        $http.get($rootScope.API_PATH + "/Businesses/GetBusinessesBySearch", { params: params }).success(function (data) {
            $("#abaServiceProviderMainDiv").unblock();
            console.log(data);
            $scope.lstBusinessList = data;
        }).error(function (data) {
            console.log(data);
        });
    }
    $scope.init();

});