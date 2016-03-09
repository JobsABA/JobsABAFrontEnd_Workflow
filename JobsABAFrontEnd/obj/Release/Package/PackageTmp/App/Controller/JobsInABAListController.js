app.controller('JobsInABAListController', function ($scope, httpService, $http, $rootScope, $filter, $routeParams) {
    $scope.init = function () {
        $scope.initModel();

        if ($routeParams.JobKeyword)
            $scope.Keywords = $routeParams.JobKeyword;
        else
            $scope.Keywords = '';

        if ($routeParams.Location)
            $scope.Location = $routeParams.Location;
        else
            $scope.Location = '';

        if ($routeParams.CompnayName)
            $scope.CompnayName = $routeParams.CompnayName;
        else
            $scope.CompnayName = '';

        $scope.getJobList();
        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {
        $scope.JobSearchModel = {
            companyName: '',
            City: ''
        }

    }

    //for display full description for job
    $scope.displayJobFullDetail = function (id) {
        $scope["fullJobDetail_" + id] = true;
    }

    //get job list
    $scope.getJobList = function () {
        var params = {};
        if (($scope.Keywords.length > 0 || $scope.Location.length > 0 || $scope.CompnayName.length > 0) && ($scope.JobSearchModel.companyName.length == 0 && $scope.JobSearchModel.City.length == 0)) {
            params = {
                jobKeyword: $scope.Keywords,
                city: $scope.Location,
                userID: $rootScope.userId,
                company: $scope.CompnayName
            }
            $scope.Keywords = '';
            $scope.Location = '';
        }
        else {
            params = {
                company: $scope.JobSearchModel.companyName,
                city: $scope.JobSearchModel.City,
                userID: $rootScope.userId
            }
        }
        
        $("#jobsInABAListDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Jobapplication/GetJobsinABAList", { params: params }).success(function (data) {
            $("#jobsInABAListDiv").unblock();
            if (data.JobsList != null) {
                for (var i = 0; i < data.JobsList.length; i++) {
                    if (data.JobsList[i].StartDate != null) {
                        data.JobsList[i].StartDate = $filter('date')(data.JobsList[i].StartDate.substr(6, 13), "MM-dd-yyyy");
                    }
                    if (data.JobsList[i].EndDate != null) {
                        data.JobsList[i].EndDate = $filter('date')(data.JobsList[i].EndDate.substr(6, 13), "MM-dd-yyyy");
                    }
                }
            }
            $rootScope.lstABAJobs = data.JobsList;
        }).error(function (data) {
            console.log(JSON.stringify(data));
        })
    }


    $scope.init();

});