var app = angular.module("adminAPP", ["ngRoute", "angular-loading-bar", 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider', function ($routeProvider, $locationProvider, $rootScope, cfpLoadingBarProvider) {
    //cfpLoadingBarProvider.includeSpinner = true;
    //$rootScope.isAdminLogin = false;

    $routeProvider
       .when('/dashboard', {
           templateUrl: 'Template/Dashboard.html',
           controller: 'DashboardController'
       })
        .when('/login', {
            templateUrl: 'Template/Login.html',
            controller: 'LoginController'
        })
        .when('/userMgmt', {
            templateUrl: 'Template/UserManagement.html',
            controller: 'UserMgmtController'
        })
        .when('/roleMgmt', {
            templateUrl: 'Template/RoleMgmt.html',
            controller: 'RoleMgmtController'
        })
        .when('/companyMgmt', {
            templateUrl: 'Template/CompanyMgmt.html',
            controller: 'CompanyMgmtController'
        })
        .when('/jobMgmt', {
            templateUrl: 'Template/JobMgmt.html',
            controller: 'JobMgmtController'
        })
        .when('/blogMgmt', {
            templateUrl: 'Template/BlogMgmt.html',
            controller: 'BlogMgmtController'
        })
        .when('/changePackagePrice', {
            templateUrl: 'Template/PackageChangePrice.html',
            controller: 'PackageMgmtController'
        })
        .when('/transactionReport', {
            templateUrl: 'Template/PackageTransactionReport.html',
            controller: 'PackageMgmtController'
        })
        .when('/subscriptionList', {
            templateUrl: 'Template/PackageSubscriptionList.html',
            controller: 'PackageMgmtController'
        })


    .otherwise({
        redirectTo: '/dashboard'
    });

}])

.run(function ($rootScope, $location, $q, $routeParams) {
    //$rootScope.API_PATH = 'http://localhost:13177/';
    //$rootScope.API_PATH = 'http://test.jobsinaba.com/';
    $rootScope.API_PATH = 'http://edmx.jobsinaba.com/';



    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        /* this line not working */
        
    });

    $rootScope.$watch(function () {
        return $location.path();
    },
     function (a) {

         //console.log('url has changed: ' + a);
         // show loading div, etc...
     });
});
;

