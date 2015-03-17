"use strict";

describe("JobApplicationsNewController", function() {
  var scope, controller, $httpBackend, jobs, jobApplications, JobDataService;

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

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobDataService_) {
    scope = $rootScope.$new();
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" },
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    $httpBackend = _$httpBackend_;
    JobDataService = _JobDataService_;
    controller = $controller("JobApplicationsNewController", {$scope: scope});
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

  it("should create a new job application", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.flush();

    expect(JobDataService.jobApplications().length).toBe(1);

    scope.createJobApplication(newApp);
    $httpBackend.expectPOST("/user/jobs/2/job_applications", {job_application: newApp}).
      respond(newApp);
    $httpBackend.flush();
    scope.$digest();

    compareJobApplications(scope.jobData[0].job_application, newApp);
    expect(JobDataService.jobApplications().length).toBe(2);
  });

  it("should handle failure when creating a new job application", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.flush();

    expect(JobDataService.jobApplications().length).toBe(1);

    scope.createJobApplication(newApp);
    $httpBackend.expectPOST("/user/jobs/2/job_applications", {job_application: newApp}).
      respond(400);
    $httpBackend.flush();
    
    expect(JobDataService.jobApplications().length).toBe(1);
  });
});

