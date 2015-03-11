"use strict";

describe("JobDataService", function() {
  var JobDataService, jobs, jobApplications;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobDataService_, _$httpBackend_) {
    JobDataService = _JobDataService_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    jobApplications = [{ id:            1, 
                         job_id:        1, 
                         user_id:       1, 
                         date_applied:  Date.now(), 
                         comments:      "Some comments",
                         communication: "Person",
                         status:        "Active" }];
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

    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.data()[0].job).toEqual(jobs[0]);
    expect(JobDataService.data()[1].job).toEqual(jobs[1]);
  });

  it("should update a job that already exists", function() {
    var editedJob = { id: 1, position: "Intern", company: "Netflix", link:"http://netflix.com" };
    JobDataService.updateJobs(jobs);
    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.data()[0].job).toEqual(jobs[0]);
    expect(JobDataService.data()[1].job).toEqual(jobs[1]);

    JobDataService.updateJobs([editedJob]);
    expect(JobDataService.jobs()).toEqual([editedJob, jobs[1]]);
    expect(JobDataService.data()[0].job).toEqual(editedJob);
    expect(JobDataService.data()[1].job).toEqual(jobs[1]);
  });

  it("should update a job application with initially no job applications", function() {
    JobDataService.updateJobApplications(jobApplications);
    var date = new Date(jobApplications[0].date_applied);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    jobApplications[0].formattedDate = formattedDate;

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
    expect(JobDataService.data()[0].job_application).toEqual(jobApplications[0]);
  });

  it("should update a job application that already exists", function() {
    var updatedJobApplication = { id:            1, 
                                  job_id:        1, 
                                  user_id:       1, 
                                  communication: "Different Person",
                                  status:        "Passive" };
    JobDataService.updateJobApplications(jobApplications); 
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
    expect(JobDataService.data()[0].job_application).toEqual(jobApplications[0]);

    JobDataService.updateJobApplications([updatedJobApplication]);
    var app = jobApplications[0];
    app.communication = updatedJobApplication.communication;
    app.status = updatedJobApplication.status;
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
    expect(JobDataService.data()[0].job_application).toEqual(jobApplications[0]);
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
});
