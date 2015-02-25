"use strict";

describe("JobService", function() {
  var JobService, $httpBackend, jobs;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobService_, _$httpBackend_) {
    JobService = _JobService_;
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]

  }));

  it("should list all jobs", function() {
    expect(JobService.jobs()).toEqual([]);
  });

  it("should set jobs", function() {
    JobService.setJobs(jobs);
    expect(JobService.jobs()).toEqual(jobs);
  });

  it("should retrieve all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    var response = JobService.getJobs();
    $httpBackend.flush();
    expect(response[0].toJSON()).toEqual(jobs[0]);
    expect(response[1].toJSON()).toEqual(jobs[1]);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);
    var response = JobService.createJob(newJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJob);
  });

  it("should fail to create a new job if invalid attribute link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    var response = JobService.createJob(newJob);
    $httpBackend.flush();
    
    // A failed create response just returns the data it was given
    expect(response.job).toBe(newJob);
  });

  it("should edit a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                    position: "Software Engineer",
                    company:  job.company,
                    link:     job.link }
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(editJob);

    var response = JobService.editJob(editJob);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(editJob);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                   position: job.position,
                   company:  job.company,
                   link:     "meow" }
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(400, {errors: {link: ["Invalid url" ]}});

    var response = JobService.editJob(editJob);
    $httpBackend.flush();

    expect(response.job).toBe(editJob);
  });

  it("should delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    
    var response = JobService.deleteJob(job);
    $httpBackend.flush();

    // Don't know a better way to test this thing
    expect(response.$resolved).toBe(true);
  });

  it("should handle failures to delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, { errors: "Failure to delete job"});
    
    var response = JobService.deleteJob(job);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true)
  });
});
