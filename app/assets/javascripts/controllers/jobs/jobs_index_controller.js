"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "$http",
  function($scope, $http) {
    var jobCount = 0;
    $scope.newJob = [];
    $scope.subtractNewJob = function(id) {
      var newJobIndex = -1;
      for (var i=0; i<$scope.newJob.length; i++) {
        var currentJob = $scope.newJob[i];
        if (currentJob.id === id) {
          var newJobIndex = i;
          break;
        }
      }
      if (newJobIndex !== -1) {
        $scope.newJob.splice(newJobIndex, 1);
      }
    };
    $scope.addNewJob = function()  {
      jobCount++;
      $scope.newJob.push({id: jobCount, job: {}});
    };
    $scope.getNumber = function(num) {
      return new Array(num);
    };
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
          $scope.subtractNewJob(job.id);
          $scope.jobs.unshift({ id:       data.id,
                                position: data.position,
                                company:  data.company,
                                link:     data.link });
        }).
        error(function(data, status, headers, config) {
          if (data.errors.link) {
            job.linkError = true;
          }
        });
    }
    $scope.editJob = function(job) {
      $http.put('/user/jobs/' + job.id, {job: job}).
        success(function(data, status, headers, config) {
          console.log("Edit Job data: ", data);
          for (var i=0; i < $scope.jobs.length; i++) {
            var currentJob = $scope.jobs[i];
            if (currentJob.id === job.id) {
              currentJob.position = data.position;
              currentJob.company = data.company;
              currentJob.link = data.link;
              break;
            }
          }
        }).
        error(function(data, status, headers, config) {
          console.log("Edit Job failure data: ", data);
          if (data.errors.link) {
            for (var i=0; i< $scope.jobs.length; i++) {
              var currentJob = $scope.jobs[i];
              if (currentJob.id === job.id) {
                currentJob.linkError = true;
              }
            }
          }
        });
    }
  }
]);

