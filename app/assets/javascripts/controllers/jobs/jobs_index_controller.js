"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "$http", 'FlashService',
  function($scope, $http, FlashService) {
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
            id:       job.id,
            position: job.position,
            company:  job.company,
            link:     job.link
          }
        });
      }).
      error(function(data, status, headers, config) {
      });
    $scope.jobUrl = function(job) {
      if (job.editJob) {
        return "jobs/_edit_job.html"
      } else {
        return "jobs/_job.html"
      }
    };
    $scope.beginEdit = function(job) {
      job.editJob = {id:       job.id,
                     position: job.position,
                     company:  job.company,
                     link:     job.link};
      console.log("Begin edit job: ", job);
    };
    $scope.closeEdit = function(job) {
      job.editJob = undefined;
      job.linkError = undefined;
    };
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
    };
    $scope.editJob = function(job) {
      console.log(job);
      var editJob = { id:       job.id,
                      position: job.position,
                      company:  job.company,
                      link:     job.link };
      $http.put('/user/jobs/' + job.id, {job: editJob}).
        success(function(data, status, headers, config) {
          console.log("Edit Job data: ", data);
          for (var i=0; i < $scope.jobs.length; i++) {
            var currentJob = $scope.jobs[i];
            if (currentJob.id === job.id) {
              currentJob.position = data.position;
              currentJob.company = data.company;
              currentJob.link = data.link;
              currentJob.editJob = undefined;
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
    };
    $scope.deleteJob = function(job) {
      $http.delete('/user/jobs/' + job.id).
        success(function(data, status, headers, config) {
          for (var i=0; i < $scope.jobs.length; i++) {
            var currentJob = $scope.jobs[i];
            if (currentJob.id === job.id) {
              $scope.jobs.splice(i, 1);
              break;
            }
          }
        }).
        error(function(data, status, headers, config) {
          FlashService.addMessage({messasge: "Failed to Delete Job", type: "warning"});
        });
    };
    $scope.beginDelete = function(job) {
      job.deleteJob = true;
    };
    $scope.endDelete = function(job) {
      job.deleteJob = false;
    };
    $scope.startDelete = function(job) {
      $scope.deleteJob(job);
    };
  }
]);

