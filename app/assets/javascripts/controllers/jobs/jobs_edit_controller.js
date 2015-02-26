"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobsService", "$state",
  function($scope, $stateParams, JobsService, $state) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retrieve jobs
    }
    
    $scope.jobs = JobsService.jobs();
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.editJob = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs[i] = response;
            break;
          }
        }
        JobsService.setJobs($scope.jobs);
        $state.go("jobs");
      };
      var failureCallback = function(response) {
        if (response.data.errors.link) {
          for (var i=0; i< $scope.jobs.length; i++) {
            var currentJob = $scope.jobs[i];
            if (currentJob.id === job.id) {
              currentJob.linkError = true;
            }
          }
        }
      };

      JobsService.editJob(job, successCallback, failureCallback);
    };

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_edit_job.html"
      } else {
        return "jobs/_job.html"
      }
    };

  }
]);
