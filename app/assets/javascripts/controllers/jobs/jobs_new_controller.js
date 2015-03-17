"use strict";

var app = angular.module("getHired");

app.controller("JobsNewController", ["$scope", "$state", "JobsService", "JobDataService", "JobApplicationsService", "FlashService",
  function($scope, $state, JobsService, JobDataService, JobApplicationsService, FlashService) {
    var updateJobData = function() {
      $scope.jobData = JobDataService.data();
    };
    updateJobData();
    JobDataService.refreshJobs().then(updateJobData);
    JobDataService.refreshJobApplications().then(updateJobData);

    var createNewJobsHelpers = function() {
      var counter = 0;
      $scope.newJobsList = [];
      return {
        add: function() {
          $scope.newJobsList.push({newJobId: counter, job: {}});
          counter++;
        },
        delete: function(newJob) {
          if ($scope.newJobsList.length <= 1) {
            $state.go("jobs"); 
          } else {
            for (var i=0; i< $scope.newJobsList.length; i++) {
              var currentJob = $scope.newJobsList[i];
              if ( currentJob.newJobId === newJob.newJobId) {
                $scope.newJobsList.splice(i, 1);
                break;
              }
            }
          }
        }
      }
    };

    $scope.newJobs = createNewJobsHelpers();
    $scope.newJobs.add();

    $scope.jobUrl = "jobs/_job.html";
    $scope.newJobUrl = function(job) {
      if (job.newApp) {
        return "jobs/_new_job_and_app.html"
      } else {
        return "jobs/_new_job.html"
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

    $scope.createJob = function(job) {
      var successCallback = function(response) {
        var index = $scope.newJobsList.indexOf(job);
        if (index != -1) {
          $scope.newJobsList.splice(index, 1); 
        }
        JobDataService.updateJobs([response]);
        updateJobData();
      }
      var failureCallback = function(response) {
        if (response.data.errors.link) {
          job.linkError = true;
        }
      }
      JobsService.createJob(job).then(successCallback, failureCallback);
    };

    $scope.createJobAndApp = function(newJob, newApp) {
      var createJobApplication = function(response) {
        JobDataService.updateJobs([response]);
        updateJobData();
        newApp.job_id = response.id;
        JobApplicationsService.createJobApplication(newApp).then(function(response) {
          var index = $scope.newJobsList.indexOf(newJob);
          if (index != -1) {
            $scope.newJobsList.splice(index, 1);
          }
          JobDataService.updateJobApplications([response]);
          updateJobData();
        }, function(response) {
          FlashMessage.addMessage({message: "Failed to create Job Application", type: "warning"});
        });
      };

      JobsService.createJob(newJob).then(createJobApplication, function(response) {
        if (response.data.errors.link) {
          newJob.linkError = true;
        }
      });
    };
  }
]);
