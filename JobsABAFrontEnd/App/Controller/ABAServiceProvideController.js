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
    $scope.lstBusinessList = [];
    var initialFrom = 0;
    var initialTo = 4;
    var isComplete = true;
    var dataLoadPerReq = 4;
    var isLastRecord = false;
    $scope.getFullCompanyListABAService = function () {
        console.log(initialFrom + " && " + initialTo);
        if (isComplete && !isLastRecord) {
            isComplete = false;
            var params = {
                //searchText: $scope.companySearchModel.companyName,
                //City: $scope.companySearchModel.City
                from: initialFrom,
                to: initialTo
            }
            $("#abaServiceProviderMainDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
            $http.get($rootScope.API_PATH + "/Businesses/GetBusinessesByPaging", { params: params }).success(function (data) {
                $("#abaServiceProviderMainDiv").unblock();
                $scope.lstBusinessList = $scope.lstBusinessList.concat(data);
                initialFrom += dataLoadPerReq;
                initialTo += dataLoadPerReq;
                isComplete = true;
                if ($scope.lstBusinessList.length >= 29) {
                    isLastRecord = true;
                }
            }).error(function (data) {
                console.log(data);
            });
        }
    }

    $scope.init();
});