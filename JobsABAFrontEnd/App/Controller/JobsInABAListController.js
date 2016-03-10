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
        //if (($scope.Keywords.length > 0 || $scope.Location.length > 0 || $scope.CompnayName.length > 0) && ($scope.JobSearchModel.companyName.length == 0 && $scope.JobSearchModel.City.length == 0)) {
        //    params = {
        //        searchText: $scope.Keywords,
        //        city: $scope.Location,
        //        userID: $rootScope.userId,
        //        company: $scope.CompnayName,
        //        from: 1,
        //        to: 1000
        //    }
        //    $scope.Keywords = '';
        //    $scope.Location = '';
        //}
        //else {
        //    params = {
        //        searchText: '',
        //        company: $scope.JobSearchModel.companyName,
        //        city: $scope.JobSearchModel.City,
        //        userID: $rootScope.userId,
        //        from: 1,
        //        to: 10
        //    }
        //}
        params = {
            searchText: '',
            from: 1,
            to: 2
        }

        $("#jobsInABAListDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Jobs/GetJobsBySearch", { params: params }).success(function (data) {
            $("#jobsInABAListDiv").unblock();
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
            $rootScope.lstABAJobs = data;
        }).error(function (data) {
            console.log(JSON.stringify(data));
        })
    }


    $scope.init();

});