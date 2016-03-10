app.controller('ContactUsController', function ($scope, $location, httpService, $rootScope, $http, $filter) {

    $scope.init = function () {
        //$scope.initModel();
    }

    $scope.initModel = function(){
        $scope.ContactUsModel = {
            UserType: '',
            Category: '',
            FirstName: '',
            LastName: '',
            EmailAddress: '',
            Phone: '',
            Title: '',
            Company: '',
            Message: '',
        }
    }

    $scope.contactUs = function () {

    }

    $scope.init();
});