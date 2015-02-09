var app = angular.module('getHired');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: "home/index.html",
      controller: "HomeController"
    })
    .state('login', {
      url: '/login',
      templateUrl: "registration/login.html",
      controller: "LoginController"
    })
    .state('sign-up', {
      url: '/sign-up',
      templateUrl: "registration/sign-up.html",
      controller: "SignUpController"
    });
  $urlRouterProvider.otherwise('/');
}]);
