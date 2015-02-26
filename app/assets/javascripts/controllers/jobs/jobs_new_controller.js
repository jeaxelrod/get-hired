"use strict";

var app = angular.module("getHired");

app.controller("JobsNewController", ["$scope", "JobService", "$state",
  function($scope, JobService, $state) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };

    $scope.jobs = JobService.jobs();
    JobService.setJobs(JobService.getJobs(getJobsSuccess, getJobsFailure));

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
    $scope.newJobUrl = "jobs/_new_job.html"

    $scope.createJob = function(job) {
      var successCallback = function(response) {
        $scope.newJobs.delete(job);
        $scope.jobs.unshift(response);
      }
      var failureCallback = function(response) {
        if (response.data.errors.link) {
          job.linkError = true;
        }
      }
      JobService.createJob(job, successCallback, failureCallback);
    };

    $scope.beginDelete = function(job) {
      job.deleteJob = true;
    }
    $scope.endDelete = function(job) {
      job.deleteJob = false;
    }

    $scope.startDelete = function(job) {
      var successCallback = function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs.splice(i, 1);
            break;
          }
        }
        JobService.setJobs(JobService.getJobs(getJobsSucess, getJobsFailure));
      };
      var failureCallback = function(response) {
        FlashService.addMessage({message: "Failed to Delete Job", type: "warning"});
      };
      JobService.deleteJob(job, successCallback, failureCallback);
    };
  }
]);
