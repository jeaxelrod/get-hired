"use strict";

var app = angular.module("getHired");

app.controller("ContactsIndexController", ['$scope', 'JobDataService',
  function($scope, JobDataService) {
    var updateJobData = function() {
      var jobs = JobDataService.jobs();
      $scope.jobData = JobDataService.data();
      $scope.contacts = JobDataService.contacts().map(function(contact) {
        var contactsJob = jobs.filter(function(job) {
          return job.id === contact.job_id;
        })[0];
        if (contactsJob) {
          contact.company = contactsJob.company;
        };
        return contact;
      });
    };
    updateJobData();
    JobDataService.fetchJobs().then(updateJobData);
    JobDataService.fetchContacts().then(updateJobData);
  }
]);
