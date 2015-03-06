"use strict";

var app = angular.module('getHired');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        "": {
          templateUrl: "home/index.html",
          controller: "HomeController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('login', {
      url: '/login',
      views: {
        "": {
          templateUrl: "registration/login.html",
          controller: "LoginController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('sign-up', {
      url: '/sign-up',
      views: {
        "": {
          templateUrl: "registration/signup.html",
          controller: "SignupController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('logout', {
      url: '/logout',
      views: {
        "": {
          controller: "LogoutController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('jobs', {
      url: '/jobs',
      views: {
        "": {
          templateUrl: "jobs/index.html",
          controller: "JobsIndexController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('newJob', {
      url: '/jobs/new',
      views: {
        "": {
          templateUrl: "jobs/new.html",
          controller: "JobsNewController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('editJob', {
      url: "jobs/edit/:jobId",
      views: {
        "": {
          templateUrl: "jobs/edit.html",
          controller: "JobsEditController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('deleteJob', {
      url: "job/delete/:jobId",
      views: {
        "": {
          templateUrl: "jobs/delete.html",
          controller: "JobsDeleteController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    })
    .state('newJobApplication', {
      url: "job/:jobId/job_application/new",
      views: {
        "": {
          templateUrl: "job_applications/new.html",
          controller: "JobApplicationsNewController"
        },
        "nav": {
          templateUrl: "nav/navbar.html",
          controller: "NavController"
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}]);
