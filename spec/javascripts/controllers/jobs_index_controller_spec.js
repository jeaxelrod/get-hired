"use strict";

describe("JobsIndexController", function() {
  var scope, controller, $httpBackend, jobs;

  beforeEach(module('getHired'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    jobs = [{ id: 1, position: "Position 1", company: "Company 1", link: "http://link1.com" },
                { id: 2, position: "Position 2", company: "Company 2", link: "http://link2.com"}]
    $httpBackend.expectGET("/user/jobs").
      respond(jobs);
    controller = $controller("JobsIndexController", { $scope: scope});
  }));

  it("should lists all jobs", function() {
    $httpBackend.flush();
    var filteredJobs = [
      { position: jobs[0].position, company: jobs[0].company, link: jobs[0].link },
      { position: jobs[1].position, company: jobs[1].company, link: jobs[1].link }
    ];
    expect(scope.jobs).toEqual(filteredJobs);
  });

  it("should create new jobs", function() {
    var newJob = { position: "Internship", company: "Facebook", link:"http://facebook.com" };
    $httpBackend.expectPOST("/user/jobs", {job: newJob}).
      respond(newJob);
    scope.createJob(newJob);
    $httpBackend.flush();
    scope.$digest();
    expect(scope.jobs).toContain(newJob);
  });
});
