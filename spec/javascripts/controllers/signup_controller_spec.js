"use strict";

describe("SignupController", function() {
  var scope, controller, $httpBackend, AuthService;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _AuthService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    controller = $controller("SignupController", {$scope: scope});
    AuthService = _AuthService_;
  }));

  it("should create a new user", function() {
    var user = { email:                 "john@gmail.com", 
                 password:              "password", 
                 password_confirmation: "password" };
    $httpBackend.expectPOST("/users.json").
      respond(user);
    scope.signup(user);
    $httpBackend.flush();
    expect(AuthService.isLoggedIn()).toBe(true);
    expect(AuthService.currentUser()).toEqual(user);
  });

  it("should correctly respond with failing to create a new user", function() {
    var user = {};
    $httpBackend.expectPOST("/users.json").
      respond(401, {errors: {email:                 ["message"],
                             password:              ["message"],
                             password_confirmation: ["message"]}});
    scope.signup(user);
    $httpBackend.flush();
    expect(scope.emailMessage).toBe("Email message");
    expect(scope.passwordMessage).toBe("Password message");
    expect(scope.passwordConfirmationMessage).toBe("Password Confirmation message");
    expect(AuthService.isLoggedIn()).toBe(false);
    expect(AuthService.currentUser()).toEqual(undefined);
  });

  it("should correctly respond with failing to create a new user when given no error messages", function() {
    var user = {};
    $httpBackend.expectPOST("/users.json").
      respond(401, {errors: {}});
    scope.signup(user);
    $httpBackend.flush();
    expect(scope.emailMessage).toBe("");
    expect(scope.passwordMessage).toBe("");
    expect(scope.passwordConfirmationMessage).toBe("");
    expect(AuthService.isLoggedIn()).toBe(false);
    expect(AuthService.currentUser()).toEqual(undefined);
  });
});
