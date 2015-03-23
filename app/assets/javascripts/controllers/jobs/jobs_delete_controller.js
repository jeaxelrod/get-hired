"use strict";

var app = angular.module("getHired");

app.controller("JobsDeleteController", ["$scope", "JobsService", "$stateParams", "$state", "FlashService", "JobDataService", 
  function($scope, JobsService, $stateParams, $state, FlashService, JobDataService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.fetchData().then(updateJobData);

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_delete_job.html"
      } else {
        return "jobs/_job.html"
      }
    };
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

    $scope.deleteJob = function(job) {
      var successCallback = function(response) {
        JobDataService.deleteJob(job.id);  
        updateJobData();
        var indexDeletedRow;
        var foundRow = $scope.jobData.some(function(element, index) {
          if (element.job.id == job.id) {
            indexDeletedRow =  index;
            return true;
          }
        })[0];
        if (foundRow) {
          $scope.jobData.splice(indexDeletedRow, 1);
        };
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobsService.deleteJob(job).then(successCallback, failureCallback);
    };
  }
]);
