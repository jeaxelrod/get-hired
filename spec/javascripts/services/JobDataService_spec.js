"use strict";

describe("JobDataService", function() {
  var JobDataService, JobsServiceMock, JobApplicationsServiceMock, jobs, jobApplications, $q, $timeout;
  beforeEach(module("getHired"));

  beforeEach(function() {
    jobs = [{ id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com" },
            { id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" }];
    jobApplications = [{ id:            1, 
                         job_id:        1, 
                         user_id:       1, 
                         date_applied:  Date.now(), 
                         comments:      "Some comments",
                         communication: "Person",
                         status:        "Active" }];
    JobsServiceMock = {
      getJobs: function() {
        return $q(function(resolve, reject) {
          $timeout(function() {
            resolve(jobs);
          }, 100);
        });
      }
    };
    JobApplicationsServiceMock = {
      getJobApplications: function() {
        return $q(function(resolve, reject) {
          $timeout(function() {
            resolve(jobApplications);
          }, 100);
        });
      }
    };
    
    module(function($provide) {
      $provide.value('JobsService', JobsServiceMock);
    });
    module(function($provide) {
      $provide.value('JobApplicationsService', JobApplicationsServiceMock);
    });
  });

  beforeEach(inject(function(_JobDataService_, _$q_, _$timeout_) {
    JobDataService = _JobDataService_;
    $q = _$q_;
    $timeout = _$timeout_;
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
    clonedEditedJob.position = jobs[1].position;
    JobDataService.updateJobs([editedJob]);
    expect(JobDataService.jobs()).toEqual([jobs[0], clonedEditedJob]);
    expect(JobDataService.data()[1].job).toEqual(clonedEditedJob);
    expect(JobDataService.data()[0].job).toEqual(jobs[0]);
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

    expect(data[1].job.id).toBe(1);
    expect(data[1].job_application.job_id).toBe(1);
    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should properly group jobs and their job applications", function() {
    JobDataService.updateJobApplications(jobApplications);
    JobDataService.updateJobs(jobs);
    var data = JobDataService.data();
    var jobsData = JobDataService.jobs();

    expect(data[1].job.id).toBe(1);
    expect(data[1].job_application.job_id).toBe(1);
    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should fetch jobs from API with initially no jobs", function() {
    JobDataService.refreshJobs();

    $timeout.flush();

    expect(JobDataService.jobs()).toEqual(jobs);
  });

  it("should fetch jobs from API and update list of current jobs", function() {
    var oldJobs = [{ id:       3, 
                     position: "Position 3",
                     company:  "Company 3", 
                     link:     "https://link3.com" },
                   { id:       1,
                     position: "Old Position 1",
                     company:  "Old Company 1",
                     link:     "http://oldlink1.com" }
                   ];
    JobDataService.updateJobs(oldJobs);
    expect(JobDataService.jobs()).toEqual(oldJobs);

    JobDataService.refreshJobs();
    $timeout.flush();

    expect(JobDataService.jobs()).toEqual([oldJobs[0], jobs[0], jobs[1]]);
  });

  it("should fetch jobs and be a promise", function() {
    var callbackCalled = false;
    var callback = function(response) {
      callbackCalled = true;
    };
    var emptyCallback = function(response) {
    };
    expect(callbackCalled).toBe(false);

    JobDataService.refreshJobs().then(callback, emptyCallback);
    $timeout.flush();

    expect(callbackCalled).toBe(true);
  });
  
  it("should fetch job applications from API with initially no job applications", function() {
    JobDataService.refreshJobApplications();
    $timeout.flush();

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });
  
  it("should fetch job applications from API and update list of current Job Applications", function() {
    var oldJobApplications = [{ id:            1, 
                                job_id:        1, 
                                user_id:       1, 
                                date_applied:  Date.parse("Dec 25, 2014"),
                                comments:      "Old Comments",
                                communication: "Old contacts",
                                status:        "Passive" }];
    JobDataService.updateJobApplications(oldJobApplications);
    expect(JobDataService.jobApplications()).toEqual(oldJobApplications);
    var date = new Date(jobApplications[0].date_applied);
    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    jobApplications[0].formatted_date = formattedDate;

    JobDataService.refreshJobApplications();
    $timeout.flush();

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should fetch job applications and be a promise", function() {
    var callBackCalled = false;
    var callBack = function() {
      callBackCalled = true;
    };
    expect(callBackCalled).toBe(false);

    JobDataService.refreshJobApplications().then(callBack);
    $timeout.flush();

    expect(callBackCalled).toBe(true);
  });
});
