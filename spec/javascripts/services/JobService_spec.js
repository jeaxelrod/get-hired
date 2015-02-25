"use strict";

describe("JobService", function() {
  var JobService, $httpBackend;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_JobService_, _$httpBackend_) {
    JobService = _JobService_;
    $httpBackend = _$httpBackend_;
  }));

  it("should list all jobs");
  it("should retrieve all jobs");
  it("should create new jobs");
  it("should fail to create a new job if invalid attribute link");
  it("should edit a job");
  it("shoudl handle failed edits of a job");
  it("should delte jobs");
  it("should handle failures to delete jobs");
});
