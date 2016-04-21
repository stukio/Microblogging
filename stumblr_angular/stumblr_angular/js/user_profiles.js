var profileApp = angular.module('userProfilesModule', []);

profileApp.controller('UserProfilesCtrl', ['$scope', '$location', 'UserService', 'PostService', 'Logout', '$sce', function($scope, $location, UserService, PostService, Logout, $sce) {

    $scope.go = function(path) {
        $location.path(path);
    };

    /* AUTHENTICATION METHODS */
    UserService.GetCurrentUser().then(function successCallback(response) {
        $scope.current_user = response.data;
    });
    $scope.logout = Logout;



    /* SETS CURRENT USER PROFILE */
    var username = $location.path().split("/")[1];
    UserService.GetUserDataFromUserName(username).then(function successCallback(response) {
        $scope.current_user_profile = response.data;
        if ($scope.current_user_profile != null) {
            $scope.userExists = true;
            getAllPostsFromUser();
            getFollowingCount();
            getFollowersCount();
            isFollowing();
        } else {
            $scope.userExists = false;
        }
    });

    function isFollowing() {
        UserService.IsFollowing($scope.current_user_profile.id).then(function successCallback(response) {
            $scope.is_following = response.data;
        });
    }

    /* GET ALL POSTS FROM CURRENT USER PROFILE */
    $scope.post_comments = {};
    function getAllPostsFromUser() {
        PostService.GetAllPostsFromUser($scope.current_user_profile.id).then(function successCallback(response) {
            $scope.posts = response.data;
            for (var i = 0; i < $scope.posts.length; i++) {
                if ($scope.post_comments[$scope.posts[i].id] == undefined) {
                    getComments($scope.posts[i].id);
                }
            }
        });
    }

    function getComments(post_id) {
        PostService.GetPostComments(post_id).then(function successCallback(response) {
            $scope.post_comments[post_id] = response.data;
        });
    }
    $scope.trustURL = function(url) {
        return $sce.trustAsResourceUrl(url);
    }



    $scope.reblogPost = function(id) {
        PostService.GetPostData(id).then(function successCallback(response) {
            var copypost = {
                title: response.data.title,
                content: response.data.content,
                psource: response.data.psource,
                url: response.data.url,
                ptype: response.data.ptype,
                htags: response.data.htags,
                user_id: $scope.current_user.id
            }
            PostService.CreatePost(copypost).then(function successCallback(response) {
                resetData();
                $scope.showModal = false;
                getAllPostsFromUser();
            });
        });
    }

    $scope.openCommentModal = function(id) {
        $scope.postToCommentOn = id;
        $scope.showModal = true;
        $scope.modalTemplate = "stumblr_angular/partials/comment_modal.html";
    }
    $scope.commentOnPost = function(newComment) {
        var post_id = $scope.postToCommentOn;
        var new_comment = {
            comment: {
                content: newComment
            }
        };
        PostService.CommentOnPost(post_id, new_comment).then(function successCallback(response) {
            delete $scope.newComment;
            $scope.showModal = false;
            getComments(post_id);
        });
    }


    /* NUMBER OF FOLLOWERS AND FOLLOWING */
    function getFollowingCount() {
        UserService.GetFollowingCount($scope.current_user_profile.id).then(function successCallback(response) {
            $scope.following_count = response.data.length;
        });
    }

    function getFollowersCount() {
        UserService.GetFollowersCount($scope.current_user_profile.id).then(function successCallback(response) {
            $scope.followers_count = response.data.length;
        });
    }


    /* FOLLOWING AND UNFOLLOWING */
    $scope.followUser = function(id) {
        UserService.FollowUser(id).then(function successCallback(response) {
            isFollowing();
            getFollowersCount();
        });
    }

    $scope.unfollowUser = function(id) {
        UserService.UnfollowUser(id).then(function successCallback(response) {
            isFollowing();
            getFollowersCount();
        });
    }

    
    function resetData() {
        $scope.newTitle = '';
        $scope.newContent = '';
        $scope.newURL = '';
        $scope.newSource = '';
        $scope.newTags = '';
        $scope.newComment = '';
    }

}]);
