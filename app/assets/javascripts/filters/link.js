var app = angular.module("getHired");

app.filter('link', function() {
  return function(link) {
    var noScheme = link.split("://")[1];
    var domain = noScheme.match(/.+\.{0,1}.+\.{1}[a-zA-Z]+/)[0];
    return domain;
  }
});
