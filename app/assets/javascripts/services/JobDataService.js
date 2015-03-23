"use strict";

var app = angular.module("getHired");

app.factory("JobDataService", ['JobsService', 'JobApplicationsService', 'ContactsService', '$q',
  function(JobsService, JobApplicationsService, ContactsService, $q) {
    var jobs = [];
    var jobApplications = [];
    var contacts = [];
    var data = [];
    var findJob = function(id) {
      return jobs.filter(function(job) {
        return job.id === id;
      })[0];
    };
    var updateJob = function(newJob, oldJob) {
      for (var prop in newJob) {
        if (newJob.hasOwnProperty(prop)) {
          if (newJob[prop] !== oldJob[prop]) {
            oldJob[prop] = newJob[prop];
          }
        }
      }
    };

    var findJobApplication = function(id) {
      return jobApplications.filter(function(app) {
        return app.id === id;
      })[0];
    };
    var updateJobApplication = function(newApp, oldApp) {
      for (var prop in newApp) {
        if (newApp.hasOwnProperty(prop)) {
          if (newApp[prop] !== oldApp[prop]) {
            if (prop === "date_applied") {
              oldApp.formatted_date = formatDate(newApp.date_applied);
            }
            oldApp[prop] = newApp[prop];
          }
        }
      }
    };

    var findContact = function(id) {
      return contacts.filter(function(contact) {
        return contact.id === id;
      })[0];
    };
    var updateContact = function(newContact, oldContact) {
      for (var prop in newContact) {
        if (newContact.hasOwnProperty(prop)) {
          if (newContact[prop] !== oldContact[prop]) {
            oldContact[prop] = newContact[prop];
          }
        }
      }
    };

    var addJob = function(job) {
      var dataElement = data.filter(function(element) {
        if (element.job_application) {
          return element.job_application.job_id === job.id;
        } else if (element.contact) {
          return element.contact.job_id === job.id;
        } else {
          return false;
        }
      })[0];

      if (dataElement) {
        dataElement.job = job;
      } else {
        data.push({job: job});
        data.sort(function(a, b) {
          if (a.job && b.job) {
            return b.job.id - a.job.id;
          } else if (a.job) {
            return -1;
          } else if (b.job) {
            return 1;
          } else {
            return 0;
          }
        });

      }
      jobs.push(job);
      jobs.sort(function(a, b) {
        return b.id - a.id;
      });
    };
    var addJobApplication = function(app) {
      app.formatted_date = formatDate(app.date_applied);
      var dataElement = data.filter(function(element) {
        if (element.job) {
          return element.job.id === app.job_id;
        } else if (element.contact) {
          return element.contact.job_id === app.job_id;
        } else {
          return false;
        }
      })[0];

      if (dataElement) {
        dataElement.job_application = app;
      } else {
        data.push({job_application: app});
      }
      jobApplications.push(app);
      jobApplications.sort(function(a, b) {
        return b.id - a.id;
      });
    };
    var addContact = function(contact) {
      var dataElement = data.filter(function(element) {
        if (element.job) {
          return element.job.id === contact.job_id;
        } else if (element.job_application) {
          return element.job_application.job_id === contact.job_id;
        }
      })[0];

      if (dataElement) {
        dataElement.contact = contact;
      } else {
        data.push({contact: contact});
      }
      contacts.push(contact);
      contacts.sort(function(a, b) {
        return b.id - a.id;
      });
    };

    var updateJobs = function(newJobs) {
      newJobs.forEach(function(newJob) {
        var oldJob = findJob(newJob.id);
        if (oldJob) {
          updateJob(newJob, oldJob);
        } else {
          addJob(newJob);
        }
      });
    };
    var updateJobApplications = function(newJobApplications) {
      newJobApplications.forEach(function(newApp) {
        var oldApp = findJobApplication(newApp.id);
        if (oldApp) {
          updateJobApplication(newApp, oldApp);
        } else {
          addJobApplication(newApp);
        }
      });
    };
    var updateContacts = function(newContacts) {
      newContacts.forEach(function(newContact) {
        var oldContact = findContact(newContact.id);
        if (oldContact) {
          updateContact(newContact, oldContact);
        } else {
          addContact(newContact);
        }
      });
    };
          
    var formatDate = function(milliseconds) {
      var date = new Date(milliseconds);
      return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    };
    return {
      jobs: function() { 
        return jobs; 
      }, 
      jobApplications: function() {
        return jobApplications;
      },
      contacts: function() {
        return contacts;
      },
      data: function() {
        return data;
      },
      updateJobs: updateJobs,
      updateJobApplications: updateJobApplications,
      updateContacts: updateContacts,
      deleteJob: function(job) {
        var jobsIndex, dataIndex, appsIndex, contactsIndex;
        jobs.some(function(element, index) {
          if (element.id === job.id) {
            jobsIndex = index;
            return true;
          };
        });
        data.some(function(element, index) {
          if (element.job && job.id === element.job.id) {
            dataIndex = index;
            return true;
          }
        });
        jobApplications.some(function(element, index) {
          if (element.job_id === job.id) {
            appsIndex = index;
            return true;
          }
        });
        contacts.some(function(element, index) {
          if (element.job_id === job.id) {
            contactsIndex = index;
            return true;
          }
        });

        jobs.splice(jobsIndex, 1);
        data.splice(dataIndex, 1);
        jobApplications.splice(appsIndex, 1);
        contacts.splice(contactsIndex, 1);
      },
      fetchJobs: function() {
        return $q(function(resolve, reject) {
          JobsService.getJobs().then(function(response) {
            updateJobs(response);
            resolve(response);
          }, function(response) {
            reject(response);
          });
        });
      },
      fetchJobApplications: function() {
        return $q(function(resolve, reject) {
          JobApplicationsService.getJobApplications().then(function(response) {
            updateJobApplications(response);
            resolve(response);
          }, function(response) {
            reject(response);
          });
        });
      },
      fetchContacts: function() {
        return $q(function(resolve, reject) {
          ContactsService.getContacts().then(function(response) {
            updateContacts(response);
            resolve(response);
          }, function(response) {
            reject(response);
          });
        });
      },
      fetchData: function() {
        var deferred = $q.defer(),
        jobsPromise = JobsService.getJobs().then(function(response) {
          updateJobs(response);
        }),
        appsPromise = JobApplicationsService.getJobApplications().then(function(response) {
          updateJobApplications(response);
        }),
        contactsPromise = ContactsService.getContacts().then(function(response) {
          updateContacts(response);
        });
        $q.all([jobsPromise, appsPromise, contactsPromise]).then( deferred.resolve(data), deferred.reject({error: "Unable to successfully fetch data"}));
        return deferred.promise;
      },
      resetData: function() {
        jobs = [];
        jobApplications = [];
        contacts = [];
        data = [];
      }
    };
  }
]);
