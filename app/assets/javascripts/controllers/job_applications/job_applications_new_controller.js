"use strict";

var app = angular.module("getHired");

app.controller("JobApplicationsNewController", ["$scope", "JobApplicationsService", "$stateParams", "$state", "JobDataService", "FlashService",
  function($scope, JobApplicationsService, $stateParams, $state, JobDataService, FlashService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.refreshJobs().then(updateJobData);
    JobDataService.refreshJobApplications().then(updateJobData);

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "job_applications/_new.html"
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
    $scope.setTodaysDate = function() {
      return new Date(); 
    };

    $scope.createJobApplication = function(jobApplication) {
      var success = function(response) {
        JobDataService.updateJobApplications([response]);
        updateJobData();
        $state.go("jobs");
      };
      var failure = function(response) {
        FlashMessage.addMessage({message: "Failed to create Job Application", type: "warning"});
      };
      JobApplicationsService.createJobApplication(jobApplication).then(success, failure);
    };

  }
]);
