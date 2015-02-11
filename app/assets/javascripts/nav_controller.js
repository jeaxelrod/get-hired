var app = angular.module("getHired");

app.controller('NavController', ['$scope', 'AuthService', function($scope, AuthService) {
  $scope.setLinks = function(isLoggedIn) {
    if (isLoggedIn) {
      $scope.links = [
        { 
          href: "logout",
          title: "Log Out"
        }
      ];
    } else {
      $scope.links = [
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
  $scope.isLoggedIn = AuthService.isLoggedIn();
  $scope.setLinks($scope.isLoggedIn);
  $scope.user = AuthService.currentUser;
  $scope.$watch( AuthService.isLoggedIn, function( isLoggedIn ) {
    $scope.isLoggedIn = isLoggedIn;
    $scope.setLinks($scope.isLoggedIn);
    $scope.user = AuthService.currentUser();
  });
}]);
