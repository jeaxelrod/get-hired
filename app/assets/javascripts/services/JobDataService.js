"use strict";

var app = angular.module("getHired");

app.factory("JobDataService", ['JobsService', 'JobApplicationsService', '$q',
  function(JobsService, JobApplicationsService, $q) {
    var jobs = [];
    var jobApplications = [];
    var data = [];
    var findJob = function(id) {
      return jobs.filter(function(job) {
        return job.id === id;
      })[0];
    };
    var updateJob = function(newJob, oldJob) {
      for (var prop in newJob) {
        if (newJob.hasOwnProperty(prop)) {
          if (newJob[prop] !== oldJob[prop]) {
            oldJob[prop] = newJob[prop];
          }
        }
      }
    };
    var findJobApplication = function(id) {
      return jobApplications.filter(function(app) {
        return app.id === id;
      })[0];
    };
    var updateJobApplication = function(newApp, oldApp) {
      for (var prop in newApp) {
        if (newApp.hasOwnProperty(prop)) {
          if (newApp[prop] !== oldApp[prop]) {
            if (prop === "date_applied") {
              oldApp.formatted_date = formatDate(newApp.date_applied);
            }
            oldApp[prop] = newApp[prop];
          }
        }
      }
    };

    var addJob = function(job) {
      var dataElement = data.filter(function(element) {
        if (element.job_application) {
          return element.job_application.job_id === job.id;
        } else {
          return false;
        }
      })[0];
      if (dataElement) {
        dataElement.job = job;
      } else {
        data.push({job: job});
        jobs.push(job);
      }
    };
    var addJobApplication = function(app) {
      app.formatted_date = formatDate(app.date_applied);
      var dataElement = data.filter(function(element) {
        if (element.job) {
          return element.job.id === app.job_id;
        } else {
          return false;
        }
      })[0];
      if (dataElement) {
        dataElement.job_application = app;
      } else {
        data.push({job_application: app});
        jobApplications.push(app);
      }
    };

    var updateJobs = function(newJobs) {
      newJobs.forEach(function(newJob) {
        var oldJob = findJob(newJob.id);
        if (oldJob) {
          updateJob(newJob, oldJob);
        } else {
          addJob(newJob);
        }
      });
    };
    var updateJobApplications = function(newJobApplications) {
      newJobApplications.forEach(function(newApp) {
        var oldApp = findJobApplication(newApp.id);
        if (oldApp) {
          updateJobApplication(newApp, oldApp);
        } else {
          addJobApplication(newApp);
        }
      });
    };
          
    var formatDate = function(milliseconds) {
      var date = new Date(milliseconds);
      return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    };
    return {
      jobs: function() { 
        return jobs; 
      }, 
      jobApplications: function() {
        return jobApplications;
      },
      data: function() {
        return data;
      },
      updateJobs: updateJobs,
      updateJobApplications: updateJobApplications,
      refreshJobs: function() {
        JobsService.getJobs(function(response) {
          updateJobs(response);
        });
      },
      refreshJobApplications: function() {
        JobApplicationsService.getJobApplications(function(response) {
          updateJobApplications(response);
        });
      }
    };
  }
]);
