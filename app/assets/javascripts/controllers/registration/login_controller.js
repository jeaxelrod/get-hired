var app = angular.module('getHired');

app.controller('LoginController', ['$scope', '$http', 'AuthService', '$location',
  function($scope, $http, AuthService, $location) {
    $scope.user = {email: null, password: null};
    $scope.login = function(user) {
      $http.post('/users/sign_in.json', {user: {email: user.email, password: user.password}}).
        success(function(data, status, headers, config) {
          //Handle successful login
          AuthService.setCurrentUser(data);
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          $scope.successMessage = "";
          $scope.failureMessage = data.error;
        });
    };
    $scope.signOut = function() {
      $http.delete('/users/sign_out.json').
        success(function(data, status, headers, config) {
          //Handle successful login
          console.log("Data: ", data);
          $scope.successMessage = "Logged out successully"
          $scope.failureMessage = "";
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
        });
    };
  }
]);
