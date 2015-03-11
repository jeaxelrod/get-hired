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
                         data_applied:  Date.now(), 
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
  });

  it("should update a job that already exists", function() {
    var editedJob = { id: 1, position: "Intern", company: "Netflix", link:"http://netflix.com" };
    JobDataService.updateJobs(jobs);
    expect(JobDataService.jobs()).toEqual(jobs);

    JobDataService.updateJobs(editedJobs);
    expect(JobDataService.jobs()).toEqual([editedJob, jobs[1]]);
  });

  it("should mark jobs without a job application", function() {
    JobDataService.updateJobs(jobs);
    JobDataService.updateJobApplications(jobApplications);

    expect(JobDataService.data()[1].newApp).toBe(true);
  });

  it("should update a job application with initially no job applications", function() {
    JobDataService.updateJobApplications(jobApplications);
    var date = new Date(jobApplications[0].date_applied);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    jobApplications[0].formattedDate = formattedDate;

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should update a job application that already exists", function() {
    var updatedJobApplication = { id:            1, 
                                  job_id:        1, 
                                  user_id:       1, 
                                  data_applied:  Date.parse("Dec 25, 2014"), 
                                  comments:      "Different comments",
                                  communication: "Different Person",
                                  status:        "Passive" };
    JobDataService.updateJobApplications(jobApplications); 
    expect(JobDataService.jobApplications()).toEqual(jobApplications);

    JobDataService.updateJobApplications([updatedJobApplication]);
    expect(JobDataService.jobApplications()).toEqual([updatedJobApplication]);
  });
});
