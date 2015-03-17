"use strict";

var app = angular.module("getHired");

app.controller("JobsDeleteController", ["$scope", "JobsService", "$stateParams", "$state", "FlashService", "JobDataService", 
  function($scope, JobsService, $stateParams, $state, FlashService, JobDataService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.refreshJobs().then(updateJobData);
    JobDataService.refreshJobApplications().then(updateJobData);

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_delete_job.html"
      } else {
        return "jobs/_job.html"
      }
    };

    $scope.deleteJob = function(job) {
      var successCallback = function(response) {
        JobDataService.deleteJob(job.id);  
        updateJobData();
        $state.go("jobs");
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobsService.deleteJob(job).then(successCallback, failureCallback);
    };
  }
]);
