"use strict";

describe("JobsDeleteController", function() {
  var scope, controller, $httpBackend, JobAPIService;

  beforeEach(module("getHired"));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should list all jobs");
  it("should respond to a failure to get jobs");
  it("should delete a job");
  it("should handle failures to delete a job");
});
