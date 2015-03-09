"use strict";

describe("JobApplicationsNewController", function() {
  var scope, controller, $httpBackend, JobsService, JobApplicationsService, jobs, job_applications;
  var compareJobs = function(actualJob, expectedJob) {
    for (var property in actualJob) {
      if (actualJob.hasOwnProperty(property)) {
        if (property === "job_application") {
          expect(actualJob[property].toJSON()).toEqual(expectedJob[property]);
        } else {
          expect(actualJob[property]).toEqual(expectedJob[property])
        }
      }
    }
  }

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _JobsService_, _JobApplicationsService_) {
    scope = $rootScope.$new();
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
            { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    job_applications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];
    $httpBackend = _$httpBackend_;
    controller = $controller("JobApplicationsNewController", {$scope: scope});
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(job_applications);
    $httpBackend.flush();
    var job1 = jobs[0];
    var job2 = jobs[1];
    job1.job_application = job_applications[0];
    job2.job_application = job_applications[1];
    
    compareJobs(scope.jobs[0].toJSON(), job1);
    compareJobs(scope.jobs[1].toJSON(), job2);
  });

  it("should handle failure when retrieving all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    $httpBackend.flush();

    expect(scope.jobs).toEqual([]);
  });

  it("should handle failure when failing to retrieve a job application");
//   $httpBackend.expectGET("/user/jobs").
//     respond(jobs);
//   $httpBackend.expectGET("/user/job_applications").
//     respond(400);
//   $httpBackend.flush();

//   console.log(JSON.stringify(scope.jobs[0]));
//   expect(false).toBe(true);
// });

  it("should create a new job application", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(job_applications);
    $httpBackend.expectPOST("/user/jobs/job_applications", {job_application: newApp}).
      respond(newApp);

    scope.createJobApplication(newApp);
    $httpBackend.flush();
    scope.$digest();

    expect(scope.jobs[1].job_application.toJSON()).toEqual(newApp);
  });

  it("should handle failure when creating a new job application", function() {
    var newApp = {id: 2, job_id: 2, user_id: 1, date_applied: Date.now(), comments: "Meow", communication: "Cat", status: "denied"};
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(job_applications);
    $httpBackend.expectPOST("/user/jobs/job_applications", {job_application: newApp}).
      respond(400);

    scope.createJobApplication(newApp);
    $httpBackend.flush();
    
    expect(scope.jobs[1].job_application.toJSON()).not.toContain(newJob);
  });
});

