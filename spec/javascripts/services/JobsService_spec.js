"use strict";

describe("JobsService", function() {
  var JobsService, $httpBackend, jobs, setResponse, emptyCallback, response;
  var compareJobs = function(oldJob, newJob) {
    var props = ['id', 'position', 'company', 'link'];
    for (var i=0; i < props.length; i++) {
      var prop = props[i];
      expect(oldJob[prop]).toEqual(newJob[prop]);
    }
  };

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobsService_, _$httpBackend_) {
    JobsService = _JobsService_;
    $httpBackend = _$httpBackend_;
    response = undefined;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]

    setResponse = function(data) {
      response = data;
    };
    emptyCallback = function(data) {
    };
  }));

  it("should retrieve all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    var fetchedJobs;

    JobsService.getJobs().then(setResponse);
    $httpBackend.flush();
    
    compareJobs(response[0], jobs[0]);
    compareJobs(response[1], jobs[1]);
  });

  it("should call failure callback when failing to get all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);

    JobsService.getJobs().then(emptyCallback, setResponse);
    $httpBackend.flush();
    
    expect(response.status).toBe(400);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    JobsService.createJob(newJob).then(setResponse);
    $httpBackend.flush();

    compareJobs(response, newJob);
  });

  it("should fail to create a new job if invalid attribute link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };
    var errorData = {errors: {link: ["invalid url"]}};
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, errorData);

    JobsService.createJob(newJob).then(emptyCallback, setResponse);
    $httpBackend.flush();
    
    expect(response.data).toEqual(errorData);
  });
  
  it("should edit a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                    position: "Software Engineer",
                    company:  job.company,
                    link:     job.link }
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(editJob);

    JobsService.editJob(editJob).then(setResponse);
    $httpBackend.flush();

    compareJobs(response, editJob);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0];
    var editJob = { id:       job.id,
                   position: job.position,
                   company:  job.company,
                   link:     "meow" }
    var errorData = {errors: {link: ["Invalid url" ]}};
    $httpBackend.expectPUT("/user/jobs/" + job.id, {job: editJob}).
      respond(400, errorData);

    JobsService.editJob(editJob).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.data).toEqual(errorData);
  });

  it("should delete jobs", function() {
    var job = jobs[0];
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    response = "Not undefined";

    expect(response).toBe("Not undefined");
    JobsService.deleteJob(job).then(setResponse);
    $httpBackend.flush();

    expect(response).toBe(undefined);
  });

  it("should handle failures to delete jobs", function() {
    var job = jobs[0];
    var errorData = { errors: "Failure to delete jobs" };
    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(400, errorData);
    
    JobsService.deleteJob(job).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.data).toEqual(errorData)
  });
});
