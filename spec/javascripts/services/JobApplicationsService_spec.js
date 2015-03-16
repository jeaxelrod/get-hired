"use strict";

describe("JobApplicationsService", function() {
  var JobApplicationsService, JobsService, $httpBackend, jobApplications, setResponse, emptyCallback, response;
  var compareJobApplications = function(newApp, oldApp) {
    var props = ["id", "job_id", "user_id", "date_applied", "comments", "communication", "status"];
    for (var i=0; i < props.length; i++) {
      var prop = props[i];
      expect(newApp[prop]).toEqual(oldApp[prop]);
    }
  };
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
      response = undefined;
      setResponse = function(data) {
        response = data;
      };
      emptyCallback = function(data) {
      };
  }));

  it("should retrieve all job applications", function() {
    $httpBackend.expectGET("/user/job_applications").
      respond(jobApplications);

    JobApplicationsService.getJobApplications().then(setResponse);
    $httpBackend.flush();

    compareJobApplications(response[0], jobApplications[0]);
  });

  it("should retrieve all job applications for a job", function() {
    var job_id = jobApplications[0].job_id;
    $httpBackend.expectGET("/user/jobs/" + job_id + "/job_applications").
      respond(jobApplications);

    JobApplicationsService.getJobApplications({ job_id: job_id }).then(setResponse);
    $httpBackend.flush();
    
    compareJobApplications(response[0], jobApplications[0]);
  });

  it("should handle failure to retrieve all job applications for a job", function() {
    var job_id = jobApplications[0].job_id;
    $httpBackend.expectGET("/user/jobs/" + job_id + "/job_applications").
      respond(400);

    JobApplicationsService.getJobApplications({ job_id: job_id }).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });

  it("should create new job applications", function() {
    var newJobApplication = jobApplications[0];
    $httpBackend.expectPOST("/user/jobs/" + newJobApplication.job_id + "/job_applications", {job_application: newJobApplication}).
      respond(newJobApplication);

    JobApplicationsService.createJobApplication(newJobApplication).then(setResponse);
    $httpBackend.flush();

    compareJobApplications(response, newJobApplication);
  });

  it("should handle failure when creating new job applications", function() {
    var newJobApplication = jobApplications[0];
    $httpBackend.expectPOST("/user/jobs/" + newJobApplication.job_id + "/job_applications", {job_application: newJobApplication}).
      respond(400);

    JobApplicationsService.createJobApplication(newJobApplication).then(emptyCallback, setResponse);
    $httpBackend.flush()

    expect(response.status).toEqual(400);
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

    JobApplicationsService.editJobApplication(editJobApplication).then(setResponse);
    $httpBackend.flush();

    compareJobApplications(response, editJobApplication);
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
    
    JobApplicationsService.editJobApplication(editJobApplication).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toEqual(400);
  });

  it("should should delete a job application", function() {
    var jobApplication = jobApplications[0];
    $httpBackend.expectDELETE("/user/jobs/" +  jobApplication.job_id + "/job_applications/" + jobApplication.id).
      respond(204);
    var jobApplicationDeleted = false;
    setResponse = function(data) {
      jobApplicationDeleted = true; 
    };

    expect(jobApplicationDeleted).toBe(false);
    JobApplicationsService.deleteJobApplication(jobApplication).then(setResponse);
    $httpBackend.flush();

    expect(jobApplicationDeleted).toBe(true);
  });

  it("should handle failure when deleting a job application", function() {
    var jobApplication = jobApplications[0];
    $httpBackend.expectDELETE("/user/jobs/" +  jobApplication.job_id + "/job_applications/" + jobApplication.id).
      respond(400);

    JobApplicationsService.deleteJobApplication(jobApplication).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });
});
