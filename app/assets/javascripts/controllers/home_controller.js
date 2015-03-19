var app = angular.module('getHired');

app.controller('HomeController', ['$scope', 'FlashService', 'AuthService',
  function($scope, FlashService, AuthService) {
    $scope.isLoggedIn = AuthService.isLoggedIn();
    console.log($scope.isLoggedIn);
  }
]);
