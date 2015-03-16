"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "FlashService", "JobDataService",
  function($scope, FlashService, JobDataService) {
    $scope.jobData = JobDataService.data();
    JobDataService.refreshJobs().then(function() {
      $scope.jobData = JobDataService.data();
    });
    JobDataService.refreshJobApplications().then(function() {
      $scope.jobData = JobDataService.data();
    });

    $scope.jobUrl = "jobs/_job.html"; 
  }
]);
