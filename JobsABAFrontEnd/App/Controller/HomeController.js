app.controller('HomeController', function ($scope, $location, httpService, $rootScope, $http, $filter) {

    $scope.init = function () {
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.autocompleteBusinessName();
        $rootScope.getFullCompanyList();
        $rootScope.getJobsinABAList();

    }

    //redirect to company detail page
    $scope.goToViewCompanyDetailPage = function (companyID) {
        $location.path('/viewcompanyprofile/' + companyID);
    }

    //for search job
    $scope.searchJob = function () {
        $location.url('/jobsInAba?JobKeyword=' + $scope.searchjobModel.KeyWord + '&Location=' + $scope.searchjobModel.Location + '&CompnayName=' + $scope.searchjobModel.CompnayName);
    }

    //for display full description for job
    $scope.displayJobFullDetail = function (id) {
        $scope["fullJobDetail_" + id] = true;
    }

    $scope.redirectToABAService = function () {
        $location.path('/abaServiceProvide');
    }

    $scope.redirectToJobsInAba = function () {
        $location.path('/jobsInAba');
    }

    $scope.init();
});