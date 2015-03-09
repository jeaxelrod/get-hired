"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobsService", "FlashService", "JobApplicationsService",
  function($scope, JobsService, FlashService, JobApplicationsService) {
    $scope.jobs = JobsService.jobs();
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
      JobApplicationsService.setJobApplications(JobApplicationsService.getJobApplications(function(response) {
        for (var i=0; i < response.length; i++) {
          var application = response[i];
          var date = new Date(application.date_applied);
          application.formatted_date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
          var job = $scope.jobs.filter(function(element) {
            return element.id == application.job_id;
          })[0];
          job.job_application = application;
        }
      }));
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 
  }
]);
