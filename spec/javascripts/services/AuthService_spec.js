"use strict";

describe("Angular authentication service, AuthService,", function() {
  var AuthService;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_AuthService_) {
    AuthSerice = _AuthService_;
  }));

  it("should correct set currentUser");
  it("should retreive the currentUser");
  it("should correctly state when a user isn't logged in");
  it("should correctly state when a user is logged in");
  it("should retreive the currentUser from API");
});
