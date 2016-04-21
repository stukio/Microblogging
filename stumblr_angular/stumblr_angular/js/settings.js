var settingsApp = angular.module('settingsModule', []);

settingsApp.controller('SettingsCtrl', ['$scope', '$location', 'UserService', 'PostService', 'Logout', function ($scope, $location, UserService, PostService, Logout) {

    $scope.go = function (path) {
        $location.path(path);
    }


    /* AUTHENTICATION METHODS */
    checkCurrentUser();
    function checkCurrentUser() {
        UserService.GetCurrentUser().then(function successCallback(response) {
            $scope.current_user = response.data;
        });
    }

    $scope.logout = Logout;


    $scope.updateUserSettings = function (user_username, user_avatar) {
        $scope.updateStatus = 0;
        var user_data = {
            user: {
                username: user_username,
                avatar: user_avatar
            }
        };
        UserService.UpdateUserSettings($scope.current_user.id, user_data).then(function successCallback(response) {
            $scope.updateStatus = 1;
            checkCurrentUser();
        }, function errorCallback(response) {
            $scope.updateStatus = -1;
        });
    }
}]);