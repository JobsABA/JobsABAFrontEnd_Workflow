app.controller('JobsController', function ($scope, httpService, $http, $routeParams, $rootScope, $filter) {
    $scope.init = function () {
        $scope.initModel();
        $scope.jobId = parseInt($routeParams.JobID);
        if ($scope.jobId != undefined)
            $scope.getJobDetailById($scope.jobId);
        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {
        $scope.jobsModel = {
            JobID: '',
            BusinessID: '',
            Title: '',
            Description: '',
            JobTypeID: '',
            IsActive: true,
            IsDeleted: false,
            StartDate: '',
            EndDate: '',
        }
        $scope.isEditMode = false;
    }


    //for job detail page
    $scope.getJobDetailById = function (id) {
        var params = {
            jobID: id
        }
        $("#jobDetailMain").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Jobapplication/getJobDetailById/", { params: params }).then(function (data) {
            if (data.data.message.StartDate != null) {
                data.data.message.StartDate = $filter('date')(data.data.message.StartDate.substr(6, 13), "MM-dd-yyyy");
            }
            if (data.data.message.EndDate != null) {
                data.data.message.EndDate = $filter('date')(data.data.message.EndDate.substr(6, 13), "MM-dd-yyyy");
            }
            $scope.objJobDetail = data.data.message;
            console.log($scope.objJobDetail)
            $("#jobDetailMain").unblock();
        }, function (data) {
            $("#jobDetailMain").unblock();
        });
    }

    $scope.init();

});