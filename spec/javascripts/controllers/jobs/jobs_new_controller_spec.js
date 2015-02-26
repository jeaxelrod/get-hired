"use strict";

describe("JobsNewController", function() {
  var scope, controller, $httpBackend, JobsService, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobsService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    JobsService = _JobsService_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    controller = $controller("JobsNewController", { $scope: scope });
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

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link:"http://facebook.com" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    scope.createJob(newJob);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobs[0].toJSON()).toEqual(newJob);
  });

  it("should fail to create a new job if invalid link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    scope.createJob(newJob);
    $httpBackend.flush();

    expect(newJob.linkError).toBe(true);
    expect(scope.jobs).not.toContain(newJob);
  });
});
