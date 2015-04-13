"use strict";

describe("JobsEditController", function() {
  var scope, controller, $httpBackend, JobDataService, jobs, jobApplications, contacts;

  beforeEach(module("getHired"));

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
    $httpBackend = _$httpBackend_;
    JobDataService = _JobDataService_;
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" },
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    contacts = [{id: 1, user_id: 1, job_id: 1, job_application_id: 1, first_name: "First", last_name: "Last", email: "first.last@email.com", phone_number: 0123456789 }];
    controller = $controller("JobsEditController", { $scope: scope });
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

  it("should edit a job", function() {
    var job = jobs[0]; 
    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(scope.jobData[0].job).toEqualJob(     jobs[0]);
    expect(JobDataService.jobs()[0]).toEqualJob(jobs[0]);

    $httpBackend.expectPUT("/user/jobs/2", {job: editJob}).
      respond(editJob);
    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobData[0].job).toEqualJob(     editJob);
    expect(JobDataService.jobs()[0]).toEqualJob( editJob);
  });

  it("should handle failed edits of a job", function() {
    var job = jobs[0]; 
    var editJob = { id:       job.id,
                    position: job.position,
                    company:  job.company,
                    link:     "fcebk.com" };
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.expectPUT("/user/jobs/2", {job: editJob}).
      respond(400, {errors: {link: ["Invalid url"]}});

    scope.editJob(editJob);
    $httpBackend.flush();
    scope.$digest();
    job.linkError = true;
   
    expect(scope.jobData[0].job).toEqualJob(jobs[0]);
    expect(scope.jobData[0].linkError).toBe(true);
  });
  
  it("should edit a job ,job application, and contacts", function() {
    var job = jobs[1]; 
    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    var app = jobApplications[0];
    var editApp = { id:            app.id,
                    user_id:       app.user_id,
                    job_id:        app.job_id,
                    date_applied:   app.date_applied,
                    comments:      "New Comments",
                    communication: app.communication,
                    status:        "Interviewing" };
    var contact = contacts[0];
    var editContact = { id:                 contact.id,
                        user_id:            contact.user_id,
                        job_id:             contact.job_id,
                        job_application_id: contact.job_application_id,
                        first_name:         "New",
                        last_name:          contact.last_name,
                        email:              "new.last@email.com",
                        phone_number:       contact.phone_number };


    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);
    $httpBackend.flush();

    expect(scope.jobData[1].job).toEqualJob(    jobs[1]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[1].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);

    expect(scope.jobData[1].contact).toEqualContact(contacts[0]);
    expect(JobDataService.contacts()[0]).toEqualContact(contacts[0]);

    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(editJob);
    $httpBackend.expectPUT("/user/jobs/1/job_applications/1", {job_application: editApp}).
      respond(editApp);
    $httpBackend.expectPUT("/user/contacts/1", {contact: editContact}).
      respond(editContact);

    scope.editJobAppContact(editJob, editApp, editContact);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobData[1].job).toEqualJob(     editJob);
    expect(JobDataService.jobs()[1]).toEqualJob(editJob);
    expect(scope.jobData[1].job_application).toEqualJobApplication(   editApp);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(editApp);
    expect(scope.jobData[1].contact).toEqualContact(    editContact);
    expect(JobDataService.contacts()[0]).toEqualContact(editContact);
  });

  it("should create a contact if it doesn't exist already", function() {
    var job = jobs[1]; 
    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    var app = jobApplications[0];
    var editApp = { id:            app.id,
                    user_id:       app.user_id,
                    job_id:        app.job_id,
                    date_applied:   app.date_applied,
                    comments:      "New Comments",
                    communication: app.communication,
                    status:        "Interviewing" };
    var newContact = contacts[0];
    newContact.id = null;

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond([]);
    $httpBackend.flush();

    expect(scope.jobData[1].job).toEqualJob(    jobs[1]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[1].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);

    expect(scope.jobData[1].contact).toBe(undefined);
    expect(JobDataService.contacts().length).toBe(0);

    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(editJob);
    $httpBackend.expectPUT("/user/jobs/1/job_applications/1", {job_application: editApp}).
      respond(editApp);
    $httpBackend.expectPOST("/user/contacts", {contact: newContact}).
      respond(newContact);

    scope.editJobAppContact(editJob, editApp, newContact);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobData[1].job).toEqualJob(     editJob);
    expect(JobDataService.jobs()[1]).toEqualJob(editJob);

    expect(scope.jobData[1].job_application).toEqualJobApplication(   editApp);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(editApp);

    expect(scope.jobData[1].contact).toEqualContact(    newContact);
    expect(JobDataService.contacts()[0]).toEqualContact(newContact);
  });

  it("should edit a job without a contact", function() {
    var job = jobs[1]; 
    var editJob = { id:       job.id,  
                    position: "Software Engineer", 
                    company:  job.company, 
                    link:     job.link };
    var app = jobApplications[0];
    var editApp = { id:            app.id,
                    user_id:       app.user_id,
                    job_id:        app.job_id,
                    date_applied:   app.date_applied,
                    comments:      "New Comments",
                    communication: app.communication,
                    status:        "Interviewing" };

    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);
    $httpBackend.expectGET("/user/contacts").
      respond([]);
    $httpBackend.flush();

    expect(scope.jobData[1].job).toEqualJob(    jobs[1]);
    expect(JobDataService.jobs()[1]).toEqualJob(jobs[1]);

    expect(scope.jobData[1].job_application).toEqualJobApplication(jobApplications[0]);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(jobApplications[0]);

    expect(scope.jobData[1].contact).toBe(undefined);
    expect(JobDataService.contacts().length).toBe(0);

    $httpBackend.expectPUT("/user/jobs/1", {job: editJob}).
      respond(editJob);
    $httpBackend.expectPUT("/user/jobs/1/job_applications/1", {job_application: editApp}).
      respond(editApp);

    scope.editJobAppContact(editJob, editApp, undefined);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobData[1].job).toEqualJob(     editJob);
    expect(JobDataService.jobs()[1]).toEqualJob(editJob);

    expect(scope.jobData[1].job_application).toEqualJobApplication(   editApp);
    expect(JobDataService.jobApplications()[0]).toEqualJobApplication(editApp);

    expect(scope.jobData[1].contact).toBe(undefined);
    expect(JobDataService.contacts().length).toBe(0);
  });
});
