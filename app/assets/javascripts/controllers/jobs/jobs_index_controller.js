"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "JobsService", "FlashService", "JobApplicationsService",
  function($scope, JobsService, FlashService, JobApplicationsService) {
    $scope.jobs = JobsService.jobs();
    $scope.jobData = [];
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
      $scope.jobs.forEach(function(job) {
        $scope.jobData.push({job: job});
      });
      JobApplicationsService.setJobApplications(JobApplicationsService.getJobApplications(function(response) {
        $scope.jobApplications = response;
        for (var i=0; i < response.length; i++) {
          var application = response[i];
          var date = new Date(application.date_applied);
          var formatted_date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
          var tableRow = $scope.jobData.filter(function(row) {
            return row.job.id === application.job_id;
          })[0];
          tableRow.job_application = JSON.parse(JSON.stringify(application));
          tableRow.job_application.formatted_date = formatted_date;
        }
        $scope.jobData.filter(function(element) {
          return !element.job_application
        }).forEach(function(element) {
          element.newApp = true;
        });
      }));
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };
    JobsService.setJobs(JobsService.getJobs(getJobsSuccess, getJobsFailure));
    $scope.jobUrl = "jobs/_job.html"; 
  }
]);
