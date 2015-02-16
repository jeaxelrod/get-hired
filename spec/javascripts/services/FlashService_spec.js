"use strict";

describe("FlashService", function() {
  var FlashService, $rootScope;

  beforeEach(module("getHired"));

  beforeEach(inject(function(_FlashService_, _$rootScope_) {
    $rootScope = _$rootScope_;
    FlashService = _FlashService_;
  }));

  it("should correctly retrieve the message", function() {
    expect(FlashService.currentMessage()).toEqual([]);
  });

  it("should correctly add the message", function() {
    var message = {message: "Hello world", type: "success"};
    FlashService.addMessage(message);
    expect(FlashService.currentMessage()).toEqual([message]);
  });

  it("should correctly add multiple messages", function() {
    var message1 = { message: "Hello world", type: "success" };
    var message2 = { message: "Message 2",   type: "danger" };
    FlashService.addMessage(message1);
    FlashService.addMessage(message2);
    expect(FlashService.currentMessage()).toEqual([message1, message2]);
  });

  it("should correctly expire the message", function() {
    var message = { message: "Hello world", type: "success" };
    FlashService.addMessage(message);
    expect(FlashService.currentMessage()).toEqual([message]);
    $rootScope.$broadcast("$routeChangeSuccess");
    expect(FlashService.currentMessage()).toEqual([]);
  });

  it("should correctly specify the class name of success messages", function() {
    expect(FlashService.className("success")).toBe("alert alert-success");
  });
});

