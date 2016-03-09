app.controller('CompanyProfileController', function ($scope, httpService, $http, $routeParams, $rootScope, $location) {
    $scope.init = function () {
        $scope.initModel();
        $scope.userId = parseInt(httpService.readCookie("uid"));
        $rootScope.reloadDatePicker();
        

        
    }

    $scope.initModel = function () {

        //Company Detail
        $scope.companyDetailModel = {
            BusinessID: '',
            Name: '',
            Abbreviation: '',
            StartDate: '',
            BusinessTypeID: '',
            IsActive: false,
            IsDeleted: false,
            BusinessAddressLine1: '',
            BusinessAddressCity: '',
            BusinessAddressState: '',
            BusinessAddressZipCode: '',
            BusinessEmailAddress: '',
            BusinessPhoneNumber: '',
            Description:'',
        }

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
            Name: ''
        }

        $scope.editCompanyEMPlistModel = {
            id: '',
            Name: ''
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
            Address1: '',
            Address2: '',
            City: '',
            State: '',
            Country: '',
            Employee: '',
            Phone: ''

        }

        $scope.editCompanyLocationlistModel = {
            id: '',
            Address1: '',
            Address2: '',
            City: '',
            State: '',
            Country: '',
            Employee: '',
            Phone: ''
        }
    }

    $scope.getCompanylist = function () {
        var params = {
            userID: $scope.userId
        }
        $http.get($rootScope.API_PATH + "/Company/GetUserWiseBusinessList", { params: params }).success(function (data) {
            console.log(data);
            $scope.lstBusiness = data.businessList;
            $rootScope.menuLstBusiness = data.businessList;
            //$scope.$apply();
        }).error(function (data) {
            //alert(JSON.stringify(data));
        });
    }

    $scope.addCompany = function () {
        var _date = "";
        if ($scope.companyDetailModel.StartDate.length > 0) {
            _date = new Date($scope.companyDetailModel.StartDate);
        }
        var Company = {
            Name: $scope.companyDetailModel.Name,
            Abbreviation: $scope.companyDetailModel.Abbreviation,
            StartDate: _date,
            BusinessTypeID: 3,
            IsActive: true,
            IsDeleted: false,
            UserId: $scope.userId,
            BusinessEmailAddress: $scope.companyDetailModel.BusinessEmailAddress,
            BusinessPhoneNumber: $scope.companyDetailModel.BusinessPhoneNumber,
            BusinessAddressLine1: $scope.companyDetailModel.BusinessAddressLine1,
            BusinessAddressCity: $scope.companyDetailModel.BusinessAddressCity,
            BusinessAddressState: $scope.companyDetailModel.BusinessAddressState,
            BusinessAddressZipCode: $scope.companyDetailModel.BusinessAddressZipCode,
            Description: $scope.companyDetailModel.Description,
        }

        var addCompanyResult = httpService.post(Company, $rootScope.API_PATH + "/Company/CompanyRegister");
        addCompanyResult.then(function (data) {
            if (data.data.success == 1) {
                $scope.initModel();
                $scope.getCompanylist();
                toastr.success("Company Profile Created successfully");
                $location.path('/viewcompanyprofile/' + data.data.message);
            }
            else
                toastr.error("error in create company profile");
        }, function (errorPl) {
           // alert("Error" + errorPl);
        });
    };

    
    $scope.init();
});