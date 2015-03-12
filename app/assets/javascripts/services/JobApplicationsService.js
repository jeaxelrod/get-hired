"use strict";

var app = angular.module("getHired");
app.factory("JobApplicationsService", ["$resource",
  function($resource) {
    var JobApplication = $resource('/user/jobs/:job_id/job_applications/:id',
                                    {id: '@id', job_id: '@job_id'},
                                    { 'queryAll': {method: 'GET', isArray: true, url: '/user/job_applications'},
                                      'edit':     {method: 'PUT' }});
    return {
      getJobApplications: function(args) {
        if (typeof arguments[0] === "object") {
          var job_id = arguments[0].job_id;
          var successCallback = arguments[1];
          var failureCallback = arguments[2];
          return JobApplication.query({job_id: job_id}, successCallback, failureCallback);
        } else {
          var successCallback = arguments[0];
          var failureCallback = arguments[1];
          return JobApplication.queryAll({}, successCallback, failureCallback);
        }
      },
      createJobApplication: function(jobApplication, successCallback, failureCallback) {
        return JobApplication.save({job_id: jobApplication.job_id, id: ""}, {job_application: jobApplication}, successCallback, failureCallback);
      },
      editJobApplication: function(jobApplication, successCallback, failureCallback) {
        return JobApplication.edit({id: jobApplication.id, job_id: jobApplication.job_id}, {job_application: jobApplication}, successCallback, failureCallback);
      },
      deleteJobApplication: function(jobApplication, successCallback, failureCallback) {
        return JobApplication.delete({id: jobApplication.id, job_id: jobApplication.job_id}, successCallback, failureCallback); 
      }
    }
  }
]);
