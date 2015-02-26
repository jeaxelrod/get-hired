"use strict";

describe("JobsEditController", function() {
  var scope, controller, $httpBackend, JobsService, jobs;

  beforeEach(module("getHired"));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobsService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    JobsService = _JobsService_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    controller = $controller("JobsEditController", { $scope: scope });
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

  it("should edit a job", function() {
    var job = jobs[0]; 
    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(editJob);

    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobs[0].toJSON()).toEqual(editJob);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0]; 
    var editJob = { id:       job.id,
                    position: job.position,
                    company:  job.company,
                    link:     "fcebk.com" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(400, {errors: {link: ["Invalid url"]}});

    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();
    job.linkError = true;
   
    expect(scope.jobs).not.toContain(editJob);
    expect(scope.jobs[0].toJSON()).toEqual(job);
  });

});
