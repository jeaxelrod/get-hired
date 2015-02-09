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
          templateUrl: "nav/navbar.html"
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
          templateUrl: "nav/navbar.html"
        }
      }
    })
    .state('sign-up', {
      url: '/sign-up',
      views: {
        "": {
        },
        "nav": {
          templateUrl: "nav/navbar.html"
        }
      }
    });
  $urlRouterProvider.otherwise('/');
}]);
