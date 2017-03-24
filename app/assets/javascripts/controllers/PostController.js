(function() {
    'use strict'

    angular
        .module('app')
        .controller('ClubController',['ClubFactory', '$stateParams', function(ClubFactory, $stateParams){
            var selectedId = -1;
            var vm = this;
            var teamId = $stateParams.id;
            vm.player = { id: null, name: '', team_id: teamId};
            vm.startEdit = startEdit;
            vm.loadFixtures = loadFixtures;
            vm.isInReadMode = isInReadMode;
            vm.isInEditMode = isInEditMode;
            var competitions = [];
            var fixtures = [];
            var teams = [];
            vm.games = [];
            var i = 0;
            var href = 'http://api.football-data.org/v1/competitions/';
            var competitionId = 0;
            var competitionFound = false;
            var teamFound = false;
            var commonHeadersToClear = {};

            vm.getTeam = function(teamId) {
              ClubFactory.getTeam(teamId)
                         .then(function (data){
                           setTeam(data)
              });
            };


            vm.createPlayer = function (teamId, player) {
              ClubFactory.createPlayer(teamId, player)
                         .then(function success(response){
                           vm.getTeam(teamId);
                         });
            };


            vm.editPlayer = function (teamId, player, Id) {
              ClubFactory.editPlayer(teamId, player, Id)
                         .then(function success(response){
                           vm.getTeam(teamId);
                          });
            };

            vm.deletePlayer = function (teamId, Id) {
              ClubFactory.deletePlayer(teamId, Id)
                         .then(function success(response){
                           vm.getTeam(teamId);
                          });
            };


            vm.team = vm.getTeam(teamId)

            function setTeam(data) {
              vm.team = data;
              vm.player = { id: null, name: '', team_id: teamId, };
              selectedId = -1;
            }

            vm.handleCreate = function(){
              vm.createPlayer(teamId, vm.player);
            }
            vm.handleEdit = function(id){
              vm.editPlayer(teamId, vm.player, id);
            }
            vm.handleDelete = function(id){
              vm.deletePlayer(teamId, id);
            }

            vm.handleCancel = function(){
              vm.getTeam(teamId);
            }

            function isInReadMode(id){
              return id != selectedId;
            }

            function isInEditMode(id){
              return id == selectedId;
            }

            function startEdit(id, name){
              selectedId = id;
              vm.player.id = id;
              vm.player.name = name;
            }

            function loadFixtures(){
              ClubFactory.getFootballData(href)
                .then(function success(res){
                  competitions = res;
                  for (i = 0; i < competitions.length; i++) {
                    if (competitions[i].league == vm.team.league) {
                      competitionId = competitions[i].id;
                      competitionFound = true;
                      i = competitions.length ++;
                    };
                  }
                  if (competitionFound){
                    href = 'http://api.football-data.org/v1/competitions/' + competitionId  + '/teams'
                    ClubFactory.getFootballData(href)
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
                          ClubFactory.getFootballData(href)
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
