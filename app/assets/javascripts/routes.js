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
    });
  $urlRouterProvider.otherwise('/');
}]);
