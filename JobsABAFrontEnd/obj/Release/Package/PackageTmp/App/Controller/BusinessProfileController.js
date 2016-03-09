app.controller('BusinessDetailController', function ($scope, httpService, $rootScope, $http, $routeParams, $filter, $route) {

    $scope.init = function () {
        $scope.initModel();
        $scope.initJobModel();
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $scope.BusinessId = parseInt($routeParams.BusinessId);

        $scope.getCompanySpecialist();
        $scope.getCompanyEmployeelist();
        $scope.getCompanyAchievelist();
        $scope.getCompanyLocationlist();
        $scope.getJobList();
        if ($scope.userId)
            $scope.checkBusinessUserOwner();
        else
            $scope.getBussinessDetail($scope.BusinessId);
        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {
        //specialist
        $scope.addCompanySpecialistModel = {
            Name: ''
        }

        $scope.editCompanySpecialistModel = {
            id: '',
            Name: ''
        }
        //employee
        $scope.addCompanyEMPlistModel = {
            UserID: '',
            UserName: '',
            FirstName: '',
            LastName: '',
            MiddleName: '',
            State: '',
            EmailAddress: '',
            PhoneNumber: ''
        }

        $scope.editCompanyEMPlistModel = {
            UserID: '',
            UserName: '',
            FirstName: '',
            LastName: '',
            MiddleName: '',
            State: '',
            EmailAddress: '',
            PhoneNumber :''
        }

        //company achievement
        $scope.addCompanyAchievelistModel = {
            Name: '',
            Date: '',
        }

        $scope.editCompanyAchievelistModel = {
            id: '',
            Name: '',
            Date: '',
            ImgUrl: ''
        }

        //company location
        $scope.addCompanyLocationlistModel = {
            Line1: '',
            Line2: '',
            City: '',
            State: '',
            ZipCode: '',
            Employee: '',
            Phone: ''

        }

        $scope.editCompanyLocationlistModel = {
            AddressID: '',
            Line1: '',
            Line2: '',
            City: '',
            State: '',
            ZipCode: '',
            Employee: '',
            Phone: ''
        }

    }

    $scope.initJobModel = function () {
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
    }
    $scope.isUserBusinessOwner = false;
    $scope.checkBusinessUserOwner = function () {
        var params = {
            bussinessID: $scope.BusinessId,
            userID: $scope.userId
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/CheckUserBusinessOwner", { params: params }).success(function (data) {
            if (data.success == 1)
                $scope.isUserBusinessOwner = data.message;
            $scope.getBussinessDetail($scope.BusinessId);
            $rootScope.reloadDatePicker();
        }).error(function (data) {
            console.log("error in fetch detail");
        });
    }

    $scope.getBussinessDetail = function (bussinessID) {
        var params = {
            BussinessId: bussinessID
        }
        $("#companyProfileInfoDiv,#companyProfileDescDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetBussinessDetail", { params: params }).success(function (data) {
            $("#companyProfileInfoDiv,#companyProfileDescDiv").unblock();
            $scope.bussinessDetail = data.bussinessDetail;
            if ($scope.bussinessDetail.BussinessInfo.StartDate != null) {
                $scope.bussinessDetail.BussinessInfo.StartDate = $filter('date')($scope.bussinessDetail.BussinessInfo.StartDate.substr(6, 13), "MM-dd-yyyy");
            }
            $scope.objImage = data.bussinessDetail.businessImage;
            if ($scope.objImage != null)
                $scope.ImgExt = $scope.objImage.ImageExtension;
            $scope.isEditProfile_Image = false;
        }).error(function (data) {
            //alert(JSON.stringify(data));
        })
    }

    //chnage job isActive 
    $scope.changeJobActive = function (jobID) {
        var params = {
            jobID: jobID
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/ChangeJobDisplay", { params: params }).success(function (data) {
            if (data.success == 1) {

            }
            else {
                toastr.error("error in job activation toggle");
            }
        }).error(function (data) {

        })
    }

    //company logo upload
    $scope.companyImageUpload = function () {
        var formData = new FormData();
        var totalFiles = document.getElementById("uploadimage").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("uploadimage").files[i];

            formData.append("fupload", file);
            formData.append("businessID", $scope.BusinessId);
            formData.append("imageTypeId", 3);
        }
        //$http.post($rootScope.API_PATH + "/Company/Upload", formData).success(function (data) {
        //    $scope.cuurTime = new Date().getTime();
        //    $route.reload(true);
        //}).error(function (data) {
        //    console.log('error in image upload');
        //})
        $("#companyProfileInfoDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $.ajax({
            type: "POST",
            url: $rootScope.API_PATH + '/Company/Upload',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
                //$location.path('/personprofile');
                //$route.reload(true);
                $("#companyProfileInfoDiv").unblock();
                $scope.getBussinessDetail($scope.BusinessId);
                $scope.isEditProfile_Image = true;
                $scope.randomNumber = Math.random();
            },
            error: function (error) {
                $("#companyProfileInfoDiv").unblock();
                console.log('error in image upload');
            }
        });
    }

    //edit/update company detail
    $scope.updateCompanyDetail = function (obj, updateType) {
        var params = {
            updateType: updateType
        }
        var Company = {
            Name: obj.Name,
            BusinessEmailAddress: obj.Address,
            BusinessPhoneNumber: obj.Number,
            BusinessAddressLine1: obj.Line1,
            BusinessAddressCity: obj.City,
            BusinessAddressState: obj.State,
            BusinessAddressZipCode: obj.ZipCode,
            Description: obj.Description,
            BusinessID: $scope.BusinessId
        }
        $http.post($rootScope.API_PATH + "/Company/UpdateCompany", Company, { params: params }).success(function (data) {
            toastr.success("company profile info update successfully");
            if (updateType == "Address") {
                $scope.isEditAddress = false;
                $scope.isEditCity = false;
                $scope.isEditState = false;
                $scope.isEditZipCode = false;
            }
            else if (updateType == "BussinessEmail")
                $scope.isEditEmail = false;
            else if (updateType == "Number")
                $scope.isEditNumber = false;
            else if (updateType == "Name")
                $scope.isEditCompanyName = false;
            else if (updateType == "Description")
                $scope.isEditCompanyDesription = false;

        }).error(function (data) {

        });
    }

    $scope.createJob = function (obj) {
        if ($scope.jobsModel.Title == undefined || $scope.jobsModel.Title.length == 0) {
            toastr.error('Enter job title');
            return;
        }
        obj.BusinessID = $scope.BusinessId;
        obj.JobTypeID = 4;
        $http.post($rootScope.API_PATH + "/Jobapplication/CreateJob", obj).success(function (data) {
            if (data.success == 1) {

                $scope.isEditSummery = false;
                $scope.initJobModel();
                $scope.getJobList();
                toastr.success("job created successfully");
            }
            else {
                toastr.error('Error in create job');
                console.log(data.message);
            }

        }).error(function (data) {
            console.log(data);
        })

    }

    $scope.updateJob = function (obj) {
        if (obj.Title == undefined || obj.Title.length == 0) {
            toastr.error('Enter job title');
            return;
        }

        $http.post($rootScope.API_PATH + "/Jobapplication/UpdateJob", obj).success(function (data) {
            if (data.success == 1) {
                toastr.success("job updated successfully");
                $scope["isEditJobList_" + obj.JobID] = false;
            }
            else {
                toastr.error('Error in create job');
                console.log(data.message);
            }

        }).error(function (data) {
            console.log(data);
        })

    }

    $scope.deleteJob = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/DeleteJob", { params: params }).success(function (data) {
            if (data.success == 1) {
                $scope.getJobList();
                toastr.success("Job deleted sucessfully");

            }
            else {
                toastr.error('Error in create job');
                console.log(data.message);
            }

        }).error(function (data) {
            console.log(data);
        })
    }

    $scope.getJobList = function () {
        var params = {
            bussinessID: $scope.BusinessId
        }
        $("#companyProfileJobDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Jobapplication/GetJobsinABAListByBussinessId", { params: params }).success(function (data) {
            $("#companyProfileJobDiv").unblock();
            for (var i = 0; i < data.JobsList.length; i++) {
                if (data.JobsList[i].insdt != null) {
                    data.JobsList[i].insdt = $filter('date')(data.JobsList[i].insdt.substr(6, 13), "MM-dd-yyyy");
                }
                if (data.JobsList[i].StartDate != null) {
                    data.JobsList[i].StartDate = $filter('date')(data.JobsList[i].StartDate.substr(6, 13), "MM-dd-yyyy");
                }
                if (data.JobsList[i].EndDate != null) {
                    data.JobsList[i].EndDate = $filter('date')(data.JobsList[i].EndDate.substr(6, 13), "MM-dd-yyyy");
                }
            }
            if (!$scope.isUserBusinessOwner) {
                data.JobsList = _.where(data.JobsList, { IsActive: true });
            }
            $scope.lstJob = data.JobsList;
            $rootScope.reloadDatePicker();
        }).error(function (data) {
            //alert("error");
        });
    }

    $scope.editJobDetail = function (id) {
        $scope["isEditJobList_" + id] = true;
        $rootScope.reloadDatePicker();
    }
    $scope.cancelJobDetailEdit = function (id) {
        $scope["isEditJobList_" + id] = false;
    }

    $scope.viewApplivation = function (id) {
        if ($scope["isJobApplication_" + id] == true) {
            $scope["isJobApplication_" + id] = false;
        }
        else {

            var params = {
                JobID: id
            }
            $http.get($rootScope.API_PATH + "/Jobapplication/GetJobApplicationList", { params: params }).success(function (data) {
                for (var i = 0; i < data.applicationList.length; i++) {
                    if (data.applicationList[i].ApplicationDate != null) {
                        data.applicationList[i].ApplicationDate = $filter('date')(data.applicationList[i].ApplicationDate.substr(6, 13), "MM-dd-yyyy");
                    }
                }

                $scope.lstJobApplication = data.applicationList;

            }).error(function (data) {
                console.log(data);
            });
            $scope["isJobApplication_" + id] = true;
        }
    }
    $scope.viewJobDetail = function (id) {

        if ($scope["isJobDetail_" + id] == true)
            $scope["isJobDetail_" + id] = false;
        else
            $scope["isJobDetail_" + id] = true;

    }

    //*********** start edit specialist **************//
    $scope.isEditSpecialist = false;
    $scope.getCompanySpecialist = function () {
        var params = {
            BusinessID: $scope.BusinessId
        }
        $("#companyProfileSpecialistDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetServicesListByBussinessId", { params: params }).success(function (data) {
            $("#companyProfileSpecialistDiv").unblock();
            $scope.objSpecialist = data.ServicesList;
        }).error(function (data) {
            console.log(data);
        });

    }

    $scope.addCompanySpecialist = function (obj) {
        if (obj.Name == null || obj.Name == "") {
            toastr.error("enter specialist name");
            return;
        }
        var params = {
            Name: obj.Name,
            BusinessID: $scope.BusinessId
        }
        $http.get($rootScope.API_PATH + "/Company/CreateServices", { params: params }).success(function (data) {
            console.log(data);
            $scope.getCompanySpecialist();
            toastr.success("Company Specialist added successfully");
            $scope.IsAddSpecialist = false;
            $scope.initModel();
        }).error(function (data) {
            //alert("error");
        });
    }

    $scope.deleteSpecialist = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/Company/DeleteServices", { params: params }).success(function (data) {
            if (data.success == 1) {
                $scope.getCompanySpecialist();
                toastr.success("Company specialist deleted successfully");
            }
            else {
                toastr.error('Error in Delete job');
                console.log(data.message);
            }

        }).error(function (data) {
            console.log(data);
        })
    }

    //*************end specialist  ****************//


    //*********** start edit employee **************//
    $scope.isEditEmplist = false;

    $scope.getCompanyEmployeelist = function () {
        var params = {
            BusinessID: $scope.BusinessId
        }
        $("#companyProfileEmployeeDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetEmployeeListByBussinessId", { params: params }).success(function (data) {
            $("#companyProfileEmployeeDiv").unblock();
            $scope.objEmplist = data.employeeList;
        }).error(function (data) {

        })

    }

    $scope.addCompanyEmplist = function (obj) {
        console.log(obj);
        var business = {
            FirstName: obj.FirstName,
            MiddleName: obj.MiddleName,
            LastName: obj.LastName,
            IsActive: true,
            insdt: new Date(),
            UserAddressState: obj.State,
            UserEmailAddress: obj.EmailAddress,
            UserPhoneNumber: obj.PhoneNumber,
        }
        var params = {
            BusinessID: $scope.BusinessId
        }
        $http.post($rootScope.API_PATH + "/Company/EmployeeRegister", business, { params: params }).success(function (data) {
            if (data.success == 1) {
                $scope.getCompanyEmployeelist();
                $scope.isAddEmployee = false;
                $scope.initModel();
                toastr.success("employee add successfully");
            }
            else {
                toastr.error("error in addd employee list");
            }
            
        }).error(function (data) {
            //alert("error");
        });

    }

    $scope.editEMPlist = function (obj) {
        $scope["isEditEmplist_" + obj.UserID] = true;
        $scope.editCompanyEMPlistModel = obj;
        $scope.editCompanyEMPlistModel.UserID = obj.UserID;
    }

    $scope.updateEMPProfile = function (obj) {
        
        var user = {
            FirstName: obj.FirstName,
            MiddleName: obj.MiddleName,
            LastName: obj.LastName,
            IsActive: true,
            insdt: new Date(),
            UserAddressState: obj.State,
            UserEmailAddress: obj.EmailAddress,
            UserPhoneNumber: obj.PhoneNumber,
            UserID:obj.UserID
        }
        $http.post($rootScope.API_PATH + "/Company/UpdateEmployeeProfile", user).success(function (data) {
            console.log(data);
            if (data.success == 1) {
                $scope.getCompanySpecialist();
                toastr.success("employee profile update successully");
                $scope["isEditEmplist_" + obj.UserID] = false;
                $scope.initModel();
            }
            else {
                toastr.error("error in update employee profile");
            }
        }).error(function (data) {
            //alert("error");
        });
        
    }

    $scope.cancelEditEMPlist = function (obj) {
        $scope["isEditEmplist_" + obj.UserID] = false;
    }

    $scope.deleteEMPlist = function (id) {
        var params = {
            UserID: id
        }
        $http.get($rootScope.API_PATH + "/Company/DeleteEmployee", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success(data.message);
                $scope.getCompanyEmployeelist();
            }
            else {
                toastr.error("error in delete employee record.")
            }
        }).error(function (data) {
            //alert("error");
        });
        
    }

    //*************end employee  ****************//


    //*********** start company achievement **************//
    $scope.getCompanyAchievelist = function () {

        var params = {
            BusinessID: $scope.BusinessId
        }
        $("#companyProfileAchieveDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetAwardlistByBussinessId", { params: params }).success(function (data) {
            $("#companyProfileAchieveDiv").unblock();
            $scope.objAchievelist = data.Achievelist;
        }).error(function (data) {
            //alert("error");
        });

    }

    $scope.addCompanyAchievelist = function (obj) {
        console.log(obj);
        if (obj.Name == null || obj.Name == "") {
            toastr.error("enter achievement name");
            return;
        }
        var params = {
            Name: obj.Name,
            BusinessID: $scope.BusinessId
        }
        $http.get($rootScope.API_PATH + "/Company/AddBusinessawards", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success("Award added successfully");
                $scope.getCompanyAchievelist();
                $scope.initModel();
                $scope.isAddAwards = false;
            }
            else {
                toastr.error("error in add award");
            }
            
        }).error(function (data) {
            //alert("error");
        });
    }
    

    $scope.editAchievelist = function (obj) {
        $scope["isEditAchievelist_" + obj.AchievementID] = true;
        $scope.editCompanyAchievelistModel.Name = obj.Name;
        $scope.editCompanyAchievelistModel.AchievementID = obj.AchievementID;
        $scope.editCompanyAchievelistModel.Date = obj.Date;
        //$rootScope.reloadDatePicker();
    }

    $scope.saveEditAchievelist = function (obj) {
        $scope["isEditAchievelist_" + obj.AchievementID] = false;
        $("#achivementform").hide();
        var params = {
            achievementID: obj.AchievementID,
            Name:obj.Name
        }
        $http.get($rootScope.API_PATH + "/Company/UpdateBusinessawards", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success("achievemrnt record update successfully");
                $scope.getCompanyAchievelist();
                $scope.initModel();
            }
            else {
                toastr.error("error in update achiecement record");
            }
        }).error(function (data) {
            console.log(data);
        })
    }

    $scope.cancelEditAchievelist = function (obj) {
        $scope["isEditAchievelist_" + obj.AchievementID] = false;
    }

    $scope.deleteAchievelist = function (id) {
        var params = {
            achievementID: id
        }
        $http.get($rootScope.API_PATH + "/Company/DeleteBusinessawards", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success("achievemrnt record delete successfully");
                $scope.getCompanyAchievelist();
            }
            else {
                toastr.error("error in delete achiecement record");
            }
        }).error(function (data) {
            console.log(data);
        });
    }

    //*************end achievement  ****************//


    //*********** start company location **************//
    $scope.getCompanyLocationlist = function () {
        var params = {
            businessID: $scope.BusinessId
        }
        $("#companyProfileLocationDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetBusinessLocation", { params: params }).success(function (data) {
            $("#companyProfileLocationDiv").unblock();
            $scope.objLocationlist = data.record;
        }).error(function (data) {
            //alert("error");
        });
    }

    $scope.addCompanyLocationlist = function (obj) {
        console.log(obj);
        var params = {
            BusinessID: $scope.BusinessId,
            BusinessAddressLine1: obj.Line1,
            BusinessAddressLine2: obj.Line2,
            BusinessAddressCity: obj.City,
            BusinessAddressState: obj.State,
            BusinessAddressZipCode: obj.ZipCode
        }
        
        $http.get($rootScope.API_PATH + "/Company/AddBusinessLocation", { params: params }).success(function (data) {
            if (data.success == 1) {
                $scope.getCompanyLocationlist();
                toastr.success("location add successfully");
                $scope.initModel();
                $scope.isAddLoaction = false;
            }
            else {
                toastr.error("error in add location");
            }
            
        }).error(function (data) {
            //alert("error");
        });
    }

    $scope.editLocationlist = function (obj) {
        $scope["isEditLocationlist_" + obj.AddressID] = true;
        $scope.editCompanyLocationlistModel = obj;
    }

    $scope.saveEditLocationlist = function (obj) {
        $scope["isEditLocationlist_" + obj.AddressID] = false;
        var objBusiness = {
            BusinessAddressID: obj.BusinessAddressID,
            BusinessID: $scope.BusinessId,
            BusinessAddressLine1: obj.Line1,
            BusinessAddressLine2: obj.Line2,
            BusinessAddressCity: obj.City,
            BusinessAddressState: obj.State,
            BusinessAddressZipCode: obj.ZipCode
        }
        
        $http.post($rootScope.API_PATH + "/Company/UpdateBusinessLocation", objBusiness).success(function (data) {
            if (data.success == 1) {
                $scope.getCompanyLocationlist();
                toastr.success("location update successfully");
                $scope.initModel();
            }
            else {
                toastr.error("error in add location");
            }
            
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.cancelEditLocationlist = function (obj) {
        $scope["isEditLocationlist_" + obj.AddressID] = false;
    }

    $scope.deleteLocationlist = function (id) {
        var params = {
            addressID: id
        }
        $http.get($rootScope.API_PATH + "/Company/DeleteBusinessLocation", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success("location record delete successfully");
                $scope.getCompanyLocationlist();
            }
            else {
                toastr.error("error in delete location record");
            }
        }).error(function (data) {
            console.log(data);
        });
    }

    //*************end location  ****************//

    //for display full description for job
    $scope.displayJobFullDetail = function (id) {
        $scope["fullJobDetail_" + id] = true;
    }
    $scope.init();
});