app.controller('DashboardController', function ($scope, $location, $rootScope, $http, $filter) {

    $scope.init = function () {
        $scope.getDashboardData();
    }


    //get dashboard data
    $scope.getDashboardData = function () {
        $http.get($rootScope.API_PATH + "/User/getDashboardData").success(function (data) {
            $scope.TotalUser = data.TotalUser;
            $scope.TotalCompany = data.TotalCompany;
            $scope.TotalJob = data.TotalJob;
            $scope.TotalJobApplication = data.TotalJobApplication;
        }).error(function (data) {
            toastr.error("error in fetch data");
        });
    }


    $scope.init();
});