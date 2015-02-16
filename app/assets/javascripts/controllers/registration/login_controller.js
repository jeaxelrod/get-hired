"use strict";

var app = angular.module('getHired');

app.controller('LoginController', ['$scope', '$http', 'AuthService', '$location', 'FlashService',
  function($scope, $http, AuthService, $location, FlashService) {
    $scope.user = {email: null, password: null};
    $scope.login = function(user) {
      $http.post('/users/sign_in.json', {user: {email: user.email, password: user.password}}).
        success(function(data, status, headers, config) {
          //Handle successful login
          FlashService.addMessage({message: "Successfully Logged In", type: "success"});
          AuthService.setCurrentUser(data);
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          $scope.successMessage = "";
          $scope.failureMessage = data.error;
        });
    };
  }
]);
