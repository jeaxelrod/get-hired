"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobAPIService",
  function($scope, $stateParams, JobAPIService) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retrieve jobs
    }
    
    $scope.jobs = JobAPIService.jobs();
    JobAPIService.setJobs(JobAPIService.getJobs(getJobsSuccess, getJobsFailure));

    $scope.editJob = function(job) {
      var editJob = { id:       job.id,
                      position: job.position,
                      company:  job.company,
                      link:     job.link };
      Job.update({id: editJob.id}, {job: editJob}, function(response) {
        var data = response;
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            currentJob.position = data.position;
            currentJob.company = data.company;
            currentJob.link = data.link;
            delete currentJob.editJob;
            break;
          }
        }
      }, function(response) {
        if (response.data.errors.link) {
          for (var i=0; i< $scope.jobs.length; i++) {
            var currentJob = $scope.jobs[i];
            if (currentJob.id === job.id) {
              currentJob.linkError = true;
            }
          }
        }
      });
    };

    $scope.jobUrl = function(job) {
      if (job.id == $stateParams.jobId) {
        return "jobs/_edit_job.html"
      } else {
        return "jobs/_job.html"
      }
    };

  }
]);
