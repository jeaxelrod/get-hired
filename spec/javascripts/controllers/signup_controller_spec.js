"use strict";

describe("SignupController", function() {
  var scope, controller, $httpBackend;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, $_httpBackend_) {
    $httpBackend = $_httpBackend_;
    scope = $rootScope.$new();
    controller = $controller("SignupController", {$scope: scope});
  }));

  it("should create a new user");
  it("should correctly respond when successfully creating a new user");
  it("should correctly respond with failing to create a new user");
});
