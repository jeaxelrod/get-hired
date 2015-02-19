"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "$http",
  function($scope, $http) {
    $scope.job = {};
    $http.get('/user/jobs').
      success(function(data, status, headers, config) {
        $scope.jobs = data.map(function(job) {
          return {
            position: job.position,
            company:  job.company,
            link:     job.link
          }
        });
      }).
      error(function(data, status, headers, config) {
      });
    $scope.createJob = function(job) {
      $http.post('/user/jobs', {job: job}).
        success(function(data, status, headers, config) {
          console.log(data);
          $scope.job = {};
          $scope.jobs.unshift({ position: data.position,
                             company:  data.company,
                             link:     data.link });
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
    }
  }
 ]);

