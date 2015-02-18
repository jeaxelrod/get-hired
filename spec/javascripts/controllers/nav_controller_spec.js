"user strict";

describe("NavController", function() {
  var scope, controller, $httpBackend, AuthService;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _AuthService_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    controller = $controller('NavController', {$scope: scope});
    AuthService = _AuthService_;
  }));

  it("should set correct links when logged in");
  it("should set correct links when not logged in");
  it("should change links when user logs in");
  it("should set the correct state name according to the route");
});
