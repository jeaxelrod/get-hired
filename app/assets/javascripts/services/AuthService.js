var app = angular.module("getHired");
app.factory('AuthService', function () {
  var currentUser;
  return {
    setCurrentUser: function(user) { 
      currentUser = user;
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
});
