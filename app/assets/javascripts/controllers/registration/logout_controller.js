var app = angular.module('getHired');

app.controller('LogoutController', ['$http', 'AuthService', '$location', 'FlashService', 'JobDataService',
  function($http, AuthService, $location, FlashService, JobDataService) {
    $http.delete('/users/sign_out.json').
       success(function(data, status, headers, config) {
          //Handle successful login
          AuthService.setCurrentUser(null);
          FlashService.addMessage({message: "Successfully Logged Out", type: "success"});
          JobDataService.resetData();
          $location.path("");
        }).
        error(function(data, status, headers, config) {
          //Handle unsuccssful logins
        });
  }
]);
