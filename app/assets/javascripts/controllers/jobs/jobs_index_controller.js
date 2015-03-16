"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "FlashService", "JobDataService",
  function($scope, FlashService, JobDataService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.refreshJobs().then(updateJobData());
    JobDataService.refreshJobApplications().then(updateJobData());

    $scope.jobUrl = "jobs/_job.html"; 
  }
]);
