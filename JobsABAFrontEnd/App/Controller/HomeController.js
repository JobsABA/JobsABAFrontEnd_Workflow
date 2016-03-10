app.controller('HomeController', function ($scope, $location, httpService, $rootScope, $http, $filter) {

    $scope.init = function () {
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.autocompleteBusinessName();
        $scope.getCompanyList();
        $scope.getJobsinABAList();
        $scope.randomNumber = Math.random();
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

    //get full company list
    $scope.getCompanyList = function () {
        var params = {
            from: 0,
            to: 8
        }
        $("#homePageBusinessListDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Businesses/GetBusinessesByPaging", { params: params }).success(function (data) {
            $("#homePageBusinessListDiv").unblock();
            $scope.lstBusiness = data;
        }).error(function (data) {
            toastr.error("error in fetch company list. try again");
        })
    }

    //for get job list
    $scope.getJobsinABAList = function () {
        var params = {
            from: 0,
            to: 8
        }
        $("#homePageJobDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Jobs/GetJobByPaging", { params: params }).success(function (data) {
            $("#homePageJobDiv").unblock();
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    var newobj = new Object();
                    var newRow = [];
                    if (data[i].Business != null && data[i].Business != "" && data[i].Business.BusinessImages != undefined && data[i].Business.BusinessImages.length > 0) {
                        for (var j = 0; j < data[i].Business.BusinessImages.length; j++) {
                            if (data[i].Business.BusinessImages[j].IsPrimary == true) {
                                newobj["ImageExtension"] = data[i].Business.BusinessImages[j].Image.ImageExtension;
                            }
                        }
                        newRow.push(newobj);
                    }
                    data[i]["businessImage"] = newRow[0];
                }
            }
            $scope.lstJobs = data;
        }).error(function (data) {
            console.log(JSON.stringify(data));
        })
    }
    $scope.init();
});