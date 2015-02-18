"use strict";

describe("LoginController", function() {
  var scope, controller, $httpBackend, user, AuthService;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _AuthService_) {
    user = {id: 1, email: "john@gmail.com", password: "password"};
    $httpBackend = _$httpBackend_; 
    scope = $rootScope.$new();
    controller = $controller('LoginController', {$scope: scope});
    AuthService = _AuthService_;
  }));

  it('should initialize user with blank email and name', function() {
    expect(scope.user.email).toBe(null);
    expect(scope.user.password).toBe(null);
  });

  it('should correctly respond to a successful login', function() {
    $httpBackend.expectPOST('/users/sign_in.json').
      respond({id:         user.id,
               email:      user.email,  
               first_name: user.first_name, 
               last_name:  user.last_name});
    scope.login(user);
    $httpBackend.flush();
    expect(AuthService.isLoggedIn()).toBe(true);
  });

  it('should correctly handle errors for logins', function() {
    $httpBackend.expectPOST('/users/sign_in.json').
      respond(401, {error: "Error message"});
    scope.login({});
    $httpBackend.flush();
    expect(scope.failureMessage).toBe("Error message");
    expect(AuthService.isLoggedIn()).toBe(false);
  });
});
