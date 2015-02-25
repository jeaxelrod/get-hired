"use strict";

var app = angular.module("getHired");

app.factory("JobService", ['$rootScope', '$resouce',
  function($rootScope, $resource) {
    var jobs = [];
    return {
      jobs: function() {
        return jobs;
      },
      getJobs: function() {
      },
      createJob: function(job) {
      },
      editJob: function(job) {
      },
      deleteJob: function(job) {
      }
    };
  }
]);
