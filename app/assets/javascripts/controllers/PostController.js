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
            var leagues = [];
            var games = [];
            var teams = [];
            vm.games = [];
            var i = 0;
            var href = 'http://api.football-data.org/v1/competitions/';
            var competitionId = 0;
            var commonHeadersToClear = {};

            vm.getLeagues = function() {
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         vm.leagues = res
              });
            };

            vm.getTeams = function(league) {
              href = 'http://api.football-data.org/v1/competitions/' + competitionId  + '/teams'
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         vm.leagues = res
                         leagueId = league
              });
            };

            vm.getGames = function(link) {
              href = link
              PostFactory.getFootballData(href)
                         .then(function success(res){
                         vm.teams = res
                         teamId = link.substring(38,3)
              });
            };

            vm.getPosts = function(matchday) {
              PostFactory.getPosts()
                         .then(function (data){
                         setPosts(data)
                         gameId = matchday
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
            vm.posts = vm.getPosts()

            function setPosts(data) {
              vm.posts = data;
              vm.post = { id: null, title: '', body: '' };
              selectedId = -1;
              leagueId = -1;
              teamId = -1;
              gameId = -1;
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
              return leagueId == -1 && teamId == -1 && gameId == -1;
            }

            function isInTeamMode(){
              return leagueId != -1 && teamId == -1 && gameId == -1;
            }

            function isInGameMode(){
              return leagueId != -1 && teamId != -1 && gameId == -1;
            }

            function isInPostMode(){
              return leagueId != -1 && teamId != -1 && gameId != -1;
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

            function loadFixtures(){
              postFactory.getFootballData(href)
                .then(function success(res){
                  cs = res;
                  for (i = 0; i < competitions.length; i++) {
                    if (competitions[i].league == vm.team.league) {
                      competitionId = competitions[i].id;
                      competitionFound = true;
                      i = competitions.length ++;
                    };
                  }
                  if (competitionFound){
                    href = 'http://api.football-data.org/v1/competitions/' + competitionId  + '/teams'
                    postFactory.getFootballData(href)
                      .then(function success(res){
                        teams = res.teams;
                        for (i = 0; i < teams.length; i++) {
                          if (teams[i].name == vm.team.name) {
                            href = teams[i]._links.fixtures.href;
                            teamFound = true;
                            i = teams.length ++;
                          };
                        }
                        if (teamFound){
                          postFactory.getFootballData(href)
                            .then(function success(res){
                              fixtures = res.fixtures;
                              for (i = 0; i < fixtures.length; i++) {
                                if (fixtures[i].homeTeamName == vm.team.name){
                                  vm.games.push({date: fixtures[i].date.substring(0,10), status: fixtures[i].status, home: 'Home', for: fixtures[i].result.goalsHomeTeam, against: fixtures[i].result.goalsAwayTeam, opponent: fixtures[i].awayTeamName});
                                } else {
                                  vm.games.push({date: fixtures[i].date.substring(0,10), status: fixtures[i].status, home: 'Away', for: fixtures[i].result.goalsAwayTeam, against: fixtures[i].result.goalsHomeTeam, opponent: fixtures[i].homeTeamName});
                                }
                              }
                            });
                          }
                        });
                      }
                  });
                }
        }])
}())
