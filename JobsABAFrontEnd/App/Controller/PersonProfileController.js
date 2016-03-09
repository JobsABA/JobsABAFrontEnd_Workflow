app.controller('PersonProfileController', function ($scope, httpService, $rootScope, $http, $location, $route, $filter) {

    $scope.init = function () {
        $scope.initModel();
        $rootScope.loginUserName = httpService.readCookie("uname");
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.IsPersonProfile == 1;
        $rootScope.IsPersonalProfile = true;
        $scope.isEditProfile_Image = true;
        $rootScope.reloadDatePicker();
        $rootScope.autocompleteBusinessName();
        $scope.randomNumber = Math.random();

        //initially call api
        $scope.getLoginUserDetail($scope.userId);
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
        $("#personalProfileMainDiv").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Users/GetUser/" + id).success(function (data) {
            $("#personalProfileMainDiv").unblock();
            console.log(data);
            //user basic detail
            $scope.firstName = data.FirstName;
            $scope.middleName = data.MiddleName;
            $scope.lastName = data.LastName;
            $scope.Summary = data.Description;
            $scope.address = data.UserAddressLine1;
            $scope.city = data.UserAddressCity;
            $scope.state = data.UserAddressState;
            $scope.zip = data.UserAddressZipCode;
            $scope.email = data.UserEmailAddress;
            $scope.phoneNo = data.UserPhoneNumber;
            $scope.ImgExt = data.UserImageExt;
            $scope.isEditProfile_Image = false;

            //user exprience detail
            for (var i = 0; i < data.ExprienceModal.length; i++) {
                var newObj = new Object();
                if (data.ExprienceModal[i].Business != null) {
                    newObj["BusinessName"] = data.ExprienceModal[i].Business.Name;
                    newObj["City"] = "";
                    if (data.ExprienceModal[i].Business.BusinessAddresses.length > 0) {
                        for (var j = 0; j < data.ExprienceModal[i].Business.BusinessAddresses.length; j++) {
                            if (data.ExprienceModal[i].Business.BusinessAddresses[j].IsPrimary == true) {
                                newObj["City"] = data.ExprienceModal[i].Business.BusinessAddresses[j].Addres.City;
                            }
                        }
                    }
                }
                var newRow = [];
                newRow.push(newObj);
                data.ExprienceModal[i]["businessDetail"] = newRow[0];
            }

            for (var i = 0; i < data.ExprienceModal.length; i++) {
                data.ExprienceModal[i].StartDate = $rootScope.setDateformat(data.ExprienceModal[i].StartDate);
                data.ExprienceModal[i].EndDate = $rootScope.setDateformat(data.ExprienceModal[i].EndDate);
            }
            $scope.lstUserExprience = data.ExprienceModal;

            //user achievement & Award
            for (var i = 0; i < data.AchievementModel.length; i++) {
                data.AchievementModel[i].Date = $rootScope.setDateformat(data.AchievementModel[i].Date);
            }
            $scope.lstAchievelist = data.AchievementModel;

            //user education 
            for (var i = 0; i < data.EducationModel.length; i++) {
                data.EducationModel[i].StartDate = $rootScope.setDateformat(data.EducationModel[i].StartDate);
                data.EducationModel[i].EndDate = $rootScope.setDateformat(data.EducationModel[i].EndDate);
            }
            $scope.Educationlists = data.EducationModel;

            //user skill
            $scope.lstSkillList = data.SkillModel;

            //user language
            $scope.lstLanguageList = data.LanguageModel;
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
            id: $scope.userId
        }

        $http.put($rootScope.API_PATH + "/Users/PutUser/" + $scope.userId, userInfo).success(function (data) {
            toastr.success("profile information updated successfully");
            $scope["isEditProfile_" + pname] = false;
        }).error(function (data) {
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


    //=======================================   user exprience  ========================================//
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

        $http.put($rootScope.API_PATH + "/Experiences/PutExperience/" + obj.ExperienceID, obj).success(function (data) {
            toastr.success("exprience updated successfully");
            $scope.initModel();
            $scope["isEditExprience_" + obj.ExperienceID] = false;
        }).error(function (data) {
            toastr.error("error in update education information. try again");
        })
    }

    //delete user exprience
    $scope.deleteExprience = function (id) {
        var params = {
            id: id
        }
        $http.delete($rootScope.API_PATH + "/Experiences/DeleteExperience", { params: params }).success(function (data) {
            toastr.success("exprience deleted successfully");
            $scope.lstUserExprience = $.grep($scope.lstUserExprience, function (list, index) {
                return list.ExperienceID != data.ExperienceID;
            });
        }).error(function (data) {
            toastr.error("error in delete exprience. try again");
        })
    }

    //=======================================   user Achievement  ========================================//
    //add user Achievement
    $scope.addAchievement = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/Achievements/PostAchievement", obj).success(function (data) {
            toastr.success("user award added successfully");
            $scope.initModel();
            $scope.isAddAchievement = false;
            data.Date = $rootScope.setDateformat(data.Date);
            $scope.lstAchievelist.push(data);
        }).error(function (data) {
            toastr.error("error in add achievement. try again.");
        })
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
        $http.put($rootScope.API_PATH + "/Achievements/PutAchievement/" + obj.AchievementID, obj).success(function (data) {
            toastr.success("award information update successfully");
            $scope["isEditAchievement_" + obj.AchievementID] = false;
            $scope.initModel();
        }).error(function (data) {
            toastr.error("error in update achievement. try again.");
        })
    }

    //delete user Achievement
    $scope.deleteAchievement = function (id) {
        var params = {
            id: id
        }
        $http.delete($rootScope.API_PATH + "/Achievements/DeleteAchievement", { params: params }).success(function (data) {
            toastr.success("award deleted successfully");
            $scope.lstAchievelist = $.grep($scope.lstAchievelist, function (list, index) {
                return list.AchievementID != data.AchievementID
            });
        }).error(function (data) {
            toastr.error("error in delete achievement. try again");
        })
    }

    //=======================================   user Education  ========================================//
    //add user Education
    $scope.addEducation = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/Educations/PostEducation", obj).success(function (data) {
            toastr.success("education added successfully");
            $scope.initModel();
            $scope.isAddEducationList = false;

            data.StartDate = $rootScope.setDateformat(data.StartDate);
            data.EndDate = $rootScope.setDateformat(data.EndDate);
            $scope.Educationlists.push(data);
        }).error(function (data) {
            toastr.error("error in add education. try again");
        })
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
        $http.put($rootScope.API_PATH + "/Educations/PutEducation/" + obj.EducationID, obj).success(function (data) {
            toastr.success("education detail update successfully");
            $scope.initModel();
            $scope["isEditEducation_" + obj.EducationID] = false;
        }).error(function (data) {
            toastr.error("error in update education detail. try again.")
        })
    }

    //delete user Education
    $scope.deleteEducation = function (id) {
        var params = {
            id: id
        }
        $http.delete($rootScope.API_PATH + "/Educations/DeleteEducation/", { params: params }).success(function (data) {
            toastr.success("success");
            $scope.Educationlists = $.grep($scope.Educationlists, function (list, index) {
                return list.EducationID != data.EducationID
            });
        }).error(function (data) {
            toastr.error("error in delete education detail. try again");
        })
    }

    //=======================================   user skill  ========================================//
    //add user skill
    $scope.addSkill = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/Skills/PostSkill", obj).success(function (data) {
            toastr.success("skill added successfully");
            $scope.initModel();
            $scope.isAddSkill = false;
            $scope.lstSkillList.push(data);
        }).error(function (data) {
            toastr.error("error in add skill. try again");
        })
    }

    //delete skill
    $scope.deleteSkill = function (id) {
        var params = {
            id: id
        }
        $http.delete($rootScope.API_PATH + "/Skills/DeleteSkill", { params: params }).success(function (data) {
            toastr.success("skill deleted successfully");
            $scope.lstSkillList = $.grep($scope.lstSkillList, function (list, index) {
                return list.SkillID != data.SkillID
            });
        }).error(function (data) {
            toastr.error("error in delete skill. try again");
        })
    }

    //=======================================   user LANGUAGE  ========================================//
    //add user LANGUAGE
    $scope.addLanguage = function (obj) {
        obj.UserID = $scope.userId;
        $http.post($rootScope.API_PATH + "/Languages/PostLanguage", obj).success(function (data) {
            toastr.success("add langauge successfully");
            $scope.initModel();
            $scope.lstLanguageList.push(data);
            $scope.isAddLanguage = false;
        }).error(function (data) {
            toastr.error("error in add langauge. try again");
        })
    }

    //delete language
    $scope.deleteLanguage = function (id) {
        $http.delete($rootScope.API_PATH + "/Languages/DeleteLanguage/" + id).success(function (data) {
            toastr.success("language delete successfully");
            $scope.lstLanguageList = $.grep($scope.lstLanguageList, function (list, index) {
                return list.LanguageID != data.LanguageID
            });
        }).error(function (data) {
            toastr.error("error in delete langauge. try again");
        })
    }


    $scope.init();
});