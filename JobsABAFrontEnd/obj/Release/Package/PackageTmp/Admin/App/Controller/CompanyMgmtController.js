app.controller('CompanyMgmtController', function ($scope, $location, $rootScope, $http, $filter) {

    $scope.init = function () {
        $scope.initModal();
        $rootScope.reloadDatePicker();
        $scope.getCompanyList();
        $scope.getUserNamelist();

    }

    $scope.initModal = function () {
        $scope.businessModal = {
            Name: '',
            Abbreviation: '',
            BusinessID: '',
            Description: '',
            BusinessEmailAddress: '',
            BusinessPhoneNumber: '',
            ImageExtension: '',
            BusinessAddressLine1: '',
            BusinessAddressCity: '',
            StartDate: '',
            BusinessAddressState: '',
            BusinessAddressZipCode: '',
            IsActive: ''
        }

        $scope.addBusinessModal = {
            Name: '',
            Abbreviation: '',
            BusinessID: '',
            Description: '',
            BusinessEmailAddress: '',
            BusinessPhoneNumber: '',
            ImageExtension: '',
            BusinessAddressLine1: '',
            BusinessAddressCity: '',
            StartDate: '',
            BusinessAddressState: '',
            BusinessAddressZipCode: '',
            IsActive: ''
        }

        $scope.searchParam = {
            compnayName: '',
            email: '',
            number: '',
            location: '',
            datefrom: '',
            dateTo: ''
        }
    }

    //get business list
    $scope.getCompanyList = function () {
        var params = {
            companyName: $scope.searchParam.compnayName,
            email: $scope.searchParam.email,
            number: $scope.searchParam.number,
            City: $scope.searchParam.location,
            datefrom: $scope.searchParam.datefrom,
            dateTo: $scope.searchParam.dateTo,
        }

        $http.get($rootScope.API_PATH + "/Company/GetBusinessList", { params: params }).success(function (data) {
            for (var i = 0; i < data.businessList.length; i++) {
                if (data.businessList[i].StartDate != null) {
                    data.businessList[i].StartDate = $filter('date')(data.businessList[i].StartDate.substr(6, 13), "MM-dd-yyyy");
                }
            }
            $scope.lstbusiness = data.businessList;
            $('#tblCompany').dataTable().fnDestroy();
            $('#tblCompany').dataTable({
                "bProcessing": true,
                "aaData": data.businessList,
                "bRetrieve": true,
                "bProcessing": true,
                "bDestroy": true,
                "aoColumns": [
                    { "mData": "Name" },
                    { "mData": "BusinessEmailAddress" },
                    { "mData": "BusinessPhoneNumber" },
                    { "mData": "BusinessAddressCity" },
                    { "mData": "IsActive" },
                    { "mData": "StartDate" },
                    {
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "fnRender": function (data) {
                            return "<button style='padding:0px 8px;' class='btn' onclick=\"angular.element(this).scope().viewCompanyDetail('" + data.aData.BusinessID + "')\"><i class='icon-eye-open'></i></button>"
                                + " <button style='padding:0px 8px;' class='btn btn-success' onclick=\"angular.element(this).scope().editCompanyDetail('" + data.aData.BusinessID + "')\"><i class='icon-pencil'></i></button>"
                                    + " <button style='padding:0px 8px;' class='btn btn-danger' onclick=\"angular.element(this).scope().deleteCompanyDetail('" + data.aData.BusinessID + "')\"><i class='icon-trash'></i></button>";
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
        $scope.getCompanyList();
    }

    //get user list
    $scope.getUserNamelist = function () {
        $http.get($rootScope.API_PATH + "/User/GetUserList").success(function (data) {
            $scope.lstUser = data;
        }).error(function (data) {
            toastr.error("error in fetch user list")
        })
    }

    //view user detail
    $scope.viewCompanyDetail = function (CID) {
        $("#viewCompanyDetail").modal('show');
        var bID = parseInt(CID);
        var selectedBusinessDetail = _.where($scope.lstbusiness, { BusinessID: bID });
        $scope.$apply(function () {
            $scope.businessModal = selectedBusinessDetail[0];
        });
    }

    //edit user
    $scope.editCompanyDetail = function (CID) {
        $("#editCompanyDetail").modal('show');
        //$rootScope.reloadDatePicker();
        var bID = parseInt(CID);
        var selectedBusinessDetail = _.where($scope.lstbusiness, { BusinessID: bID });
        $scope.$apply(function () {
            $scope.businessModal = selectedBusinessDetail[0];
        });
    }

    //update user
    $scope.updateCompanyInfo = function (obj) {
        var params = {
            updateType: "All"
        }
        $http.post($rootScope.API_PATH + "/Company/UpdateCompany", obj, { params: params }).success(function (data) {
            toastr.success("Company detail update successfully");
            $("#editCompanyDetail").modal('hide');
            $scope.getCompanyList();
        }).error(function () {
            toastr.error("error in update user information");
        })
    }

    //open creare popup
    $scope.openAddCompanyModal = function () {
        $("#addCompanyDetail").modal('show');
    }
    //create user
    $scope.createCompanyInfo = function (obj) {
        obj.BusinessTypeID = 3;
        obj.IsActive = true;

        $http.post($rootScope.API_PATH + "/Company/CompanyRegister", obj).success(function (data) {
            if (data.success == 1) {
                toastr.success("Company created successfully");
                $("#addCompanyDetail").modal('hide');
                $scope.getCompanyList();
            }
            else {
                toastr.error("error in created company");
            }
        }).error(function () {
            toastr.error("error in created company");
        })

    }

    //delete comapny
    $scope.deleteCompanyDetail = function (id) {
        var params = {
            BusinessID: id
        }
        $http.get($rootScope.API_PATH + "/Company/DeleteCompany", { params: params }).success(function (data) {
            toastr.success("company delete successfully");
            $scope.getCompanyList();
        }).error(function () {
            toastr.error("error in delete company information");
        })
    }
    $scope.init();
});