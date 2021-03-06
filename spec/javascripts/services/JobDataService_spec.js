"use strict";

describe("JobDataService", function() {
  var JobDataService, JobsServiceMock, JobApplicationsServiceMock, ContactsServiceMock, jobs, jobApplications, $q, $timeout, contacts;
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
    contacts = [{ id:                 1,
                  user_id:            1,
                  job_id:             1,
                  job_application_id: 1,
                  first_name:         "First",
                  last_name:          "Last",
                  email:              "first.last@email.com",
                  phone_number:       0123456789 }];
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
    ContactsServiceMock = {
      getContacts: function() {
        return $q(function(resolve, reject) {
          $timeout(function() {
            resolve(contacts);
          }, 100);
        });
      }
    };
    
    module(function($provide) {
      $provide.value('JobsService', JobsServiceMock);
      $provide.value('JobApplicationsService', JobApplicationsServiceMock);
      $provide.value('ContactsService', ContactsServiceMock);
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

  it("should list all contacts", function() {
    expect(JobDataService.contacts()).toEqual([]);
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

  it("should update a contact with initially no contacts", function() {
    JobDataService.updateContacts(contacts);
    var clonedContacts = contacts.map(function(contact) {
      return JSON.parse(JSON.stringify(contact));
    });
    expect(JobDataService.contacts()).toEqual(contacts);
    expect(JobDataService.data()[0].contact).toEqual(clonedContacts[0]);
  });

  it("should update a contact that already exists", function() {
    var editedContact = { id: 1,  first_name: "Mew", last_name: "Two" };
    JobDataService.updateContacts(contacts);
    
    expect(JobDataService.contacts()).toEqual(contacts);
    expect(JobDataService.data()[0].contact).toEqual(contacts[0]);

    JobDataService.updateContacts([editedContact]);

    var clonedContact = JSON.parse(JSON.stringify(contacts[0]));
    clonedContact.first_name = editedContact.first_name;
    clonedContact.last_name = editedContact.last_name;

    expect(JobDataService.contacts()).toEqual([clonedContact]);
    expect(JobDataService.data()[0].contact).toEqual(clonedContact);
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
  });

  it("should properly group jobs, job applications, and contacts", function() {
    JobDataService.updateContacts(contacts);
    JobDataService.updateJobApplications(jobApplications);
    JobDataService.updateJobs(jobs);

    var data = JobDataService.data()[1];

    expect(data.job.id).toBe(1);
    expect(data.job_application.job_id).toBe(1);
    expect(data.contact.job_id).toBe(1);
  });

  it("should fetch jobs from API with initially no jobs", function() {
    JobDataService.fetchJobs();

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

    JobDataService.fetchJobs();
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

    JobDataService.fetchJobs().then(callback, emptyCallback);
    $timeout.flush();

    expect(callbackCalled).toBe(true);
  });
  
  it("should fetch job applications from API with initially no job applications", function() {
    JobDataService.fetchJobApplications();
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

    JobDataService.fetchJobApplications();
    $timeout.flush();

    expect(JobDataService.jobApplications()).toEqual(jobApplications);
  });

  it("should fetch job applications and be a promise", function() {
    var callBackCalled = false;
    var callBack = function() {
      callBackCalled = true;
    };
    expect(callBackCalled).toBe(false);

    JobDataService.fetchJobApplications().then(callBack);
    $timeout.flush();

    expect(callBackCalled).toBe(true);
  });
  
  it("should fetch contacts from API with initially no contacts", function() {
    JobDataService.fetchContacts();
    $timeout.flush();

    expect(JobDataService.contacts()).toEqual(contacts);
  });

  it("should fetch contacts from API and update list of current contacts", function() {
    var oldContacts = [{ id:                 1,
                         user_id:            1,
                         job_id:             1,
                         job_application_id: 1,
                         first_name:         "OldFirst",
                         last_name:          "OldLast",
                         email:              "old.last@email.com",
                         phone_number:       1112223333 }];
    JobDataService.updateContacts(oldContacts);

    expect(JobDataService.contacts()).toEqual(oldContacts);

    JobDataService.fetchContacts();
    $timeout.flush();

    expect(JobDataService.contacts()).toEqual(contacts);
  });

  it("should fetch contacts and be a promise", function() {
    var callbackCalled = false;
    var callback = function() {
      callbackCalled = true;
    };

    expect(callbackCalled).toBe(false);

    JobDataService.fetchContacts().then(callback);
    $timeout.flush();

    expect(callbackCalled).toBe(true);
  });

  it("should fetch all Jobs data from API with initially no data", function() {
    var response;
    JobDataService.fetchData().then(function(data) {
      response = data;
    });
    $timeout.flush();

    expect(JobDataService.jobs()).toEqual(jobs);
    expect(JobDataService.jobApplications()).toEqual(jobApplications);
    expect(JobDataService.contacts()).toEqual(contacts);
    expect(JobDataService.data()).toEqual(response);
  });

  it("should delete jobs", function() {
    JobDataService.updateJobs(jobs);
    JobDataService.updateJobApplications(jobApplications);
    JobDataService.updateContacts(contacts);

    expect(JobDataService.jobs().length).toBe(2);
    expect(JobDataService.data().length).toBe(2);
    expect(JobDataService.jobApplications().length).toBe(1);
    expect(JobDataService.contacts().length).toBe(1);

    JobDataService.deleteJob(1);

    expect(JobDataService.jobs().length).toBe(1);
    expect(JobDataService.data().length).toBe(1);
    expect(JobDataService.jobApplications().length).toBe(0);
    expect(JobDataService.contacts().length).toBe(0);
  });

  it("should reset all data", function() {
    JobDataService.updateJobs(jobs);
    JobDataService.updateJobApplications(jobApplications);
    JobDataService.updateContacts(contacts);

    expect(JobDataService.jobs().length).toBe(2)
    expect(JobDataService.data().length).toBe(2);
    expect(JobDataService.jobApplications().length).toBe(1);
    expect(JobDataService.contacts().length).toBe(1);

    JobDataService.resetData();

    expect(JobDataService.jobs().length).toBe(0);
    expect(JobDataService.data().length).toBe(0);
    expect(JobDataService.jobApplications().length).toBe(0);
    expect(JobDataService.contacts().length).toBe(0);
  });
});
