app.controller('HomeController', function ($scope, $location, httpService, $rootScope, $http, $filter) {

    $scope.init = function () {
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.autocompleteBusinessName();
        $rootScope.getFullCompanyList();
        $rootScope.getJobsinABAList();

    }

    //$scope.logOut = function () {
    //    httpService.eraseCookie("uid");
    //    httpService.eraseCookie("uname");
    //    $rootScope.loginUserName = httpService.readCookie("uname");
    //    $rootScope.userId = parseInt(httpService.readCookie("uid"));
    //    $location.path('/login');
    //    $rootScope.UserLogin = false;
    //}

    //for display full description for job
    $scope.displayJobFullDetail = function (id) {
        $scope["fullJobDetail_" + id] = true;
    }
    $scope.init();
});