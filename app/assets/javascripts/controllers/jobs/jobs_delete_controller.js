"use strict";

var app = angular.module("getHired");

app.controller("JobsDeleteController", ["$scope", "JobAPIService", "$stateParams",
  function($scope, JobAPIService, $stateParams) {
    $scope.jobs = JobAPIService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobAPIService.setJobs(JobAPIService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_delete_job.html"
      } else {
        return "jobs/_job.html"
      }
    };

    $scope.startDelete = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs.splice(i, 1);
            break;
          }
        }
        JobAPIService.setJobs(JobAPIService.getJobs(getJobsSucess, getJobsFailure));
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobAPIService.deleteJob(job, successCallback, failureCallback);
    };
  }
]);
