"use strict";

var app = angular.module("getHired");

app.controller("JobApplicationsNewController", ["$scope", "JobsService", "JobApplicationsService", "$stateParams",
  function($scope, JobsService, JobApplicationsService, $stateParams) {
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

    $scope.jobs = JobsService.jobs();
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "job_applications/_new.html"
      } else {
        return "jobs/_job.html"
      }
    };

    $scope.createJobApplication = function(job) {
      console.log(job);
    };

  }
]);
