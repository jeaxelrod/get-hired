"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobsService", "$state", "JobDataService", "JobApplicationsService",
  function($scope, $stateParams, JobsService, $state, JobDataService, JobApplicationsService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.fetchData().then(updateJobData);

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
    $scope.editJobAndApp = function(job, app) {
      var editedJob = { id: job.id, position: job.position, company: job.company, link: job.link }; 
      var editedApp = { id: app.id, user_id: app.user_id, job_id: app.job_id, date_applied: app.date_applied, comments: app.comments, communication: app.communication, status: app.status };

      var successCallback = function(response) {
        JobDataService.updateJobs([response]);
        updateJobData();

        var updateJobDataAndLeave = function(response) {
          JobDataService.updateJobApplications([response]);
          updateJobData();
          $state.go("jobs");
        };
        var handleEditFailure = function(response) {
        };

        JobApplicationsService.editJobApplication(editedApp).then(updateJobDataAndLeave, handleEditFailure);
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

    $scope.jobUrl = function(row) {
      if (row.job.id == $stateParams.jobId) {
        if (row.job_application) {
          return "jobs/_edit_job_and_app.html"
        } else {
          return "jobs/_edit_job.html"
        }
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
