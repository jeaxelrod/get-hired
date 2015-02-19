"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "$http",
  function($scope, $http) {
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
  }
 ]);

