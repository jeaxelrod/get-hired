var app = angular.module("getHired");
app.directive('contacts', function() {
  return { 
    scope: { 
      contact: '='
    },
    templateUrl: 'jobs/_contact.html'
  };
});
