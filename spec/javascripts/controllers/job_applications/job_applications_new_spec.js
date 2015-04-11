"use strict";

describe("JobApplicationsNewController", function() {
  var scope, controller, $httpBackend, jobs, jobApplications, JobDataService, contacts;

  beforeEach(module('getHired'));

  beforeEach(function() {
    this.addMatchers({
      toEqualJob: function(expected) {
        var props = ["id", "position", "company", "link"],
            actual = this.actual;
        this.message = function() {
          return "Expect " + JSON.stringify(actual) + " to equal job " + JSON.stringify(expected);
        };
        for (var i=0; i< props.length; i++) {
          var prop = props[i];
          if (actual[prop] !== expected[prop]) {
            return false;
          }
        }
        return true;
      },
      toEqualJobApplication: function(expected) {
        var props = ["id", "job_id", "user_id", "date_applied", "comments", "communication", "status"],
            actual = this.actual;
        this.message= function() {
          return "Expect " + JSON.stringify(actual) + " to equal job application " + JSON.stringify(expected);
        };
        for (var i=0; i< props.length; i++) {
          var prop = props[i];
          if (actual[prop] !== expected[prop]) {
            return false;
          }
        }
        return true;
      },
      toEqualContact: function(expected) {
        var props = ["id", "job_id", "user_id", "job_application_id", "first_name", "last_name", "email", "Hone_number"],
            actual = this.actual;
        this.message= function() {
          return "Expect " + JSON.stringify(actual) + " to equal job application " + JSON.stringify(expected);
        };
        for (var i=0; i< props.length; i++) {
          var prop = props[i];
          if (actual[prop] !== expected[prop]) {
            return false;
          }
        }
        return true;
      }
    });
  });

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobDataService_) {
    scope = $rootScope.$new();
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" },
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    contacts = [{id: 1, user_id: 1, job_id: 1, job_application_id: 1, first_name: "First", last_name: "Last", email: "first.last@email.com", phone_number: 0123456789 }];
    $httpBackend = _$httpBackend_;
    JobDataService = _JobDataService_;
    controller = $controller("JobApplicationsNewController", {$scope: scope});
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();
    
    expect(scope.jobData[0].job).toEqualJob(jobs[0]);
    expect(scope.jobData[1].job).toEqualJob(jobs[1]);
    expect(JobDataService.jobs()[0]).toEqualJob(jobs[0]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[1].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);

    expect(scope.jobData[1].contact).toEqualContact(contacts[0]);
    expect(JobDataService.contacts()[0]).toEqualContact(contacts[0]);
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

    expect(scope.jobData[0].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);

    expect(scope.jobData[0].contact).toEqualContact(contacts[0]);
    expect(JobDataService.contacts()[0]).toEqualContact(contacts[0]);
  });

  it("should handle failure when retrieving all job applications", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(400);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(scope.jobData[0].job).toEqualJob(jobs[0]);
    expect(scope.jobData[1].job).toEqualJob(jobs[1]);
    expect(JobDataService.jobs()[0]).toEqualJob(jobs[0]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[0].job_application).toBe(undefined);
    expect(JobDataService.jobApplications().length).toBe(0);

    expect(scope.jobData[1].contact).toEqualContact(contacts[0]);
    expect(JobDataService.contacts()[0]).toEqualContact(contacts[0]);
  });

  it("should handle failure when retrieving all contacts", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(400);
    $httpBackend.flush();

    expect(scope.jobData[0].job).toEqualJob(jobs[0]);
    expect(scope.jobData[1].job).toEqualJob(jobs[1]);
    expect(JobDataService.jobs()[0]).toEqualJob(jobs[0]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[1].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);
    
    expect(scope.jobData[1].contact).toBe(undefined);
    expect(JobDataService.contacts().length).toBe(0);
  });

  it("should create a new job application and its contact", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    var newContact = { id: 2, job_id: 2, job_application_id: 2, first_name: "John", last_name: "Doe", email: "john.doe@email.com", phone_number: 1234567890 };

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(JobDataService.jobApplications().length).toBe(1);
    expect(JobDataService.contacts().length).toBe(1);

    scope.createJobApplication(newApp, newContact);
    $httpBackend.expectPOST("/user/jobs/2/job_applications", {job_application: newApp}).
      respond(newApp);
    $httpBackend.expectPOST("/user/contacts", {contact: newContact}).
      respond(newContact);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobData[0].job_application).toEqualJobApplication(   newApp);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(newApp);

    expect(scope.jobData[0].contact).toEqualContact(newContact);
    expect(JobDataService.contacts()[0]).toEqualContact(newContact);

    expect(JobDataService.jobApplications().length).toBe(2);
    expect(JobDataService.contacts().length).toBe(2);
  });

  it("should handle failure when creating a new job application and its contact", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    var newContact = { id: 2, job_id: 3, job_application_id: 2, first_name: "John", last_name: "Doe", email: "john.doe@email.com", phone_number: 1234567890 };

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(JobDataService.jobApplications().length).toBe(1);
    expect(JobDataService.contacts().length).toBe(1);

    scope.createJobApplication(newApp, newContact);
    $httpBackend.expectPOST("/user/jobs/2/job_applications", {job_application: newApp}).
      respond(400);
    $httpBackend.flush();
    
    expect(JobDataService.jobApplications().length).toBe(1);
    expect(JobDataService.contacts().length).toBe(1);
  });
});

