"use strict";

var app = angular.module("getHired");

app.controller("JobApplicationsNewController", ["$scope", "JobsService", "JobApplicationsService", "$stateParams", "$state",
  function($scope, JobsService, JobApplicationsService, $stateParams, $state) {
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
        $scope.jobs.filter(function(element) {
          return !element.job_application
        }).map(function(element) {
          element.newApp = true;
        });
      }));
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

    $scope.createJobApplication = function(jobApplication) {
      var success = function(response) {
        var job = $scope.jobs.filter(function(element) {
          return element.id == response.job_id;
        })[0];
        job.job_application = response;
        JobsService.setJobs($scope.jobs);
        JobApplicationsService.setJobApplications(JobApplicationsService.jobApplications().push(response));
        $state.go("jobs");
      };
      var failure = function(response) {
        //Handle creation of new job appliaction error
      };
      JobApplicationsService.createJobApplication(jobApplication, success, failure);
    };

  }
]);
