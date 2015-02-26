"use strict";

describe("JobAPIService", function() {
  var JobAPIService, $httpBackend, jobs;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobAPIService_, _$httpBackend_) {
    JobAPIService = _JobAPIService_;
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]

  }));

  it("should list all jobs", function() {
    expect(JobAPIService.jobs()).toEqual([]);
  });

  it("should set jobs", function() {
    JobAPIService.setJobs(jobs);
    expect(JobAPIService.jobs()).toEqual(jobs);
  });

  it("should retrieve all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);

    var response = JobAPIService.getJobs();
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobs[0]);
    expect(response[1].toJSON()).toEqual(jobs[1]);
  });

  it("should call success callback when getting all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    var callbackCalled = false;
    var successCallback = function(response) {
      callbackCalled = true;
    };
    var response = JobAPIService.getJobs(successCallback);
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobs[0]);
    expect(response[1].toJSON()).toEqual(jobs[1]);
    expect(callbackCalled).toBe(false);
  });

  it("should call failure callback when failing to get all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    var callbackCalled = false;
    var successCallback = function(response) {};
    var failureCallback = function(response) {
      callbackCalled = true;
    };

    var response = JobAPIService.getJobs(successCallback, failureCallback);
    $httpBackend.flush();
    
    expect(callbackCalled).toBe(true);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    var response = JobAPIService.createJob(newJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJob);
  });

  it("should fail to create a new job if invalid attribute link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    var response = JobAPIService.createJob(newJob);
    $httpBackend.flush();
    
    // A failed create response just returns the data it was given
    expect(response.job).toBe(newJob);
  });
  
  it("creates new jobs and calls the success callback", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    var callbackCalled = false;
    var callback = function(response) {
      callbackCalled = true;
    }
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    var response = JobAPIService.createJob(newJob, callback);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJob);
    expect(callbackCalled).toBe(true);
  });

  it("fails to create new jobs and calls the failure callback", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    var callbackCalled = false;
    var successCallback = function(response) {
    };
    var failureCallback = function(response) {
      callbackCalled = true;
    };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    var response = JobAPIService.createJob(newJob, successCallback, failureCallback);
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

    var response = JobAPIService.editJob(editJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(editJob);
  });

  it("should edit a job and call the success callback", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                    position: "Software Engineer",
                    company:  job.company,
                    link:     job.link }
    var callbackCalled = false;
    var successCallback = function(response) {
      callbackCalled = true;
    }
      
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(editJob);

    var response = JobAPIService.editJob(editJob, successCallback);
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

    var response = JobAPIService.editJob(editJob);
    $httpBackend.flush();

    expect(response.job).toBe(editJob);
  });

  it("should handle failed edits of a job and call the failure callback", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                   position: job.position,
                   company:  job.company,
                   link:     "meow" }
    var callbackCalled = false;
    var successCallback = function(response) {};
    var failureCallback = function(response) {
      callbackCalled = true;
    };
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(400, {errors: {link: ["Invalid url" ]}});

    var response = JobAPIService.editJob(editJob, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.job).toBe(editJob);
    expect(callbackCalled).toBe(true);
  });

  it("should delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    
    var response = JobAPIService.deleteJob(job);
    $httpBackend.flush();

    // Don't know a better way to test this thing
    expect(response.$resolved).toBe(true);
  });

  it("should delete jobs and call the success callback", function() {
    var job = jobs[0];
    var callbackCalled = false;
    var successCallback = function(response) {
      callbackCalled = true;
    };
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    
    var response = JobAPIService.deleteJob(job, successCallback);
    $httpBackend.flush();

    // Don't know a better way to test this thing
    expect(response.$resolved).toBe(true);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failures to delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, { errors: "Failure to delete job"});
    
    var response = JobAPIService.deleteJob(job);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true)
  });

  it("should handle failures to delete jobs and call the failure callback", function() {
    var job = jobs[0];
    var callbackCalled = false;
    var successCallback = function(response) {};
    var failureCallback = function(response) {
      callbackCalled = true;
    }
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, { errors: "Failure to delete job"});
    
    var response = JobAPIService.deleteJob(job, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true)
    expect(callbackCalled).toBe(true);
  });
    
});
