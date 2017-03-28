(function () {
  'use strict';

  angular
      .module('app')
      .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: 'home.html',
          })

          .state('posts', {
            url: '/posts',
            templateUrl: 'post.html',
            controller: 'PostController as vm'
          })

        $urlRouterProvider.otherwise('/')
      })
}());
