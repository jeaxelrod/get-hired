var app = angular.module("getHired");

app.filter('link', function() {
  return function(link) {
    if (link) {
      return link.split("://")[1];
    }
  }
});
