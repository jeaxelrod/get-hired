"use strict";

var app = angular.module("getHired");

app.controller("JobsIndexController", ["$scope", "$http", '$resource', 'FlashService',
  function($scope, $http, $resource, FlashService) {
    var jobCount = 0;
    var Job = $resource('/user/jobs/:id', {id: '@id' }, { 'update': { method: 'PUT' }}); 
    $scope.newJob = [];
    $scope.subtractNewJob = function(id) {
      var newJobIndex = -1;
      for (var i=0; i<$scope.newJob.length; i++) {
        var currentJob = $scope.newJob[i];
        if (currentJob.id === id) {
          var newJobIndex = i;
          break;
        }
      }
      if (newJobIndex !== -1) {
        $scope.newJob.splice(newJobIndex, 1);
      }
    };
    $scope.addNewJob = function()  {
      jobCount++;
      $scope.newJob.push({id: jobCount, job: {}});
    };
    $scope.getNumber = function(num) {
      return new Array(num);
    };

    $scope.getJobs = function() {
      Job.query(null,  function(response) {
        $scope.jobs = response.map(function(job) {
          return {
            id:       job.id,
            position: job.position,
            company:  job.company,
            link:     job.link
          };
        });
      }, function(response) {
        //Job get error
      });
    };
    $scope.createJob = function(job) {
      console.log(job);
      Job.save({id: ""}, {job: job}, function(response) {
        var data = response; 
        $scope.subtractNewJob(job.id);
        $scope.jobs.unshift({ id:       data.id,
                              position: data.position,
                              company:  data.company,
                              link:     data.link });
      }, function(response) {
        console.log("create Job error: ", response);
        if (response.data.errors.link) {
          job.linkError = true;
        }
      });
    };
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
    $scope.deleteJob = function(job) {
      Job.delete({id: job.id}, job, function(response) {
        for (var i=0; i < $scope.jobs.length; i++) {
          var currentJob = $scope.jobs[i];
          if (currentJob.id === job.id) {
            $scope.jobs.splice(i, 1);
            break;
          }
        }
      }, function(response) {
        FlashService.addMessage({messasge: "Failed to Delete Job", type: "warning"});
      });
    };

    $scope.jobUrl = function(job) {
      if (job.editJob) {
        return "jobs/_edit_job.html"
      } else {
        return "jobs/_job.html"
      }
    };
    $scope.beginEdit = function(job) {
      job.editJob = {id:       job.id,
                     position: job.position,
                     company:  job.company,
                     link:     job.link};
      console.log("Begin edit job: ", job);
    };
    $scope.closeEdit = function(job) {
      job.editJob = undefined;
      job.linkError = undefined;
    };


    $scope.beginDelete = function(job) {
      job.deleteJob = true;
    };
    $scope.endDelete = function(job) {
      job.deleteJob = false;
    };
    $scope.startDelete = function(job) {
      $scope.deleteJob(job);
    };

    $scope.getJobs();
  }
]);

