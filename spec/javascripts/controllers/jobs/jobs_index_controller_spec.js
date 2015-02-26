"use strict"

describe("JobsIndexController", function() {
  var scope, controller, $httpBackend, JobAPIService, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobAPIService_) {
    scope = $rootScope.$new();
    $httpBacked = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should list all jobs");
  it("should handle errors if can't retrieve jobs");
});
