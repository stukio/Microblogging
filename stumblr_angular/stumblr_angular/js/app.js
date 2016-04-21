var mainApp = angular.module('mainApp', ['ngRoute', 'authModule', 'dashModule', 'profileModule', 'userProfilesModule', 'settingsModule', 'UserServices', 'PostServices', 'angular-loading-bar']);

mainApp.constant('railsServer', 'https://shrouded-thicket-12856.herokuapp.com');

mainApp.factory('requestHeaders', function() {
    return function() {
        return {
            'X-USER-EMAIL': localStorage.email,
            'X-USER-TOKEN': localStorage.token
        };
    }
});

mainApp.config(['$routeProvider', 'railsServer', function($routeProvider, railsServer) {


    var checkLoggedIn = function($location) {
        if (localStorage.token) {
            console.log("The user is logged in.");
        } else {
            $location.path('/login');
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: 'stumblr_angular/partials/login.html',
            controller: 'AuthenticationCtrl'
        })
        .when('/login', {
            templateUrl: 'stumblr_angular/partials/login.html',
            controller: 'AuthenticationCtrl'
        })
        .when('/sign_up', {
            templateUrl: 'stumblr_angular/partials/sign_up.html',
            controller: 'AuthenticationCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'stumblr_angular/partials/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                check: checkLoggedIn
            }
        })
        .when('/profile', {
            templateUrl: 'stumblr_angular/partials/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                check: checkLoggedIn
            }
        })
        .when('/settings', {
            templateUrl: 'stumblr_angular/partials/settings.html',
            controller: 'SettingsCtrl',
            resolve: {
                check: checkLoggedIn
            }
        })
        .when('/forgot_password', {
            templateUrl: 'stumblr_angular/partials/forgot_password.html',
            controller: 'AuthenticationCtrl'
        })
        .when('/reset_password', {
            templateUrl: 'stumblr_angular/partials/reset_password.html',
            controller: 'AuthenticationCtrl'
        })
        .otherwise({
            templateUrl: 'stumblr_angular/partials/user_profiles.html',
            controller: 'UserProfilesCtrl'
        });

}]);