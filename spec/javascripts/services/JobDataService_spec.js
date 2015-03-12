"use strict";

describe("JobDataService", function() {
  var JobDataService, JobsServiceMock, JobApplicationsServiceMock;
  var jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
              { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
  var jobApplications = [{ id:            1, 
                           job_id:        1, 
                           user_id:       1, 
                           date_applied:  Date.now(), 
                           comments:      "Some comments",
                           communication: "Person",
                           status:        "Active" }];

  beforeEach(module("getHired"));

  beforeEach(function() {
    JobsServiceMock = {
      getJobs: function(successCallback, failureCallback) {
        successCallback(jobs);
        return jobs;
      }
    };
    JobApplicationsServiceMock = {
      getJobApplications: function(successCallback, failureCallback) {
        successCallback(jobApplications);
        return jobApplications;
      }
    };
    
    module(function($provide) {
      $provide.value('JobsService', JobsServiceMock);
    });
    module(function($provide) {
      $provide.value('JobApplicationsService', JobApplicationsServiceMock);
    });
  });

  beforeEach(inject(function(_JobDataService_) {
    JobDataService = _JobDataService_;
  }));

  it("should list all jobs", function() {
    expect(JobDataService.jobs()).toEqual([]);
  });

  it("should list all job applications", function() {
    expect(JobDataService.jobApplications()).toEqual([]);
  });

  it("should list all of its data", function() {
    expect(JobDataService.data()).toEqual([]);
  });

  it("should update jobs with initially no jobs", function() {
    JobDataService.updateJobs(jobs);
    var clonedJobs = jobs.map(function(job) {
      return JSON.parse(JSON.stringify(job));
    });
    expect(JobDataService.jobs()).toEqual(clonedJobs);
    expect(JobDataService.data()[0].job).toEqual(clonedJobs[0]);
    expect(JobDataService.data()[1].job).toEqual(clonedJobs[1]);
  });

  it("should update a job that already exists", function() {
    var editedJob = { id: 1, company: "Netflix", link:"http://netflix.com" };
    JobDataService.updateJobs(jobs);
    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.data()[0].job).toEqual(jobs[0]);
    expect(JobDataService.data()[1].job).toEqual(jobs[1]);

    var clonedEditedJob = JSON.parse(JSON.stringify(editedJob));
    clonedEditedJob.position = jobs[0].position;
    JobDataService.updateJobs([editedJob]);
    expect(JobDataService.jobs()).toEqual([clonedEditedJob, jobs[1]]);
    expect(JobDataService.data()[0].job).toEqual(clonedEditedJob);
    expect(JobDataService.data()[1].job).toEqual(jobs[1]);
  });

  it("should update a job application with initially no job applications", function() {
    JobDataService.updateJobApplications(jobApplications);
    var updatedJobApplications = [JSON.parse(JSON.stringify(jobApplications[0]))];
    var date = new Date(updatedJobApplications[0].date_applied);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    updatedJobApplications[0].formatted_date = formattedDate;

    expect(JobDataService.jobApplications()).toEqual(updatedJobApplications);
    expect(JobDataService.data()[0].job_application).toEqual(updatedJobApplications[0]);
  });

  it("should update a job application that already exists", function() {
    var updatedJobApplication = { id:            1, 
                                  job_id:        1, 
                                  user_id:       1, 
                                  date_applied:  Date.parse("Dec 25, 2014"),
                                  status:        "Passive" };
    JobDataService.updateJobApplications(jobApplications); 
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
    expect(JobDataService.data()[0].job_application).toEqual(jobApplications[0]);

    JobDataService.updateJobApplications([updatedJobApplication]);
    var app = JSON.parse(JSON.stringify(jobApplications[0]));
    app.status = updatedJobApplication.status;
    var date = new Date(updatedJobApplication.date_applied);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    app.formatted_date = formattedDate;
    expect(JobDataService.jobApplications()).toEqual([app]);
    expect(JobDataService.data()[0].job_application).toEqual(app);
  });

  it("should properly group jobs and their job applications", function() {
    JobDataService.updateJobs(jobs);
    JobDataService.updateJobApplications(jobApplications);
    var data = JobDataService.data();

    expect(data[0].job.id).toBe(1);
    expect(data[0].job_application.job_id).toBe(1);
  });

  it("should properly group jobs and their job applications", function() {
    JobDataService.updateJobApplications(jobApplications);
    JobDataService.updateJobs(jobs);
    var data = JobDataService.data();

    expect(data[0].job.id).toBe(1);
    expect(data[0].job_application.job_id).toBe(1);
  });

  it("should fetch jobs from API with initially no jobs", function() {
    JobDataService.refreshJobs();

    expect(JobDataService.jobs()).toEqual(jobs);
  });

  it("should fetch jobs from API and update list of current jobs", function() {
    var oldJobs = [{ id:       1,
                     position: "Old Position 1",
                     company:  "Old Company 1",
                     link:     "http://oldlink1.com" },
                   { id:       3, 
                     position: "Position 3",
                     company:  "Company 3", 
                     link:     "https://link3.com" }];
    JobDataService.updateJobs(oldJobs);
    expect(JobDataService.jobs()).toEqual(oldJobs);

    JobDataService.refreshJobs();
    expect(JobDataService.jobs()).toEqual([jobs[0], jobs[1], oldJobs[2]]);
  });

  it("should fetch jobs and be a promise", function() {
    var callBackCalled = false;
    callBack = function() {
      callBackCalled = true;
    };
    expect(callBackCalled).toBe(false);

    JobDataService.refreshJobs().then(callBack);
    expect(callBackCalled).toBe(true);
  });
  
  it("should fetch job applications from API with initially no job applications", function() {
    JobDataService.refreshJobApplications();

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });
  
  it("should fetch job applications from API and update list of current Job Applications", function() {
    var oldJobApplications = [{  id:            1, 
                                  job_id:        1, 
                                  user_id:       1, 
                                  date_applied:  Date.parse("Dec 25, 2014"),
                                  comments:      "Old Comments",
                                  contacts:      "Old contacts",
                                  status:        "Passive" }];
    JobDataService.updateJobs(oldJobApplications);
    expect(JobDataService.jobApplications()).toEqual(oldJobApplications);

    JobDataService.refreshJobApplications();
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should fetch job applications and be a promise", function() {
    var callBackCalled = false;
    callBack = function() {
      callBackCalled = true;
    };
    expect(callBackCalled).toBe(false);

    JobDataService.refreshJobs().then(callBack);
    expect(callBackCalled).toBe(true);
  });
});
