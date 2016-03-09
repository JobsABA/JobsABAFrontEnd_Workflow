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
            companyName: $scope.companySearchModel.companyName,
            City: $scope.companySearchModel.City
        }
        $("#abaServiceProviderMainDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetBusinessList", { params: params }).success(function (data) {
            $("#abaServiceProviderMainDiv").unblock();
            if (data.success == 1) {
                $scope.lstBusinessList = data.businessList;
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    $scope.init();

});