"use strict";

describe("JobsNewController", function() {
  var scope, controller, $httpBackend, JobAPIService, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobAPIService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    JobAPIService = _JobAPIService_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsNewController", { $scope: scope });
  }));

  it("should list all jobs");
  it("should handle failure when retrieving all jobs");
  it("should create new jobs");
  it("should fail to create a new job if invalid link");
});
