"use strict";

describe("JobsIndexController", function() {
  var scope, controller, $httpBackend;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should lists all jobs", function() {
    var jobs = [{ position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    $httpBackend.expectGET("user/jobs").
      respond(jobs);
    $httpBackend.flush();
    expect(scope.jobs).toEqual(jobs);
  });
});
