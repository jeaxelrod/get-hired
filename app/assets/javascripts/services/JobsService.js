"use strict";

var app = angular.module("getHired");

app.factory("JobsService", ['$rootScope', 'Restangular',
  function($rootScope, Restangular) {
    var Job = Restangular.all('user/jobs');
    return {
      getJobs: function() {
        return Job.getList();
      },
      createJob: function(newJob) {
        return Job.post({job: newJob}); 
      },
      editJob: function(editJob) {
        return Job.customPUT({job: editJob}, editJob.id); 
      },
      deleteJob: function(job) {
        return Job.customDELETE(job.id);
      }
    };
  }
]);
