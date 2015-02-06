var app = angular.module('getHired');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: "home/index.html",
      controller: "HomeController",
      views: {
        "nav": {
          templateUrl: "nav/navbar.html"
        }
      }
    })
    .state('login', {
      url: '/login'
    })
    .state('sign-up', {
      url: '/sign-up'
    });
  $urlRouterProvider.otherwise('/');
}]);
