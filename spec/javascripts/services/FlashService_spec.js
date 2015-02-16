"use strict";

describe("FlashService", function() {
  var FlashService, scope;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_FlashService_, $rootScope) {
    scope = $rootScope.$new();
    FlashService = _FlashService_;
  }));

  it("should correctly retrieve the message", function() {
    expect(FlashService.currentMessage()).toBe(null);
  });

  it("should correctly add the message", function() {
    var message = {message: "Hello world", type: "success"};
    FlashService.addMessage(message);
    expect(FlashService.currentMessage()).toBe([message]);
  });

  it("should correctly add multiple messages", function() {
    var message1 = { message: "Hello world", type: "success" };
    var message2 = { message: "Message 2",   type: "danger" };
    FlashService.addMessage(message1);
    FlashService.addMessage(message2);
    expect(FlashService.currentMessage()).toBe([message1, message2]);
  });

  it("should correctly expire the message", function() {
    var message = { message: "Hello world", type: "success" };
    FlashService.addMesage(message1);
    expect(FlashService.currentMessage()).toBe([message]);
    scope.$broadcast("$routeChangeSuccess");
    expect(FlashService.currentMessage()).toBe(null);
  });
  it("should correctly specify the class name of success messages");
  it("should correctly specify the class name of info messages");
  it("should correctly specify the class name of warning messages");
  it("should correctly specify the class name of danger messages");
});

