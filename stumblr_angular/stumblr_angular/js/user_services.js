var userSrv = angular.module('UserServices', []);

userSrv.service('UserService', ['$http', 'railsServer', 'requestHeaders', function($http, railsServer, requestHeaders) {

    var rails_server_path = railsServer;

    return {
        GetCurrentUser: function() {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/my_current_user.json'
            })
        },
        GetUserDataFromID: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/users/' + user_id + '.json'
            })
        },
        GetUserDataFromUserName: function(username) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/users/profile/' + username
            })
        },
        UpdateUserSettings: function(user_id, user_data) {
            return $http({
                headers: requestHeaders(),
                method: 'PATCH',
                url: rails_server_path + '/users/' + user_id + '.json',
                data: user_data
            })
        },
        FollowUser: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/follow.json?user_id=' + user_id
            })
        },
        UnfollowUser: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/unfollow.json?user_id=' + user_id
            })
        },
        GetUsersToFollow: function() {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/random_users.json'
            })
        },
        GetFollowingCount: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/following/' + user_id + '.json'
            })
        },
        GetFollowersCount: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/followers/' + user_id + '.json'
            })
        },
        IsFollowing: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/users/' + user_id + '/is_following.json'
            })
        }
    }
}]);
