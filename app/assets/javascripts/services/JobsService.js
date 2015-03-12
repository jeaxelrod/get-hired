"use strict";

var app = angular.module("getHired");

app.factory("JobsService", ['$rootScope', '$resource',
  function($rootScope, $resource) {
    var Job = $resource('/user/jobs/:id', {id: '@id' }, {'update': { method: 'PUT' }});
    return {
      getJobs: function(successCallback, failureCallback) {
        return Job.query(successCallback, failureCallback); 
      },
      createJob: function(job, successCallback, failureCallback) {
        return Job.save({id: ""}, {job: job}, successCallback, failureCallback);
      },
      editJob: function(job, successCallback, failureCallback) {
        return Job.update({id: job.id }, {job: job}, successCallback, failureCallback);
      },
      deleteJob: function(job, successCallback, failureCallback) {
        return Job.delete({id: job. id}, successCallback, failureCallback);
      }
    };
  }
]);
