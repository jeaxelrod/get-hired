"use strict";

var app = angular.module("getHired");
app.factory('AuthService', ['$http', function ($http) {
  var currentUser;
  return {
    setCurrentUser: function(user) { 
      currentUser = user;
    },
    getCurrentUser: function() {
      $http.get('/current_user').
        success(function(data, status, headers, config) {
          console.log(data);
          if (data) {
            currentUser = data;
          }
        }).
        error(function(data, status, headers, config) {
          //Handle error for http request of current_user
        });
    },
    isLoggedIn: function() {
      if (currentUser) {
        return true;
      } else {
        return false
      }
    },
    currentUser: function() { return currentUser; }
  };
}]);
