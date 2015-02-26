"use strict";

describe("JobsDeleteController", function() {
  var scope, controller, $httpBackend, JobAPIService, jobs;

  beforeEach(module("getHired"));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    controller = $controller("JobsDeleteController", { $scope: scope});
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.flush();

    expect(scope.jobs[0].toJSON()).toEqual(jobs[0]);
    expect(scope.jobs[1].toJSON()).toEqual(jobs[1]);
  });

  it("should handle failure when retrieving all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    $httpBackend.flush();

    expect(scope.jobs).not.toEqual(jobs);
  });

  it("should delete a job", function() {
    var job = jobs[0];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);

    scope.deleteJob(job);
    $httpBackend.flush();
    
    expect(scope.jobs).not.toContain(job);
  });

  it("should handle failures to delete a job", function() {
    var job = jobs[0];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectDELETE("/user/jobs/" + job.id ).
      respond(400, { errors: "Failure to delete job" });

    scope.deleteJob(job);
    $httpBackend.flush();

    expect(scope.jobs[0].toJSON()).toEqual(job);
  });
});
