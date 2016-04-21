var dashApp = angular.module('dashModule', []);

dashApp.controller('DashboardCtrl', ['$scope', '$location', '$timeout', 'UserService', 'PostService', 'Logout', '$sce', function($scope, $location, $timeout, UserService, PostService, Logout, $sce) {


    $scope.go = function(path) {
        $location.path(path);
    };



    /* AUTHENTICATION METHODS */
    UserService.GetCurrentUser().then(function successCallback(response) {
        $scope.current_user = response.data;
        $scope.getAllPosts();
        getUsersToFollow();
    });
    $scope.logout = Logout;



    $scope.avatars = {};
    $scope.post_comments = {};
    $scope.getAllPosts = function() {
        PostService.GetAllPosts().then(function successCallback(response) {
            $scope.posts = response.data;
            if ($scope.posts != null) {
                for (var i = 0; i < $scope.posts.length; i++) {
                    if ($scope.avatars[$scope.posts[i].user_id] == undefined) {
                        getAvatar($scope.posts[i].user_id);
                    }
                    if ($scope.post_comments[$scope.posts[i].id] == undefined) {
                        getComments($scope.posts[i].id);
                    }
                }
            }
        });
    }

    function getAvatar(user_id) {
        UserService.GetUserDataFromID(user_id).then(function successCallback(response) {
            $scope.avatars[user_id] = response.data.avatar;
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


    /* FOLLOWING AND UNFOLLOWING USERS */
    function getUsersToFollow() {
        UserService.GetUsersToFollow().then(function successCallback(response) {
            $scope.usersToFollow = [];
            for (var i = 0; i < response.data.length; i++) {
                $scope.usersToFollow.push(response.data[i]);
            }
        });
    }

    $scope.followUser = function(id) {
        UserService.FollowUser(id).then(function successCallback(response) {
            $scope.getAllPosts();
            removeUserFromFollowList(id);
            updateFollowList();
        });
    }
    $scope.unfollowUser = function(id) {
        UserService.UnfollowUser(id).then(function successCallback(response) {
            $scope.getAllPosts();
            updateFollowList();
        });
    }

    function removeUserFromFollowList(id) {
        var newArray = [];
        for (var i = 0; i < $scope.usersToFollow.length; i++) {
            if ($scope.usersToFollow[i].id != id) {
                newArray.push($scope.usersToFollow[i]);
            }
        }
        $scope.usersToFollow = newArray;
    }

    function updateFollowList() {
        if ($scope.usersToFollow.length === 0) {
            $timeout(function() {
                getUsersToFollow();
            }, 3000);
        }
    }



    /* CONTROLING MODALS */
    $scope.openModal = function(modal_type) {
        $scope.showModal = true;
        $scope.modalTemplate = "stumblr_angular/partials/" + modal_type + "_modal.html";
    }
    $scope.closeModal = function() {
        resetData();
        $scope.showModal = false;
    }
    $scope.keyDown = function(event) {
        if (event.code == 'Escape') {
            $scope.closeModal();
        }
    }



    $scope.createPost = function(id, type, title, content, source, url, tags) {
        if (tags != undefined && tags != '') {
            tags = $scope.parseTags(tags);
        }
        if (type == 'video') {
            url = url.replace("watch?v=", "v/");
        }
        var post = {
            title: title,
            content: content,
            psource: source,
            url: url,
            ptype: type,
            htags: tags,
            user_id: $scope.current_user.id
        };
        PostService.CreatePost(post).then(function successCallback(response) {
            resetData();
            $scope.showModal = false;
            $scope.getAllPosts();
        });
    }
    $scope.parseTags = function(unparsedString) {
        var parsedString = unparsedString.split('#').join('');
        return parsedString;
    }

    $scope.searchPosts = function(searchTerm) {
        PostService.SearchPosts(searchTerm).then(function successCallback(response) {
            $scope.posts = [];
            for (var i = 0; i < response.data.length; i++) {
                $scope.posts.push(response.data[i]);
            }
        });
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
                $scope.getAllPosts();
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
            delete $scope.postToCommentOn;
            $scope.showModal = false;
            getComments(post_id);
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
