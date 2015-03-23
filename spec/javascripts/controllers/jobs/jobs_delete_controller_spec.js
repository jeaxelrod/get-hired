"use strict";

describe("JobsDeleteController", function() {
  var scope, controller, $httpBackend, jobs, jobApplications, JobDataService, contacts;

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
  var compareContacts = function(actualContact, expectedContact) {
    var props = ["id", "job_id", "user_id", "job_application_id", "first_name", "last_name", "email", "phone_number"];
    for (var i=0; i < props.length; i++) {
      var prop = props[i];
      expect(actualContact[prop]).toEqual(expectedContact[prop]);
    }
  };

  beforeEach(module("getHired"));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobDataService_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    JobDataService = _JobDataService_;
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" }, 
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    contacts = [{id: 1, user_id: 1, job_id: 1, job_application_id: 1, first_name: "First", last_name: "Last", email: "first.last@email.com", phone_number: 0123456789 }];


    controller = $controller("JobsDeleteController", { $scope: scope});
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();
    
    compareJobs(scope.jobData[0].job, jobs[0]);
    compareJobs(scope.jobData[1].job, jobs[1]);
    compareJobs(JobDataService.jobs()[0], jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[1]);

    compareJobApplications(scope.jobData[1].job_application, jobApplications[0]);
    compareJobApplications(JobDataService.jobApplications()[0], jobApplications[0]);

    compareContacts(scope.jobData[1].contact, contacts[0]);
    compareContacts(JobDataService.contacts()[0], contacts[0]);
  });

  it("should handle failure when retrieving all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();


    expect(scope.jobData[0].job).toBe(undefined);

    compareJobApplications(scope.jobData[0].job_application, jobApplications[0]);
    compareJobApplications(JobDataService.jobApplications()[0], jobApplications[0]);

    compareContacts(scope.jobData[0].contact, contacts[0]);
    compareContacts(JobDataService.contacts()[0], contacts[0]);
  });

  it("should handle failure when retrieving all job applications", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(400);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    compareJobs(scope.jobData[0].job, jobs[0]);
    compareJobs(scope.jobData[1].job, jobs[1]);
    compareJobs(JobDataService.jobs()[0], jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[1]);

    expect(scope.jobData[0].job_application).toBe(undefined);
    expect(JobDataService.jobApplications().length).toBe(0);

    compareContacts(scope.jobData[1].contact, contacts[0]);
    compareContacts(JobDataService.contacts()[0], contacts[0]);
  });

  it("should handle failure when retrieving all contacts", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(400);
    $httpBackend.flush();

    compareJobs(scope.jobData[0].job, jobs[0]);
    compareJobs(scope.jobData[1].job, jobs[1]);
    compareJobs(JobDataService.jobs()[0], jobs[0]);
    compareJobs(JobDataService.jobs()[1], jobs[1]);

    compareJobApplications(scope.jobData[1].job_application, jobApplications[0]);
    compareJobApplications(JobDataService.jobApplications()[0], jobApplications[0]);
    
    expect(scope.jobData[1].contact).toBe(undefined);
    expect(JobDataService.contacts().length).toBe(0);
  });;

  it("should delete a job", function() {
    var job = jobs[0];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(scope.jobData.length).toBe(2);
    expect(JobDataService.data().length).toBe(2);

    $httpBackend.expectDELETE("/user/jobs/" + job.id).
      respond(204);
    scope.deleteJob(job);
    $httpBackend.flush();
    
    expect(scope.jobData.length).toBe(1);
    expect(JobDataService.data().length).toBe(1);
  });

  it("should handle failures to delete a job", function() {
    var job = jobs[0];
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.expectDELETE("/user/jobs/" + job.id ).
      respond(400, { errors: "Failure to delete job" });

    scope.deleteJob(job);
    $httpBackend.flush();

    expect(scope.jobData.length).toBe(2);
    expect(JobDataService.data().length).toBe(2);
  });
});
