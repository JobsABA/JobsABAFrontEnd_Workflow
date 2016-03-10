app.controller('IndexController', function ($scope, $location, httpService, $rootScope, $http, $filter) {

    $scope.init = function () {
        $scope.initModel();
        $rootScope.loginUserName = httpService.readCookie("uname");
        $rootScope.userId = parseInt(httpService.readCookie("uid"));
        //if ($rootScope.userId) {
        //    $rootScope.getCompanylist($rootScope.userId);
        //}

        $scope.randomNumber = Math.random();
    }

    $scope.initModel = function () {
        $scope.searchjobModel = {
            KeyWord: '',
            Location: '',
            CompnayName: ''
        }
    }

    //for logout
    $scope.logOut = function () {
        httpService.eraseCookie("uid");
        httpService.eraseCookie("uname");
        $rootScope.loginUserName = httpService.readCookie("uname");
        $rootScope.userId = parseInt(httpService.readCookie("uid"));
        $location.path('/login');
        $rootScope.UserLogin = false;
    }

    //get company list by user for menubar
    $rootScope.getCompanylist = function (uid) {
        var params = {
            userID: uid
        }
        $("#menubarBuisnessList").block({ message: '<img src="Assets/img/loader.gif" />' });
        $http.get($rootScope.API_PATH + "/Company/GetUserWiseBusinessList", { params: params }).success(function (data) {
            $("#menubarBuisnessList").unblock();
            //console.log(data);
            $rootScope.menuLstBusiness = data.businessList;
        }).error(function (data) {
            console.log(JSON.stringify(data));
        });
    }

    //for reload date picker
    $rootScope.reloadDatePicker = function () {
        $(".datepicer").datepicker({
            changeMonth: true,
            changeYear: true
        });
    }

    //apply for job
    $rootScope.applyJob = function (jobID) {
        var params = {
            JobID: jobID,
            UserID: $rootScope.userId
        }
        $http.get($rootScope.API_PATH + "/Jobapplication/ApplyJob", { params: params }).success(function (data) {
            if (data.success == 1) {
                toastr.success("successfully apply for this job");
            }
            else if (data.duplicate == 1) {
                toastr.info("you are already applied for this job");
            }
            else
                toastr.error("error in job apply");

        }).error(function (data) {
            console.log(JSON.stringify(data));
        })

    }

    //for mouse hover div display/hide
    $rootScope.onmousehover = function (name, id) {
        $scope[name + id] = true;
    }
    $rootScope.onmouseleave = function (name, id) {
        $scope[name + id] = false;
    }

    //autocomplete
    $rootScope.autocompleteBusinessName = function () {
        $('.bussinessList').autocomplete({
            source: function (request, response) {
                $.getJSON($rootScope.API_PATH + "/Company/GetBusinessList?term=" + request.term, function (data) {
                    //console.log(data);
                    response($.map(data.businessList, function (value, key) {
                        return {
                            label: value.Name,
                            value: value.Name,
                            key: value.BusinessID,
                        };
                    }));
                });
            },
            select: function (event, ui) {
                $(".bussinessList_ID").val(ui.item.key);
                $(".bussinessList").val(ui.item.value);
            },
            minLength: 1,
            delay: 100
        });
    }

    //for change dateformat
    $rootScope.setDateformat = function (_date) {
        var date = new Date(_date);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    $scope.init();
});