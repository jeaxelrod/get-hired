"use strict";

var app = angular.module("getHired");

app.controller("JobsEditController", ["$scope", "$stateParams", "JobService",
  function($scope, $stateParams, JobService) {
    var getJobsSuccess = function(response) {
      $scope.jobs = response;
    };
    var getJobsFailure = function(response) {
      // Handle error to retrieve jobs
    }
    
    $scope.jobs = JobService.jobs();
    JobService.setJobs(JobService.getJobs(getJobsSuccess, getJobsFailure));

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
