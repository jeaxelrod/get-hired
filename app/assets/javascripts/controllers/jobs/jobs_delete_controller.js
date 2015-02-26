"use strict";

var app = angular.module("getHired");

app.controller("JobsDeleteController", ["$scope", "JobsService", "$stateParams", "FlashService",
  function($scope, JobsService, $stateParams, FlashService) {
    $scope.jobs = JobsService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_delete_job.html"
      } else {
        return "jobs/_job.html"
      }
    };

    $scope.deleteJob = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs.splice(i, 1);
            break;
          }
        }
        JobsService.setJobs($scope.jobs);
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobsService.deleteJob(job, successCallback, failureCallback);
    };
  }
]);
