"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobAPIService", "FlashService",
  function($scope, JobAPIService, FlashService) {
    $scope.jobs = JobAPIService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobAPIService.setJobs(JobAPIService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 

  }
]);
