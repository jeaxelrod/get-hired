"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobsService", "FlashService",
  function($scope, JobsService, FlashService) {
    $scope.jobs = JobsService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 

  }
]);
