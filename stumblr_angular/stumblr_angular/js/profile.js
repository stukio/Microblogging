var profileApp = angular.module('profileModule', ['ngRoute']);

profileApp.controller('ProfileCtrl', ['$scope', '$location', 'UserService', 'PostService', 'Logout', '$sce', function($scope, $location, UserService, PostService, Logout, $sce) {


    $scope.go = function(path) {
        $location.path(path);
    };

    
    /* AUTHENTICATION METHODS */
    UserService.GetCurrentUser().then(function successCallback(response) {
        $scope.current_user = response.data;
        getAllPostsFromUser();
        getFollowingCount();
        getFollowersCount();
    });
    $scope.logout = Logout;
    
    


    /* NUMBER OF FOLLOWERS AND FOLLOWING */
    function getFollowingCount() {
        UserService.GetFollowingCount($scope.current_user.id).then(function successCallback(response) {
            $scope.following_count = response.data.length;
        });
    }
    function getFollowersCount() {
        UserService.GetFollowersCount($scope.current_user.id).then(function successCallback(response) {
            $scope.followers_count = response.data.length;
        });
    }


    $scope.post_comments = {};
    function getAllPostsFromUser() {
        PostService.GetAllPostsFromUser($scope.current_user.id).then(function successCallback(response) {
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


    // MODALS
    $scope.openModal = function(modal_type) {
        $scope.showModal = true;
        $scope.modalTemplate = "stumblr_angular/partials/" + modal_type + "_modal.html";
    }
    $scope.closeModal = function() {
        $scope.showModal = false;
    }
    $scope.keyDown = function(event) {
        if (event.code == 'Escape') {
            $scope.closeModal();
        }
    }



    $scope.createPost = function(id, type, title, content, source, url, tags) {
        resetData();
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
        if (id) {
            PostService.UpdatePostData(id, post).then(function successCallback(response) {
                $scope.showModal = false;
                resetData();
                getAllPostsFromUser();
            });
        } else {
            PostService.CreatePost(post).then(function successCallback(response) {
                $scope.showModal = false;
                resetData();
                getAllPostsFromUser();
            });
        }
    }

    $scope.parseTags = function(unparsedString) {
        var parsedString = unparsedString.split('#').join('');
        return parsedString;
    };
    $scope.editPostData = function(id) {
        PostService.GetPostData(id).then(function successCallback(response) {
            $scope.p = response.data;
            $scope.openModal($scope.p.ptype);
            $scope.ptype = $scope.p.ptype;
            $scope.postID = $scope.p.id;
            $scope.newTitle = $scope.p.title;
            $scope.newContent = $scope.p.content;
            $scope.newURL = $scope.p.url;
            $scope.newSource = $scope.p.psource;
            $scope.newTags = $scope.p.htags;
        });
    }
    $scope.deletePost = function(id) {
        PostService.DeletePost(id).then(function successCallback(response) {
            getAllPostsFromUser();
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
