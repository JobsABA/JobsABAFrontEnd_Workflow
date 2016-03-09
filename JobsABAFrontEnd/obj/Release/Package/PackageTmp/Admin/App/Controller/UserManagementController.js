app.controller('UserMgmtController', function ($scope, $location, $rootScope, $http, $filter) {

    $scope.init = function () {
        $scope.initModal();
        $scope.getUserList();
    }

    $scope.initModal = function () {
        $scope.userModal = {
            UserID: '',
            UserName: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            IsActive: '',
            DOB: '',
            UserAddressLine1: '',
            UserAddressCity: '',
            UserAddressState: '',
            UserAddressZipCode: '',
            UserEmailAddress: '',
            UserPhoneNumber: '',
            Description: ''
        }

        $scope.searchParam = {
            username: '',
            email: '',
            number: '',
            location: '',
            datefrom: '',
            dateTo: ''
        }
    }

    //get user list
    $scope.getUserList = function () {
        var params = {
            username: $scope.searchParam.username,
            email: $scope.searchParam.email,
            number: $scope.searchParam.number,
            location: $scope.searchParam.location,
            datefrom: $scope.searchParam.datefrom,
            dateTo: $scope.searchParam.dateTo,
        }

        $http.get($rootScope.API_PATH + "/User/GetUserList", { params: params }).success(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].insdt != null) {
                    data[i].insdt = $filter('date')(data[i].insdt.substr(6, 13), "MM-dd-yyyy");
                }
            }
            $scope.lstUser = data;
            $('#tblUser').dataTable().fnDestroy();
            $('#tblUser').dataTable({
                "bProcessing": true,
                "aaData": data,
                "bRetrieve": true,
                "bProcessing": true,
                "bDestroy": true,
                "aoColumns": [
                    { "mData": "UserName" },
                    { "mData": "UserEmailAddress" },
                    { "mData": "UserPhoneNumber" },
                    {"mData":"UserAddressState"},
                    { "mData": "IsActive" },
                    { "mData": "insdt" },
                    {
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "fnRender": function (data) {
                            return "<button style='padding:0px 8px;' class='btn' onclick=\"angular.element(this).scope().viewUserDetail('" + data.aData.UserID + "')\"><i class='icon-eye-open'></i></button>"
                                + " <button style='padding:0px 8px;' class='btn btn-success' onclick=\"angular.element(this).scope().editUserDetail('" + data.aData.UserID + "')\"><i class='icon-pencil'></i></button>"
                                    + " <button style='padding:0px 8px;' class='btn btn-danger' onclick=\"angular.element(this).scope().deleteUserDetail('" + data.aData.UserID + "')\"><i class='icon-trash'></i></button>";
                        }
                    },
                ],
            });


        }).error(function (data) {
            console.log("error in fetch user list data");
        })
    }

    //reset search
    $scope.resetSearch = function () {
        $scope.initModal();
        $scope.getUserList();
    }

    //view user detail
    $scope.viewUserDetail = function (UID) {
        $("#viewUserDetail").modal('show');
        var userID = parseInt(UID);
        var selectedUserDetail = _.where($scope.lstUser, { UserID: userID });
        $scope.$apply(function () {
            $scope.userModal = selectedUserDetail[0];
        });
    }

    //edit user
    $scope.editUserDetail = function (id) {
        $("#addEditUserDetail").modal('show');
        var userID = parseInt(id);
        var selectedUserDetail = _.where($scope.lstUser, { UserID: userID });
        $scope.$apply(function () {
            $scope.userModal = selectedUserDetail[0];
        });
    }

    //update user
    $scope.updateUserInfo = function (obj) {
        var params = {
            updateType: "All"
        }

        $http.post($rootScope.API_PATH + "/User/UpdateProfile", obj, { params: params }).success(function (data) {
            toastr.success("user detail update successfully");
            $("#addEditUserDetail").modal('hide');
            $scope.getUserList();
        }).error(function () {
            toastr.error("error in update user information");
        })

    }

    //delete user
    $scope.deleteUserDetail = function (id) {
        var params = {
            userID: id
        }

        $http.get($rootScope.API_PATH + "/User/DeleteUser", { params: params }).success(function (data) {
            toastr.success("user delete successfully");
            $scope.getUserList();
        }).error(function () {
            toastr.error("error in delete user information");
        })
    }
    $scope.init();
});