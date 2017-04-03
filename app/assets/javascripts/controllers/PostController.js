(function() {
    'use strict'

    angular
        .module('app')
        .controller('PostController',['PostFactory', '$stateParams', function(PostFactory, $stateParams){
            var selectedId = -1;
            var leagueId = -1;
            var teamId = -1;
            var gameId = -1;
            var vm = this;
            var postId = $stateParams.id;
            vm.post = { id: null, title: '', body: '', league_id: null, team_id: null, game_id: null};
            vm.startEdit = startEdit;
            vm.isInReadMode = isInReadMode;
            vm.isInEditMode = isInEditMode;
            vm.isInLeagueMode = isInLeagueMode;
            vm.isInTeamMode = isInTeamMode;
            vm.isInGameMode = isInGameMode;
            vm.isInPostMode = isInPostMode;
            vm.teams = [];
            vm.games = [];
            var fixtures = [];
            vm.league = '';
            vm.team = '';
            vm.date = '';
            vm.opponent = '';
            var i = 0;
            var href = 'http://api.football-data.org/v1/competitions/';
            var commonHeadersToClear = {};

            vm.getLeagues = function() {
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         vm.leagues = res
                         leagueId = -1;
                         teamId = -1;
                         gameId = -1;
              });
            };

            vm.getTeams = function(league, caption) {
              href = 'http://api.football-data.org/v1/competitions/' + league  + '/teams'
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         vm.teams = res.teams
                }
              );
              leagueId = league;
              vm.league = caption;
            };

            vm.getGames = function(team, link) {
              href = link
              vm.team = team
              teamId = link.substring(38,41)
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         fixtures = res.fixtures;
                         for (i = 0; i < fixtures.length; i++) {
                           if (fixtures[i].homeTeamName == vm.team){
                             vm.games.push({date: fixtures[i].date.substring(0,10), status: fixtures[i].status, home: 'Home', for: fixtures[i].result.goalsHomeTeam, against: fixtures[i].result.goalsAwayTeam, opponent: fixtures[i].awayTeamName, matchday: fixtures[i].matchday});
                           } else {
                             vm.games.push({date: fixtures[i].date.substring(0,10), status: fixtures[i].status, home: 'Away', for: fixtures[i].result.goalsAwayTeam, against: fixtures[i].result.goalsHomeTeam, opponent: fixtures[i].homeTeamName, matchday: fixtures[i].matchday});
                           }
                         }

              });
            };

            vm.getPosts = function(matchday, date, opponent) {
              gameId = matchday
              vm.date = date
              vm.opponent = opponent
              PostFactory.getPosts()
                         .then(function (data){
                         setPosts(data)
              });
            };

            vm.createPost = function (post) {
              PostFactory.createPost(post)
                         .then(function success(response){
                         vm.getPosts();
                         });
            };


            vm.editPost = function (post, Id) {
              postFactory.editPost(post, Id)
                         .then(function success(response){
                         vm.getPosts();
                          });
            };

            vm.deletePost = function (Id) {
              PostFactory.deletePost(Id)
                         .then(function success(response){
                           vm.getPosts();
                          });
            };

            vm.leagues = vm.getLeagues()

            function setPosts(data) {
              vm.posts = data;
              vm.post = { id: null, title: '', body: '' };
              selectedId = -1;
            }

            vm.handleCreate = function(){
              vm.post.league_id = leagueId;
              vm.post.team_id = teamId;
              vm.post.game_id = gameId;
              vm.createPost(vm.post);
            }
            vm.handleEdit = function(id){
              vm.editPost(vm.post, id);
            }
            vm.handleDelete = function(id){
              vm.deletePost(id);
            }

            vm.handleCancel = function(){
              vm.getPosts();
            }

            function isInLeagueMode(){
              if (leagueId == -1 && teamId == -1 && gameId == -1) {
                return true
              } else {
                return false
              }
            }

            function isInTeamMode(){
              if (leagueId != -1 && teamId == -1 && gameId == -1) {
                return true
              } else {
                return false
              }
            }

            function isInGameMode(){
              if (leagueId != -1 && teamId != -1 && gameId == -1) {
                return true
              } else {
                return false
              }
            }

            function isInPostMode(){
              if (leagueId != -1 && teamId != -1 && gameId != -1) {
                return true
              } else {
                return false
              }
            }

            function isInReadMode(id){
              return id != selectedId;
            }

            function isInEditMode(id){
              return id == selectedId;
            }

            function startEdit(id, title, body){
              selectedId = id;
              vm.post.id = id;
              vm.post.title = title;
              vm.post.body = body;
            }

        }])
}())
