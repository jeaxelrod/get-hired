"use strict";

var app = angular.module("getHired");

app.factory("JobService", ['$rootScope', '$resource',
  function($rootScope, $resource) {
    var jobs = [];
    var Job = $resource('/user/jobs/:id', {id: '@id' }, {'update': { method: 'PUT' }});
    return {
      jobs: function() {
        return jobs
      },
      setJobs: function(newJobs) {
        jobs = newJobs
      },
      getJobs: function() {
        return Job.query(); 
      },
      createJob: function(job) {
        return Job.save({id: ""}, {job: job});
      },
      editJob: function(job) {
        return Job.update({id: job.id }, {job: job});
      },
      deleteJob: function(job) {
        return Job.delete({id: job. id});
      }
    };
  }
]);
