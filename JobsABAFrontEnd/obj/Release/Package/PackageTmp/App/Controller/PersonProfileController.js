app.controller('PersonProfileController', function ($scope, httpService, $rootScope, $http, $location, $route, $filter) {

    $scope.init = function () {
        $scope.initModel();
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.IsPersonProfile == 1;
        $rootScope.IsPersonalProfile = true;
        //GetUserDetailByID();
        $scope.getLoginUserDetail($scope.userId);
        $scope.isEditProfile_Image = true;
        $rootScope.reloadDatePicker();
        $scope.getUserAchievelist();
        $scope.getUserEducationlist();
        $scope.getSkilllist();
        $scope.getLanguageList();
        $scope.getExprience();
        $rootScope.autocompleteBusinessName();
        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {

        $scope.userExprienceModel = {
            UserID: $scope.userId,
            BussinessName: '',
            BussinessID: '',
            JobPosition: '',
            JobLocation: '',
            StartDate: '',
            EndDate: '',
            ExperienceID: ''

        }

        $scope.userAchievementModel = {
            AchievementID: '',
            Name: '',
            Date: '',
            UserID: $scope.userId,
        }

        $scope.userEducationModel = {
            UserID: $scope.userId,
            InstituteName: '',
            Degree: '',
            Description: '',
            StartDate: '',
            EndDate: '',
            EducationID: ''

        }

        $scope.userSkillModel = {
            UserID: $scope.userId,
            Skill1: '',
            SkillID: ''
        }

        $scope.userLanguageModel = {
            UserID: $scope.userId,
            LanguageID: '',
            LanguageName: ''
        }
    }


    //get login user detail
    $scope.getLoginUserDetail = function (id) {
        var params = {
            userid: id
        }

        $("#personalProfilePersonaDetail,#personalProfileSummery").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/UserProfileDetail", { params: params }).success(function (data) {
            $("#personalProfilePersonaDetail,#personalProfileSummery").unblock();
            console.log(data);
            $scope.firstName = data.ObjUser.userInfo.FirstName;
            $scope.middleName = data.ObjUser.userInfo.MiddleName;
            $scope.lastName = data.ObjUser.userInfo.LastName;
            $scope.Summary = data.ObjUser.userInfo.Description;
            $scope.address = data.ObjUser.userAddress.Line1;
            $scope.city = data.ObjUser.userAddress.City;
            $scope.state = data.ObjUser.userAddress.State;
            $scope.zip = data.ObjUser.userAddress.ZipCode;
            $scope.email = data.ObjUser.userEmail;
            $scope.phoneNo = data.ObjUser.userPhone;

            $scope.objImage = data.ObjUser.userImage;
            if ($scope.objImage != null)
                $scope.ImgExt = $scope.objImage.ImageExtension;
            $scope.isEditProfile_Image = false;
        }).error(function () {
            console.log("error");
        })
    }

    //upload user image
    $scope.userImageUpload = function () {
        var formData = new FormData();
        var totalFiles = document.getElementById("uploadimage").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("uploadimage").files[i];

            formData.append("fupload", file);
            formData.append("userID", $scope.userId);
            formData.append("imageTypeId", 3);
        }
        $("#personalProfilePersonaDetail").block({ message: '<img src="Assets/img/loader.gif" />' });
        $.ajax({
            type: "POST",
            url: $rootScope.API_PATH + '/User/Upload',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
                //$route.reload(true);
                $("#personalProfilePersonaDetail").unblock();
                $scope.getLoginUserDetail($scope.userId);
                $scope.isEditProfile_Image = true;
                $scope.randomNumber = Math.random();
            },
            error: function (error) {
                $("#personalProfilePersonaDetail").unblock();
                console.log('error in image upload');
            }
        });
    }

    //update user inforamtion
    $scope.updateUserInfo = function (pname) {
        var userInfo = {
            UserID: $scope.userId,
            FirstName: $scope.firstName,
            MiddleName: $scope.middleName,
            LastName: $scope.lastName,
            UserAddressLine1: $scope.address,
            UserAddressCity: $scope.city,
            UserAddressState: $scope.state,
            UserAddressZipCode: $scope.zip,
            UserEmailAddress: $scope.email,
            UserPhoneNumber: $scope.phoneNo,
        }

        var params = {
            updateType: pname
        }

        $http.post($rootScope.API_PATH + "/User/UpdateProfile", userInfo, { params: params }).success(function (data) {
            toastr.success("profile information updated successfully");
            $scope["isEditProfile_" + pname] = false;
        }).error(function () {
            console.log(data);
        })

    }

    //hide/show edit block for user informaiton update
    $scope.editUserInfo = function (pname) {
        $scope["isEditProfile_" + pname] = true;
    }

    $scope.cancleUpdateUserInfo = function (pname) {
        $scope["isEditProfile_" + pname] = false;
    }

    //update user profile Summery
    $scope.updateProfileSummery = function () {
        var params = {
            UserId: $scope.userId,
            Description: $scope.Summary,
            updateType: 'Description'
        }
        $http.get($rootScope.API_PATH + "/User/UpdateProfile", { params: params }).success(function (data) {
            $scope.isEditSummery = false;
            $scope.initModel();
            toastr.success("Profile Summery Update Successfully");
        }).error(function (data) {
            toastr.error("error in update profile summery");
        })
    }

    //get user exprience
    $scope.getExprience = function () {
        var params = {
            userID: $scope.userId
        }
        $("#personalProfileExprience").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/GetExprienceListByUserId", { params: params }).success(function (data) {
            $("#personalProfileExprience").unblock();
            for (var i = 0; i < data.Expriencelist.length; i++) {
                if (data.Expriencelist[i].StartDate != null) {
                    data.Expriencelist[i].StartDate = $filter('date')(data.Expriencelist[i].StartDate.substr(6, 13), "MM-dd-yyyy");
                }
                if (data.Expriencelist[i].EndDate != null) {
                    data.Expriencelist[i].EndDate = $filter('date')(data.Expriencelist[i].EndDate.substr(6, 13), "MM-dd-yyyy");
                }
            }
            $scope.lstUserExprience = data.Expriencelist;

        }).error(function (data) {
            console.log(data);
        });
    }

    //add user exprience
    $scope.addExprience = function (obj) {
        var name = $(".bussinessList").val();
        var isBusinessFromllist = _.where($rootScope.lstBusiness, { Name: name }).length;
        if (isBusinessFromllist == 0) {
            toastr.error("select company name from list");
            return;
        }
        obj.BusinessID = parseInt($(".bussinessList_ID").val());
        
        $http.post($rootScope.API_PATH + "/User/AddExprienceSet", obj).success(function (data) {
            if (data.success == 1) {
                toastr.success("Exprience added successfully");
                $scope.getExprience();
                $scope.initModel();
                console.log(data);
                $scope.isADDExprience = false;
            }
            else {
                toastr.error("error in add exprience");
            }
        }).error(function (data) {
            toastr.error("error in add exprience");
        })
    }

    //cancel updation
    $scope.cancelUpdateExperience = function (id) {
        $scope["isEditExprience_" + id] = false;
    }

    //edit exprience
    $scope.editExprience = function (obj) {
        $scope.userExprienceModel = obj;
        $scope["isEditExprience_" + obj.ExperienceID] = true;
        $rootScope.autocompleteBusinessName();
        $rootScope.reloadDatePicker();
    }

    //update user exprience set
    $scope.updateExprience = function (obj) {
        var name = $(".bussinessList").val();
        var isBusinessFromllist = _.where($rootScope.lstBusiness, { Name: name }).length;
        if (isBusinessFromllist == 0) {
            toastr.error("select company name from list");
            return;
        }
        obj.BusinessID = parseInt($(".bussinessList_ID").val());
        
        $http.post($rootScope.API_PATH + "/User/UpdateExprience", obj).success(function (data) {
            toastr.success("exprience updated successfully");
            $scope.initModel();
            $scope["isEditExprience_" + obj.ExperienceID] = false;
            console.log(data);
            //$scope.getExprience();
        }).error(function (data) {
            console.log(data);
        })
    }

    //delete user exprience
    $scope.deleteExprience = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/User/DeleteExprience", { params: params }).success(function (data) {
            toastr.success("exprience deleted successfully");
            console.log(data);
            $scope.getExprience();
        }).error(function (data) {
            console.log(data);
        })
    }


    //add user Achievement
    $scope.addAchievement = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/User/AddUserawards", obj).success(function (data) {

            toastr.success("user award added successfully");
            $scope.initModel();
            $scope.getUserAchievelist();
            console.log(data);
            $scope.isAddAchievement = false;
        }).error(function (data) {
            console.log(data);
        })
    }

    //Get User Achievement 
    $scope.getUserAchievelist = function () {
        var params = {
            userID: $scope.userId
        }
        $("#personalProfileAchievement").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/GetAwardlistByUserId", { params: params }).success(function (data) {
            $("#personalProfileAchievement").unblock();
            for (var i = 0; i < data.Achievelist.length; i++) {
                if (data.Achievelist[i].Date != null) {
                    data.Achievelist[i].Date = $filter('date')(data.Achievelist[i].Date.substr(6, 13), "MM-dd-yyyy");
                }
            }

            $scope.objAchievelist = data.Achievelist;
        }).error(function (data) {
            //alert("error");
        });
    }

    //edit Achievement
    $scope.editAchievement = function (obj) {
        $scope["isEditAchievement_" + obj.AchievementID] = true;
        $scope.userAchievementModel = obj;
        $scope.isEditAchievement = true;
        $rootScope.reloadDatePicker();

    }

    //cancel Achievement
    $scope.cancelAchievement = function (id) {
        $scope["isEditAchievement_" + id] = false;
    }

    //update user Achievement set
    $scope.updateAchievement = function (obj) {
        if (obj.Name == undefined || obj.Name.length == 0) {
            toastr.info('Enter Achievement Name.!');
            return;
        }

        $http.post($rootScope.API_PATH + "/User/UpdateAwards", obj).success(function (data) {
            toastr.success("award information update successfully");
            $scope["isEditAchievement_" + obj.AchievementID] = false;
            $scope.getUserAchievelist();

            $scope.initModel();
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }

    //delete user Achievement
    $scope.deleteAchievement = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/User/DeleteAwards", { params: params }).success(function (data) {
            toastr.success("award deleted successfully");
            $scope.getUserAchievelist();
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }


    //add user Education
    $scope.addEducation = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/User/AddEducationSet", obj).success(function (data) {
            toastr.success("education added successfully");
            $scope.getUserEducationlist();
            $scope.initModel();
            console.log(data);
            $scope.isAddEducationList = false;
        }).error(function (data) {
            console.log(data);
        })
    }
    //Get User Education List

    $scope.getUserEducationlist = function () {
        var params = {
            userID: $scope.userId
        }
        $("#personalProfileEducation").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/GetEducationListByUserId", { params: params }).success(function (data) {
            $("#personalProfileEducation").unblock();
            for (var i = 0; i < data.Educationlist.length; i++) {
                if (data.Educationlist[i].StartDate != null) {
                    data.Educationlist[i].StartDate = $filter('date')(data.Educationlist[i].StartDate.substr(6, 13), "MM-dd-yyyy");
                }
                if (data.Educationlist[i].EndDate != null) {
                    data.Educationlist[i].EndDate = $filter('date')(data.Educationlist[i].EndDate.substr(6, 13), "MM-dd-yyyy");
                }
            }
            $scope.Educationlists = data.Educationlist;
        }).error(function (data) {
            //alert("error");
        });
    }

    //edit Education
    $scope.editEducation = function (obj) {
        $scope.userEducationModel = obj;
        $scope["isEditEducation_" + obj.EducationID] = true;
        $rootScope.reloadDatePicker();

    }

    //cancle update education list
    $scope.cancelUpdateEducationList = function (id) {
        $scope["isEditEducation_" + id] = false;
    }

    //update user Education set
    $scope.updateEducation = function (obj) {
        $http.post($rootScope.API_PATH + "/User/UpdateEducation", obj).success(function (data) {
            toastr.success("education detail update successfully");
            $scope.initModel();
            $scope["isEditEducation_" + obj.EducationID] = false;
            console.log(data);
            $scope.getUserEducationlist();
        }).error(function (data) {
            console.log(data);
        })
    }

    //delete user Education
    $scope.deleteEducation = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/User/DeleteEducation", { params: params }).success(function (data) {
            toastr.success("success");
            $scope.getUserEducationlist();
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }


    //Get User Skill
    $scope.getSkilllist = function () {
        var params = {
            userID: $scope.userId
        }
        $("#personalProfileSkill").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/GetSkilllistByUserId", { params: params }).success(function (data) {
            $("#personalProfileSkill").unblock();
            $scope.objSkilllist = data.Skilllist;
        }).error(function (data) {
            //alert("error");
        });
    }

    //add user skill
    $scope.addSkill = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/User/AddSkill", obj).success(function (data) {
            toastr.success("skill added successfully");
            $scope.initModel();
            $scope.getSkilllist();
            console.log(data);
            $scope.isAddSkill = false;
        }).error(function (data) {
            console.log(data);
        })
    }

    //delete skill
    $scope.deleteSkill = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/User/DeleteSkill", { params: params }).success(function (data) {
            toastr.success("skill deleted successfully");
            $scope.getSkilllist();
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }

    //add user LANGUAGE
    $scope.addLanguage = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/User/AddLanguage", obj).success(function (data) {
            toastr.success("add langauge successfully");
            $scope.initModel();
            $scope.getLanguageList();
            console.log(data);
            $scope.isAddLanguage = false;
        }).error(function (data) {
            console.log(data);
        })
    }

    //Get Language List
    $scope.getLanguageList = function () {
        var params = {
            userID: $scope.userId
        }
        $("#personalProfileLanguage").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/User/GetLanguageByUserId", { params: params }).success(function (data) {
            $("#personalProfileLanguage").unblock();
            $scope.objLanguageList = data.Languagelists;
        }).error(function (data) {
            //alert("error");
        });
    }

    //delete language
    $scope.deleteLanguage = function (id) {
        var params = {
            id: id
        }
        $http.get($rootScope.API_PATH + "/User/DeleteLanguage", { params: params }).success(function (data) {
            toastr.success("language delete successfully");
            $scope.getLanguageList();
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }


    $scope.init();
});