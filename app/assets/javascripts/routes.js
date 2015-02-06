var app = angular.module('getHired');
app.config(['$stateProvider', '$urlRouterProvider' function($stateProvider, $urlRouterProvider) {
  $routeProvider.
    when('/', {
      templateUrl: "home/index.html",
      controller: "HomeController"
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
