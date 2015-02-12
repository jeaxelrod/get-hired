"use strict";

describe("Angular authentication service, AuthService,", function() {
  var AuthService;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_AuthService_) {
    AuthService = _AuthService_;
  }));


  it("should retreive the currentUser", function() {
    expect(AuthService.currentUser()).toBe(undefined);
  });

  it("should correctly set currentUser", function() {
    var user = {"email": "john@gmail.com", "password": "password"}
    AuthService.setCurrentUser(user);
    expect(AuthService.currentUser()).toBe(user);
  });

  it("should correctly state when a user isn't logged in", function() {
    expect(AuthService.isLoggedIn()).toBe(false);
  });
  it("should correctly state when a user is logged in", function() {
    var user = {"email": "john@gmail.com", "password": "password"}
    AuthService.setCurrentUser(user);
    expect(AuthService.isLoggedIn()).toBe(true);
  });

  it("should retreive the currentUser from API");
});
