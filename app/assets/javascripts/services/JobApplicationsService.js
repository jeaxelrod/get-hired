"use strict";

var app = angular.module("getHired");
app.factory("JobApplicationsService", ["Restangular",
  function(Restangular) {
    var JobApplication = function(job_id) {
      return Restangular.one('user/jobs', job_id).all('job_applications');
    };
    return {
      getJobApplications: function(args) {
        if (typeof arguments[0] === "object") {
          var job_id = arguments[0].job_id;
          return JobApplication(job_id).getList(); 
        } else {
          return Restangular.all('user/job_applications').getList(); 
        }
      },
      createJobApplication: function(jobApplication) {
        return JobApplication(jobApplication.job_id).post({job_application: jobApplication});
      },
      editJobApplication: function(jobApplication) {
        return JobApplication(jobApplication.job_id).customPUT({job_application: jobApplication}, jobApplication.id);
      },
      deleteJobApplication: function(jobApplication) {
        return JobApplication(jobApplication.job_id).customDELETE(jobApplication.id); 
      }
    }
  }
]);
