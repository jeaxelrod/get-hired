"use strict";

describe("JobsNewController", function() {
  var scope, controller, $httpBackend, JobsService, jobs, JobDataService, jobApplications;
  var compareJobs = function(actualJob, expectedJob) {
    var props = ["id", "position", "company", "link"];
    for (var i=0; i< props.length; i++) {
      var prop = props[i];
      expect(actualJob[prop]).toEqual(expectedJob[prop]);
    }
  };
  var compareJobApplications = function(actualApp, expectedApp) {
    var props = ["id", "job_id", "user_id", "date_applied", "comments", "communication", "status"];
    for (var i =0; i < props.length; i++) {
      var prop = props[i];
      expect(actualApp[prop]).toEqual(expectedApp[prop]);
    }
  };

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobsService_, _JobDataService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    JobsService = _JobsService_;
    JobDataService = _JobDataService_;
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" },
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    controller = $controller("JobsNewController", { $scope: scope });
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.flush();

    compareJobs(scope.jobData[0].job, jobs[0]);
    compareJobs(scope.jobData[1].job, jobs[1]);
    compareJobs(JobDataService.jobs()[0], jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[1]);

    compareJobApplications(scope.jobData[1].job_application, jobApplications[0]);
    compareJobApplications(JobDataService.jobApplications()[0], jobApplications[0]);
  });

  it("should handle failure when retrieving all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.flush();

    expect(scope.jobData[0].job).toBe(undefined);
    compareJobApplications(scope.jobData[0].job_application, jobApplications[0]);
    compareJobApplications(JobDataService.jobApplications()[0], jobApplications[0]);
  });

  it("should handle failure when retrieving all job applications", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(400);
    $httpBackend.flush();

    compareJobs(scope.jobData[0].job, jobs[0]);
    compareJobs(scope.jobData[1].job, jobs[1]);
    compareJobs(JobDataService.jobs()[0], jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[1]);

    expect(scope.jobData[0].job_application).toBe(undefined);
    expect(JobDataService.jobApplications().length).toBe(0);
  });

  it("should create new jobs", function() {
    var newJob = { id: 3, position: "Internship", company: "Facebook", link:"http://facebook.com" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);

    scope.createJob(newJob);
    $httpBackend.flush();
    scope.$digest();

    compareJobs(scope.jobData[0].job, newJob);
    compareJobs(JobDataService.jobs()[0], newJob);
    compareJobs(scope.jobData[1].job, jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[0]);
  });

  it("should fail to create a new job if invalid link", function() {
    var newJob = { position: "Internship", company: "Facebook", link: "facebook.com" };

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    scope.createJob(newJob);
    $httpBackend.flush();

    expect(newJob.linkError).toBe(true);
    expect(scope.jobData.length).toBe(2);
  });

  it("should create new job and its job application", function() {
    var newJob = { id: 3, position: "Internship", company: "Facebook", link: "http://facebook.com" }
    var newApp = { id: 2, date_applied: Date.now(), comments: "Applied online", communication: "meow", status: "Denied" };

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.flush();

    expect(scope.jobData.length).toBe(2);

    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);
    $httpBackend.expectPOST("/user/jobs/3/job_applications", {job_application: newApp}).
      respond(newApp);

    scope.createJobAndApp(newJob, newApp);
    $httpBackend.flush();

    expect(scope.jobData.length).toBe(3);
    compareJobs(scope.jobData[0].job, newJob);
    compareJobs(JobDataService.jobs()[0], newJob);

    compareJobApplications(scope.jobData[0].job_application, newApp);
    compareJobApplications(JobDataService.jobApplications()[0], newApp);
  });

  it("should fail to create a new job and job application if invalid link", function() {
    var newJob = { id: 3, position: "Internship", company: "Facebook", link: "facebook.com" }
    var newApp = { id: 2, job_id: 3, date_applied: Date.now(), comments: "Applied online", communication: "meow", status: "Denied" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(422, {errors: {link: ["invalid url"]}});

    scope.createJobAndApp(newJob, newApp);
    $httpBackend.flush();

    expect(newJob.linkError).toBe(true);
    expect(scope.jobData.length).toBe(2);
  });
});
