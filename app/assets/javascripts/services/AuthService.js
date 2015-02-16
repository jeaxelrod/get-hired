"use strict";

var app = angular.module("getHired");

app.factory('AuthService', ['$http', function ($http) {
  var currentUser;
  return {
    setCurrentUser: function(user) { 
      currentUser = user;
    },
    getCurrentUser: function() {
      var promise = $http.get('/current_user', { cache: true})
      promise.success(function(data, status, headers, config) {
        if (data) {
          currentUser = data;
        }
      })
      return promise;
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
