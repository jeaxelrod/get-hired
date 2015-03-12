"use strict"

xdescribe("JobsIndexController", function() {
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
    $httpBackend = _$httpBackend_;
    JobsService = _JobsService_;
    JobApplicationsService = _JobApplicationsService_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    job_applications = [{id: 1, job_id: 1, user_id: 1, date_applied: Date.now(), comments: "Some comments", communication: "John Doe", status: "applied"}];

    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should list all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    $httpBackend.expectGET("/user/job_applications").
      respond(job_applications);
    $httpBackend.flush();
    
    compareJobs(scope.jobs[0].toJSON(), jobs[0]);
    compareJobs(scope.jobs[1].toJSON(), jobs[1]);
    compareJobs(JobsService.jobs()[0].toJSON(), jobs[0]);
    compareJobs(JobsService.jobs()[1].toJSON(), jobs[1]);

    expect(scope.jobApplications[0].toJSON()).toEqual(job_applications[0]);
    expect(JobApplicationsService.jobApplications()[0].toJSON()).toEqual(job_applications[0]);
  });

  it("should handle failure when retrieving all jobs", function() {
    $httpBackend.expectGET("/user/jobs").
      respond(400);
    $httpBackend.flush();

    expect(scope.jobs).not.toEqual(jobs);
  });
});
