"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobsService", "$state", "JobDataService",
  function($scope, $stateParams, JobsService, $state, JobDataService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.refreshJobs().then(updateJobData);
    JobDataService.refreshJobApplications().then(updateJobData);

    $scope.editJob = function(job) {
      var editedJob = { id: job.id, position: job.position, company: job.company, link: job.link }; 
      var successCallback = function(response) {
        JobDataService.updateJobs([response]);
        $state.go("jobs");
      };
      var failureCallback = function(response) {
        if (response.data.errors.link) {
          for (var i=0; i< $scope.jobData.length; i++) {
            var currentJob = $scope.jobData[i];
            if (currentJob.job.id === job.id) {
              currentJob.linkError = true;
            }
          }
        }
      };

      JobsService.editJob(editedJob).then(successCallback, failureCallback);
    };

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_edit_job.html"
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
  }
]);
