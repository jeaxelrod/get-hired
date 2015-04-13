"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobsService", "$state", "JobDataService", "JobApplicationsService", "ContactsService", "$q",
  function($scope, $stateParams, JobsService, $state, JobDataService, JobApplicationsService, ContactsService, $q) {
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
    $scope.editJobAppContact = function(job, app, contact) {
      var editedJob = { id: job.id, position: job.position, company: job.company, link: job.link }; 
      var editedApp = { id: app.id, user_id: app.user_id, job_id: app.job_id, date_applied: app.date_applied, comments: app.comments, communication: app.communication, status: app.status };
      var editedContact = { id: contact.id, user_id: app.user_id, job_id: job.id, job_application_id: app.id, first_name: contact.first_name, last_name: contact.last_name, email: contact.email, phone_number: contact.phone_number };

      var jobsPromise = JobsService.editJob(editedJob).then(function(response) {
        JobDataService.updateJobs([response]);
        updateJobData()
      } , failureCallback);

      var appsPromise = JobApplicationsService.editJobApplication(editedApp).then(function(response) {
        JobDataService.updateJobApplications([response]);
        updateJobData();
      });

      if (editedContact.id) {
        var contactsPromise = ContactsService.editContact(editedContact).then(function(response) {
          JobDataService.updateContacts([response]);
          updateJobData();
        });
      } else {
        var contactsPromise = ContactsService.createContact(editedContact).
          then(function(response) {
            JobDataService.updateContacts([response]);
            updateJobData();
          });
      }
      
      $q.all([jobsPromise, appsPromise, contactsPromise]).then(function() {
        $state.go("jobs");
      });

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
