"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobService", "FlashService",
  function($scope, JobService, FlashService) {
    $scope.jobs = JobService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobService.setJobs(JobService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 
    $scope.beginDelete = function(job) {
      job.deleteJob = true;
    }
    $scope.endDelete = function(job) {
      job.deleteJob = false;
    }
    $scope.startDelete = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs.splice(i, 1);
            break;
          }
        }
        JobService.setJobs(JobService.getJobs(getJobsSucess, getJobsFailure));
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobService.deleteJob(job, successCallback, failureCallback);
    };


  }
]);
