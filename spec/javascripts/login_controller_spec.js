describe("LoginController", function() {
  var scope, controller, $httpBackend;

  beforeEach(module('getHired'));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    controller = $controller('LoginController', {$scope: scope});
  }));

  it('should initialize user with blank email and name', function() {
    expect(scope.user.email).toBe(null);
    expect(scope.user.password).toBe(null);
  });
  it('should correctly respond to a successful login');
  it('should correctly handle errors for logins');
});
