var app = angular.module('getHired');

app.controller('LogoutController', ['$http', 'AuthService', '$location', 'FlashService',
  function($http, AuthService, $location, FlashService) {
    $http.delete('/users/sign_out.json').
       success(function(data, status, headers, config) {
          //Handle successful login
          AuthService.setCurrentUser(null);
          FlashService.addMessage({message: "Successfully Logged Out", type: "success"});
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
        });
  }
]);
