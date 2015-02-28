"use strict";

describe("JobApplicationsService", function() {
  var JobApplicationsService, JobsService, $httpBackend, jobApplications, callbackCalled, successCallback, failureCallback;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobApplicationsService_,  _JobsService_, _$httpBackend_) {
    JobApplicationsService = _JobApplicationsService_;
    JobsService = _JobsService_;
    $httpBackend = _$httpBackend_;
    jobApplications = [{ id:            1, 
                         job_id:        1, 
                         user_id:       1, 
                         data_applied:  Date.now(), 
                         comments:      "Some comments",
                         communication: "Person",
                         status:        "Active" }];
      callbackCalled = false;
      successCallback = function(response) {
        callbackCalled = true;
      };
      failureCallback = function(response) {
        callbackCalled = true;
      };
  }));

  it("should list all job applications", function() {
    expect(JobApplicationsService.jobApplications()).toEqual([]); 
  });

  it("should set all job applications", function() {
    JobApplicationsService.setJobApplications(jobApplications);
    expect(JobApplicationsService.jobApplications()).toEqual(jobApplications);
  });

  it("should retrieve all job applications", function() {
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);

    var response = JobApplicationsService.getJobApplications(successCallback);
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobApplications[0]);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failure to retrieve all job applications", function() {
    $httpBackend.expectGET("/user/job_applications").
      respond(400);
    successCallback = function() {};

    var response = JobApplicationsService.getJobApplications(successCallback, failureCallback);
    $httpBackend.flush();
    
    expect(callbackCalled).toBe(true);
  });

  it("should retrieve all job applications for a job", function() {
    var job_id = jobApplications[0].job_id;
    $httpBackend.expectGET("/user/jobs/" + job_id + "/job_applications").
      respond(jobApplications);

    var response = JobApplicationsService.getJobApplications({ job_id: job_id }, successCallback);
    $httpBackend.flush();

    expect(response[0].toJSON()).toEqual(jobApplications[0]);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failure to retrieve all job applications for a job", function() {
    var job_id = jobApplications[0].job_id;
    $httpBackend.expectGET("/user/jobs/" + job_id + "/job_applications").
      respond(400);
    successCallback = function() {};

    var response = JobApplicationsService.getJobApplications({ job_id: job_id }, successCallback, failureCallback);
    $httpBackend.flush();

    expect(callbackCalled).toBe(true);
  });

  it("should create new job applications", function() {
    var newJobApplication = jobApplications[0];
    $httpBackend.expectPOST("/user/jobs/" + newJobApplication.job_id + "/job_applications", {job_application: newJobApplication}).
      respond(newJobApplication);

    var response = JobApplicationsService.createJobApplication(newJobApplication, successCallback);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(newJobApplication);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failure when creating new job applications", function() {
    var newJobApplication = jobApplications[0];
    $httpBackend.expectPOST("/user/jobs/" + newJobApplication.job_id + "/job_applications", {job_application: newJobApplication}).
      respond(400);
    successCallback = function() {};

    var response = JobApplicationsService.createJobApplication( newJobApplication, successCallback, failureCallback);
    $httpBackend.flush()

    expect(response.job_application).toEqual(newJobApplication);
    expect(callbackCalled).toBe(true);
  });

  it("should should edit a job application", function() {
    var jobApplication = jobApplications[0];
    var editJobApplication =  { id:            jobApplication.id, 
                                job_id:        jobApplication.job_id, 
                                user_id:       jobApplication.user_id, 
                                data_applied:  jobApplication.date_applied, 
                                comments:      "Different comments",
                                communication: jobApplication.communication,
                                status:        "Denied" }
    $httpBackend.expectPUT("/user/jobs/" + jobApplication.job_id + "/job_applications/" + jobApplication.id, {job_application: editJobApplication}).
      respond(editJobApplication);

    var response = JobApplicationsService.editJobApplication(editJobApplication, successCallback);
    $httpBackend.flush();

    expect(response.toJSON()).toEqual(editJobApplication);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failure when editing a job application", function() {
    var jobApplication = jobApplications[0];
    var editJobApplication =  { id:            jobApplication.id, 
                                job_id:        jobApplication.job_id, 
                                user_id:       jobApplication.user_id, 
                                data_applied:  jobApplication.date_applied, 
                                comments:      "Different comments",
                                communication: jobApplication.communication,
                                status:        "Denied" }
    $httpBackend.expectPUT("/user/jobs/" + jobApplication.job_id + "/job_applications/" + jobApplication.id, {job_application: editJobApplication}).
      respond(400);
    successCallback = function() {};
    
    var response = JobApplicationsService.editJobApplication(editJobApplication, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.job_application).toEqual(editJobApplication);
    expect(callbackCalled).toBe(true);
  });

  it("should should delete a job application", function() {
    var jobApplication = jobApplications[0];
    $httpBackend.expectDELETE("/user/jobs/" +  jobApplication.job_id + "/job_applications/" + jobApplication.id).
      respond(204);

    var response = JobApplicationsService.deleteJobApplication(jobApplication, successCallback);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true);
    expect(callbackCalled).toBe(true);
  });

  it("should handle failure when deleting a job application", function() {
    var jobApplication = jobApplications[0];
    $httpBackend.expectDELETE("/user/jobs/" +  jobApplication.job_id + "/job_applications/" + jobApplication.id).
      respond(400);
    successCallback = function() {};

    var response = JobApplicationsService.deleteJobApplication(jobApplication, successCallback, failureCallback);
    $httpBackend.flush();

    expect(response.$resolved).toBe(true);
    expect(callbackCalled).toBe(true);
  });
});
