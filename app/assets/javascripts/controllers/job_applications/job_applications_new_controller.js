"use strict";

var app = angular.module("getHired");

app.controller("JobApplicationsNewController", ["$scope", "JobApplicationsService", "$stateParams", "$state", "JobDataService",
  function($scope, JobApplicationsService, $stateParams, $state, JobDataService) {
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

    $scope.createJobApplication = function(jobApplication) {
      var success = function(response) {
        JobDataService.updateJobApplications([response]);
        updateJobData();
        $state.go("jobs");
      };
      var failure = function(response) {
        //Handle creation of new job appliaction error
      };
      JobApplicationsService.createJobApplication(jobApplication).then(success, failure);
    };

  }
]);
