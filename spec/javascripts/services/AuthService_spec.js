"use strict";

describe("Angular authentication service, AuthService,", function() {
  var AuthService, $httpBackend, user;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_AuthService_, _$httpBackend_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    user = {"email": "john@gmail.com", "password": "password"}
  }));


  it("should retreive the currentUser", function() {
    expect(AuthService.currentUser()).toBe(undefined);
  });

  it("should correctly set currentUser", function() {
    AuthService.setCurrentUser(user);
    expect(AuthService.currentUser()).toBe(user);
  });

  it("should correctly state when a user isn't logged in", function() {
    expect(AuthService.isLoggedIn()).toBe(false);
  });
  it("should correctly state when a user is logged in", function() {
    AuthService.setCurrentUser(user);
    expect(AuthService.isLoggedIn()).toBe(true);
  });

  it("should retreive the currentUser from API", function() {
    $httpBackend.expectGET("/current_user").
      respond(user);
    AuthService.getCurrentUser();
    $httpBackend.flush();
    expect(AuthService.currentUser()).toEqual(user);
  });
});
