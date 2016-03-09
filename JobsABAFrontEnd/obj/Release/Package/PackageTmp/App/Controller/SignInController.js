app.controller('SignInController', function ($scope, $http, httpService, $location, $rootScope) {

    $scope.init = function () {
        //$scope.username = '';
        //$scope.password = '';
        $scope.prePath = $rootScope.previousPath;
        $scope.prePathParam = $rootScope.previousPathParam;
    }

    $scope.login = function () {
        if ($scope.username.length == 0 || $scope.password.length == 0) {
            toastr.error("Enter username and password.");
            return;
        }
        var logIn = {
            username: $scope.username,
            password: $scope.password
        }
        $http.get($rootScope.API_PATH + "/User/SignIn", { params: logIn }).success(function (data) {
            if (data.success == 1) {
                toastr.success("Login Successfully.");
                httpService.createCookie("uid", data.userId, 365);
                httpService.createCookie("uname", data.Name, 365);
                //httpService.createCookie("uname", data.userName, 365);
                $rootScope.loginUserName = httpService.readCookie("uname");
                $rootScope.userId = parseInt(httpService.readCookie("uid"));
                $rootScope.UserLogin = true;
                $rootScope.getCompanylist(parseInt(data.userId));
                if ($scope.prePath == "/jobsInAba")
                    $location.path('/jobsInAba');
                else if ($scope.prePath == "/viewcompanyprofile/:BusinessId")
                    $location.path('/viewcompanyprofile/' + $scope.prePathParam);
                else if ($scope.prePath == "/home")
                    $location.path('/home');
                else
                    $location.path('/personprofile');
            }
            else {
                toastr.error("username and/or password wrong. try again.");
            }
        })

    }
    $scope.init();
});