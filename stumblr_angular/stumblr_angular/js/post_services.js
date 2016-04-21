var postSrv = angular.module('PostServices', []);

postSrv.factory('PostService', ['$http', 'railsServer', 'requestHeaders', function($http, railsServer, requestHeaders) {

    var rails_server_path = railsServer;

    return {
        GetAllPosts: function() {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/posts.json'
            })
        },
        GetAllPostsFromUser: function(user_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/posts/search.json?user_id=' + user_id
            })
        },
        SearchPosts: function(search_term) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/posts/search.json?query=' + search_term
            })
        },
        CreatePost: function(post_data) {
            return $http({
                headers: requestHeaders(),
                method: 'POST',
                url: rails_server_path + '/posts.json',
                data: post_data
            })
        },
        GetPostData: function(post_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/posts/' + post_id + '.json'
            })
        },
        UpdatePostData: function(post_id, post_data) {
            return $http({
                headers: requestHeaders(),
                method: 'PATCH',
                url: rails_server_path + '/posts/' + post_id + '.json',
                data: post_data
            })
        },
        DeletePost: function(post_id) {
            return $http({
                headers: requestHeaders(),
                method: 'DELETE',
                url: rails_server_path + '/posts/' + post_id + '.json'
            })
        },
        CommentOnPost: function(post_id, comment_data) {
            return $http({
                headers: requestHeaders(),
                method: 'POST',
                url: rails_server_path + '/posts/' + post_id + '/comments.json',
                data: comment_data
            })
        },
        GetPostComments: function(post_id) {
            return $http({
                headers: requestHeaders(),
                method: 'GET',
                url: rails_server_path + '/posts/' + post_id + '/comments.json'
            })
        }
    }
}]);
