"use strict";

var app = angular.module("getHired");

app.controller("JobsNewController", ["$scope", "JobAPIService", "$state",
  function($scope, JobAPIService, $state) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retreive jobs
    };

    $scope.jobs = JobAPIService.jobs();
    JobAPIService.setJobs(JobAPIService.getJobs(getJobsSuccess, getJobsFailure));

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
        var index = $scope.newJobsList.indexOf(job);
        if (index != -1) {
          $scope.newJobs.splice(index, 1); 
        }
        $scope.jobs.unshift(response);
      }
      var failureCallback = function(response) {
        if (response.data.errors.link) {
          job.linkError = true;
        }
      }
      JobAPIService.createJob(job, successCallback, failureCallback);
    };
  }
]);
