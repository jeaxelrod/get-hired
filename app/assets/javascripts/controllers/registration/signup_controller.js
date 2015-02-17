"use strict";

var app = angular.module("getHired");

app.controller("SignupController", ["$scope", "$http", "$location", "FlashService", "AuthService",
  function($scope, $http, $location, FlashService, AuthService) {
    $scope.user = {email: null, password: null, password_confirmation: null};
    $scope.signup = function(user) {
      console.log("signup");
      $http.post('/users.json', {user: { email: user.email,
                                         password: user.password, 
                                         password_confirmation: user.password_confirmation }}).

        success(function(data, status, headers, config) {
          console.log("Success data: ", data);
          FlashService.addMessage({message: "Welcome to Get Hired", type: "success"});
          AuthService.setCurrentUser(data);
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          console.log("Failure data: ", data);
          $scope.emailMessage = data.errors.email ? 
            "Email " + data.errors.email[0] : "";
          $scope.passwordMessage = data.errors.password ? 
            "Password " + data.errors.password[0] : "";
          $scope.passwordConfirmationMessage = data.errors.password_confirmation ?
            "Password Confirmation " + data.errors.password_confirmation[0] : "";
        });
    };
  }
]);
