"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobsService", "FlashService", "JobApplicationsService",
  function($scope, JobsService, FlashService, JobApplicationsService) {
    $scope.jobs = JobsService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
      for (var i =0; i < $scope.jobs.length; i++) {
        var job = $scope.jobs[i];
        job.job_application = JobApplicationsService.getJobApplications({job_id: job.id})[0];
      }
      JobsService.setJobs($scope.jobs);
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 


  }
]);
