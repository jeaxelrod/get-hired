var app = angular.module('getHired');

app.controller('LogoutController', ['$http', 'AuthService', '$location',
  function($http, AuthService, $location) {
    $http.delete('/users/sign_out.json').
       success(function(data, status, headers, config) {
          //Handle successful login
          AuthService.setCurrentUser(null);
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
        });
  }
]);
