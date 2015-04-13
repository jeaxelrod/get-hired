"user strict";

describe("NavController", function() {
  var scope, controller, $httpBackend, AuthService, $state;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _AuthService_, _$state_, $templateCache) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    $httpBackend.expectGET("/current_user").
      respond(null);
    controller = $controller('NavController', {$scope: scope});
    AuthService = _AuthService_;
    $state = _$state_;
    $templateCache.put("registration/signup.html", "");
  }));

  it("should set correct links when logged in", function() {
    $httpBackend.flush();
    AuthService.setCurrentUser({user: true});
    scope.$digest();
    expect(scope.leftLinks).toEqual(  [{ href: "jobs",   title: "Jobs"    }, { href: 'contacts', title: 'Contacts' }]);
    expect(scope.rightLinks).toEqual( [{ href: "logout", title: "Log Out" }]);
  });
  it("should set correct links when not logged in", function() {
    $httpBackend.flush();
    expect(scope.rightLinks).toEqual([{ href: "sign-up", title: "Sign Up" },
                                      { href: "login",   title: "Sign In" }]);
    expect(scope.leftLinks).toEqual([]);
  });
  it("should change links when user logs in", function() {
    $httpBackend.flush();
    expect(scope.rightLinks).toEqual([{ href: "sign-up", title: "Sign Up" },
                                      { href: "login",   title: "Sign In" }]);
    expect(scope.leftLinks).toEqual([]);
    AuthService.setCurrentUser({user: true});
    scope.$digest();
    expect(scope.leftLinks).toEqual(  [{ href: "jobs",   title: "Jobs"    }, { href: 'contacts', title: 'Contacts' }]);
    expect(scope.rightLinks).toEqual( [{ href: "logout", title: "Log Out" }]);
  });

// Can't get ui-router working in specs
//  it("should set the correct state name according to the route", function() {
//    $state.go("sign-up");
//    scope.$digest();
//    expect(scope.state).toBe("sign-up");
//  });
});
