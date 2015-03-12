"use strict";

describe("JobsService", function() {
  var JobsService, $httpBackend, jobs, callbackCalled, successCallback, failureCallback;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobsService_, _$httpBackend_) {
    JobsService = _JobsService_;
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]

    callbackCalled = false;
    successCallback = function(response) {
      callbackCalled = true;
    }
    failureCallback = function(response) {
      callbackCalled = true;
    }
  }));

  it("should retrieve all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);

    var response = JobsService.getJobs();
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobs[0]);
    expect(response[1].toJSON()).toEqual(jobs[1]);
  });

  it("should call success callback when getting all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    failureCallback = function() {};
    var response = JobsService.getJobs(successCallback, failureCallback);
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobs[0]);
    expect(response[1].toJSON()).toEqual(jobs[1]);
    expect(callbackCalled).toBe(true);
  });

  it("should call failure callback when failing to get all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    successCallback = function(response) {};

    var response = JobsService.getJobs(successCallback, failureCallback);
    $httpBackend.flush();
    
    expect(callbackCalled).toBe(true);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    var response = JobsService.createJob(newJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJob);
  });

  it("should fail to create a new job if invalid attribute link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    var response = JobsService.createJob(newJob);
    $httpBackend.flush();
    
    // A failed create response just returns the data it was given
    expect(response.job).toBe(newJob);
  });
  
  it("creates new jobs and calls the success callback", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    var response = JobsService.createJob(newJob, successCallback);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJob);
    expect(callbackCalled).toBe(true);
  });

  it("fails to create new jobs and calls the failure callback", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    successCallback = function(response) {
    };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    var response = JobsService.createJob(newJob, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.job).toEqual(newJob);
    expect(callbackCalled).toBe(true);
  });

  it("should edit a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                    position: "Software Engineer",
                    company:  job.company,
                    link:     job.link }
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(editJob);

    var response = JobsService.editJob(editJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(editJob);
  });

  it("should edit a job and call the success callback", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                    position: "Software Engineer",
                    company:  job.company,
                    link:     job.link }
      
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(editJob);

    var response = JobsService.editJob(editJob, successCallback);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(editJob);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                   position: job.position,
                   company:  job.company,
                   link:     "meow" }
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(400, {errors: {link: ["Invalid url" ]}});

    var response = JobsService.editJob(editJob);
    $httpBackend.flush();

    expect(response.job).toBe(editJob);
  });

  it("should handle failed edits of a job and call the failure callback", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                   position: job.position,
                   company:  job.company,
                   link:     "meow" }
    successCallback = function(response) {};
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(400, {errors: {link: ["Invalid url" ]}});

    var response = JobsService.editJob(editJob, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.job).toBe(editJob);
    expect(callbackCalled).toBe(true);
  });

  it("should delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    
    var response = JobsService.deleteJob(job);
    $httpBackend.flush();

    // Don't know a better way to test this thing
    expect(response.$resolved).toBe(true);
  });

  it("should delete jobs and call the success callback", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    
    var response = JobsService.deleteJob(job, successCallback);
    $httpBackend.flush();

    // Don't know a better way to test this thing
    expect(response.$resolved).toBe(true);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failures to delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, { errors: "Failure to delete job"});
    
    var response = JobsService.deleteJob(job);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true)
  });

  it("should handle failures to delete jobs and call the failure callback", function() {
    var job = jobs[0];
    successCallback = function(response) {};
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, { errors: "Failure to delete job"});
    
    var response = JobsService.deleteJob(job, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true)
    expect(callbackCalled).toBe(true);
  });
    
});
