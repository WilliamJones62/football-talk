(function() {
    'use strict'

    angular
        .module('app')
        .factory('PostFactory', ['$http', function($http) {
            return {
                getPosts: getPosts,
                getFootballData: getFootballData,
                createPost: createPost,
                deletePost: deletePost,
                editPost: editPost
            }

            function getPosts() {
              return $http.get('/posts/')
                          .then(handleResponse)
                          .catch(handleError)
            }

            function getFootballData(href) {
              return $http.get(href, {
          			headers: {'X-CSRF-Token': undefined, 'x-auth-token': 'd11d358be1d046c5b973b8a36e53a66c'}})
                          .then(handleResponse)
                          .catch(handleError)
            }

            function createPost(post) {
              return $http.post('/posts/', post)
                          .then(handleResponse)
                          .catch(handleError)
            }

            function editPost(post, Id) {
              return $http.put('/posts/' + Id, post)
                          .then(handleResponse)
                          .catch(handleError)
            }

            function deletePost(Id) {
              return $http.delete('/posts/' + Id)
                          .then(handleResponse)
                          .catch(handleError)
            }

            function handleResponse(response) {
              if (response.status === 200) return response.data

            }

            function handleError(error) {
              console.log("There was an error this http request: ", error)
            }
        }])
}())
