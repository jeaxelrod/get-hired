"use strict";

var app = angular.module("getHired");

app.controller("JobApplicationsNewController", ["$scope", "JobApplicationsService", "$stateParams", "$state", "JobDataService", "ContactsService", "$q",
  function($scope, JobApplicationsService, $stateParams, $state, JobDataService, ContactsService, $q) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.fetchData().then(updateJobData);

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

    $scope.createJobApplication = function(jobApplication, contact) {
      var appsPromise = JobApplicationsService.createJobApplication(jobApplication).then(function(response) {
        JobDataService.updateJobApplications([response]);
        updateJobData();
        if (contact) {
          contact.job_id = response.job_id;
          contact.job_application_id = response.job_application_id;
          ContactsService.createContact(contact).then(function(response) {
            JobDataService.updateContacts([response]);
            updateJobData();
            $state.go("jobs");
          });
        } else {
          updateJobData();
          $state.go("jobs");
        }
      } , failure);
      var failure = function(response) {
        //Handle failure to create new job app
      };
    };

  }
]);
