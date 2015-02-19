"use strict";

var app = angular.module("getHired");

app.controller('NavController', ['$scope', 'AuthService', '$state',
  function($scope, AuthService, $state) {
    $scope.state = $state.current.name;
    $scope.setLinks = function(isLoggedIn) {
      if (isLoggedIn) {
        $scope.leftLinks = [
          { 
            href: "jobs",
            title: "Jobs"
          }
        ];
        $scope.rightLinks = [
          { 
            href: "logout",
            title: "Log Out"
          }
        ];
      } else {
        $scope.leftLinks = [];
        $scope.rightLinks = [
          {
            href: "sign-up",
            title: "Sign Up"
          },
          {  
            href:"login",
            title: "Sign In"
          }
        ];
      }
    };
    if (!AuthService.isLoggedIn()) {
      AuthService.getCurrentUser().then( function() {
        $scope.isLoggedIn = AuthService.isLoggedIn();
        $scope.setLinks($scope.isLoggedIn);
        $scope.user = AuthService.currentUser;
      });
    } else {
      $scope.isLoggedIn = AuthService.isLoggedIn();
      $scope.setLinks($scope.isLoggedIn);
      $scope.user = AuthService.currentUser;
    }
    $scope.$watch( AuthService.isLoggedIn, function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue !== oldValue) {
        $scope.isLoggedIn = newValue;
        $scope.setLinks($scope.isLoggedIn);
        $scope.user = AuthService.currentUser();
      }
    });
  }
]);
