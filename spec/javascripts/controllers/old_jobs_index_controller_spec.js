"use strict";

describe("JobsIndexController", function() {
  var scope, controller, $httpBackend, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should lists all jobs", function() {
    $httpBackend.flush();
    expect(scope.jobs).toEqual(jobs);
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

  it("should fail to create new job if invalid link", function() {
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

  it("should edit a job", function() {
    var job = jobs[0]; 

    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(editJob);
    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobs).toContain(editJob);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0]; 

    var editJob = { id:       job.id,
                    position: job.position,
                    company:  job.company,
                    link:     "fcebk.com" };
    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(400, {errors: {link: ["Invalid url"]}});
    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();
   
    job.linkError = true;
    expect(scope.jobs).not.toContain(editJob);
    expect(scope.jobs).toContain(job);
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
  
  it("should delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);

    scope.deleteJob(job);
    $httpBackend.flush();
    
    expect(scope.jobs).not.toContain(job);
  });

  it("should handle failures to delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id ).
      respond(400, { errors: "Failure to delete job" });
    scope.deleteJob(job);

    $httpBackend.flush();

    expect(scope.jobs).toContain(job);
  });
});
