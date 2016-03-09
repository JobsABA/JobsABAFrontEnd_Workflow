app.controller('BlogListController', function ($scope, $location, httpService, $rootScope, $http, $filter) {
    $scope.init = function () {
        
    }

    $scope.goToDetail = function () {
        $location.path('/blogDetail');
    }

    $scope.init();

});