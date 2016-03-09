app.controller('JobMgmtController', function ($scope, $location, $rootScope, $http, $filter) {

    $scope.init = function () {
        $scope.initModal();
        $scope.getBusinessList();
        $scope.getJobList();
        $rootScope.reloadDatePicker();
    }

    $scope.initModal = function () {
        $scope.searchJobModal = {
            BusinessID: "",
            Title: "",
            City: "",
            StartDate: "",
            EndDate:""
        }
        $scope.jobModal = {
            Title: '',
            Description: '',
            IsActive: '',
            IsDeleted: '',
            StartDate: '',
            EndDate: '',
            BusinessID: '',
            insdt:'',
        }
        $scope.createJobModal = {
            Title: '',
            Description: '',
            IsActive: '',
            IsDeleted: '',
            StartDate: '',
            EndDate: '',
            BusinessID: '',
            insdt: '',
        }
    }

    //ger business list
    $scope.getBusinessList = function () {
        $http.get($rootScope.API_PATH + "/Company/GetBusinessList").success(function (data) {
            if (data.success == 1) {
                $scope.lstBusiness = data.businessList;
            }
            else {
                toastr.error("error in fetch business list");
            }
        }).error(function (data) {
            toastr.error("error in fetch business list");
        })
    }
    //reset search
    $scope.resetSearch = function () {
        $scope.initModal();
        $scope.getJobList();
    }
    //ger job list
    $scope.getJobList = function () {
        var params = {
            city: $scope.searchJobModal.City,
            companyID: $scope.searchJobModal.BusinessID,
            jobKeyword: $scope.searchJobModal.Title,
            pStartDate: $scope.searchJobModal.StartDate,
            pEndDate: $scope.searchJobModal.EndDate,
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/GetJobsinABAListForAdmin", { params: params }).success(function (data) {
            if (data.success == 1) {
                $scope.lstJobs = data.JobsList;

                for (var i = 0; i < data.JobsList.length; i++) {
                    if (data.JobsList[i].StartDate != null) {
                        data.JobsList[i].StartDate = $filter('date')(data.JobsList[i].StartDate.substr(6, 13), "MM/dd/yyyy");
                    }
                    if (data.JobsList[i].EndDate != null) {
                        data.JobsList[i].EndDate = $filter('date')(data.JobsList[i].EndDate.substr(6, 13), "MM/dd/yyyy");
                    }
                    if (data.JobsList[i].insdt != null) {
                        data.JobsList[i].insdt = $filter('date')(data.JobsList[i].insdt.substr(6, 13), "MM/dd/yyyy");
                    }
                }
                $('#tblJob').dataTable().fnDestroy();
                $('#tblJob').dataTable({
                    "bProcessing": true,
                    "aaData": data.JobsList,
                    "bRetrieve": true,
                    "bProcessing": true,
                    "bDestroy": true,
                    "aoColumns": [
                        { "mData": "BusinessName" },
                        { "mData": "Title" },
                        { "mData": "StartDate" },
                        { "mData": "EndDate" },
                        { "mData": "City" },
                        { "mData": "insdt" },
                        { "mData": "IsActive" },
                        {
                            "mData": null,
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (data) {
                                return "<button style='padding:0px 8px;' class='btn' onclick=\"angular.element(this).scope().viewJobDetail('" + data.aData.JobID + "')\"><i class='icon-eye-open'></i></button>"
                                    + " <button style='padding:0px 8px;' class='btn btn-success' onclick=\"angular.element(this).scope().editJobDetail('" + data.aData.JobID + "')\"><i class='icon-pencil'></i></button>"
                                        + " <button style='padding:0px 8px;' class='btn btn-danger' onclick=\"angular.element(this).scope().deleteJobDetail('" + data.aData.JobID + "')\"><i class='icon-trash'></i></button>";
                            }
                        },
                        {
                            "mData": null,
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (data) {
                                return "<button style='padding:0px 8px;' class='btn' onclick=\"angular.element(this).scope().viewJobAllicationDetail('" + data.aData.JobID + "')\"><i class='icon-th-list'></i></button>";
                            }
                        },
                    ],
                });
            }
            else {
                toastr.error("error in fetch job list");
            }
        }).error(function (data) {
            toastr.error("error in fetch job list");
        })
    }

    //view job detail
    $scope.viewJobDetail = function (JID) {
        $("#viewJobDetail").modal('show');
        var jobID = parseInt(JID);
        var selectedJobDetail = _.where($scope.lstJobs, { JobID: jobID });
        $scope.$apply(function () {
            $scope.jobModal = selectedJobDetail[0];
        });
    }

    //edit user
    $scope.editJobDetail = function (JID) {
        $("#editJobDetail").modal('show');
        //$rootScope.reloadDatePicker();
        var jobID = parseInt(JID);
        var selectedJobDetail = _.where($scope.lstJobs, { JobID: jobID });
        $scope.$apply(function () {
            $scope.jobModal = selectedJobDetail[0];
        });
    }

    //update user
    $scope.updateJobInfo = function (obj) {
        $http.post($rootScope.API_PATH + "/Jobapplication/UpdateJob", obj).success(function (data) {
            toastr.success("Job detail update successfully");
            $("#editJobDetail").modal('hide');
            $scope.getJobList();
        }).error(function () {
            toastr.error("error in update job information");
        })
    }

    //open creare popup
    $scope.openAddJobModal = function () {
        $("#addJobDetail").modal('show');
    }
    //create user
    $scope.createJobInfo = function (obj) {
        obj.BusinessTypeID = 4;
        obj.IsActive = true;

        $http.post($rootScope.API_PATH + "/Jobapplication/CreateJob", obj).success(function (data) {
            if (data.success == 1) {
                toastr.success("job created successfully");
                $("#addJobDetail").modal('hide');
                $scope.getJobList();
            }
            else {
                toastr.error("error in create job");
            }
        }).error(function () {
            toastr.error("error in created company");
        })

    }

    //delete comapny
    $scope.deleteJobDetail = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/DeleteJob", { params: params }).success(function (data) {
            toastr.success("job delete successfully");
            $scope.getJobList();
        }).error(function () {
            toastr.error("error in delete company information");
        })
    }

    //view JobApplication Detail
    $scope.viewJobAllicationDetail = function (jobID) {
        var params = {
            JobID:jobID
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/GetJobApplicationList", { params: params }).success(function (data) {
            if (data.success == 1) {
                for (var i = 0; i < data.applicationList.length; i++) {
                    if (data.applicationList[i].ApplicationDate != null) {
                        data.applicationList[i].ApplicationDate = $filter('date')(data.applicationList[i].ApplicationDate.substr(6, 13), "MM/dd/yyyy");
                    }
                }
                $scope.lstJobApplication = data.applicationList;
                $("#viewJobApplicationDetail").modal('show');
            }
            else {
                toastr.error("error in fetch job application list");
            }
        }).error(function (data) {
            toastr.error("error in fetch job application list");
        })
    }
    $scope.init();
});