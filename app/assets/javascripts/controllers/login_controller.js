var app = angular.module('getHired');

app.controller('LoginController', ['$scope', '$http',
  function($scope, $http) {
    $scope.user = {email: null, password: null};
    $scope.login = function(user) {
      $http.post('/users/sign_in.json', {user: {email: user.email, password: user.password}}).
        success(function(data, status, headers, config) {
          //Handle successful login
          console.log("Data: ", data);
          console.log("Status: ", status);
          console.log("Headers: ", headers);
          console.log("Config: ", config);
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
          console.log(data, status, headers, config);
        });
    };
    $scope.signOut = function() {
      $http.delete('/users/sign_out.json').
        success(function(data, status, headers, config) {
          //Handle successful login
          console.log("Data: ", data);
          console.log("Status: ", status);
          console.log("Headers: ", headers);
          console.log("Config: ", config);
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
          console.log(data, status, headers, config);
        });
    };
    console.log($scope);
  }
]);
