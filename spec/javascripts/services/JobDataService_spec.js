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
});
