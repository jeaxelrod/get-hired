"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobAPIService",
  function($scope, $stateParams, JobAPIService) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retrieve jobs
    }
    
    $scope.jobs = JobAPIService.jobs();
    JobAPIService.setJobs(JobAPIService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.editJob = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs[i] = response;
            break;
          }
        }
        JobAPIService.setJobs($scope.jobs);
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

      JobAPIService.editJob(job, successCallback, failureCallback);
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
