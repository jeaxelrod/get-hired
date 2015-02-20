"use strict";

describe("JobsIndexController", function() {
  var scope, controller, $httpBackend, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should lists all jobs", function() {
    $httpBackend.flush();
    var filteredJobs = [
      { position: jobs[0].position, company: jobs[0].company, link: jobs[0].link },
      { position: jobs[1].position, company: jobs[1].company, link: jobs[1].link }
    ];
    expect(scope.jobs).toEqual(filteredJobs);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link:"http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);
    scope.createJob(newJob);
    $httpBackend.flush();
    scope.$digest();
    expect(scope.jobs).toContain(newJob);
  });

  it("should edit a job", function() {

  });

  it("should add new jobs form", function() {
    $httpBackend.flush();
    expect(scope.newJob).toEqual([]);
    scope.addNewJob();
    scope.addNewJob();
    expect(scope.newJob.length).toBe(2);
    expect(scope.newJob).toEqual([{id: 1, job:{}}, {id: 2, job: {}}]);
  });

  it("should delete the correct new jobs form", function() {
    $httpBackend.flush();
    scope.addNewJob();
    scope.addNewJob();
    scope.addNewJob();
    scope.subtractNewJob(2);

    expect(scope.newJob.length).toBe(2);
    expect(scope.newJob).toEqual([{id: 1, job: {}}, {id: 3, job: {}}]);
  });

  it("should not delete a new job form if id isn't present", function() {
    $httpBackend.flush();
    scope.addNewJob();
    scope.subtractNewJob(2);
    
    expect(scope.newJob.length).toBe(1);
    expect(scope.newJob).toEqual([{id: 1, job: {}}]);
  });

  it("creating a new job from form should delete that form after job is create", function() {
    $httpBackend.flush();
    scope.addNewJob();
    var newJob = scope.newJob[0];
    newJob.job = { position: "Internship", company: "Facebook", link:"http://facebook.com" };
    expect(scope.newJob.length).toBe(1);

    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob.job);
    scope.createJob(newJob);
    $httpBackend.flush();
    expect(scope.newJob.length).toBe(0);
    expect(scope.jobs).toContain(newJob.job);
  });

  it("creating new job from form should create a link error if link is invalid", function() {
    $httpBackend.flush();
    scope.addNewJob();
    var newJob = scope.newJob[0];
    newJob.job = { position: "Internship", company: "Facebook", link: "facebook.com" };

    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});
    scope.createJob(newJob);
    $httpBackend.flush();

    expect(newJob.linkError).toBe(true);
    expect(scope.jobs).not.toContain(newJob.job);
  });
});
