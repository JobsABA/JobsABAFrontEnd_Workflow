app.controller('IndexController', function ($scope, $location, $rootScope, $http, $filter) {

    $scope.init = function () {
    }

    
    //for reload date picker
    $rootScope.reloadDatePicker = function () {
        $(".datepicer").datepicker({
            changeMonth: true,
            changeYear: true
        });
    }
    $scope.init();
});