"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "FlashService", "JobDataService",
  function($scope, FlashService, JobDataService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.fetchData().then(updateJobData);

    $scope.jobUrl = "jobs/_job.html"; 
    $scope.statusClass = function(status) {
      switch(status) {
        case "Applied":
          return "label label-primary";
        case "Interviewing":
          return "label label-info";
        case "Denied":
          return "label label-warning";
      }
    };
  }
]);
