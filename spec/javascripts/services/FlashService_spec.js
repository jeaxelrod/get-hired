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
    var message = { message: "Hello world", 
                    type:     "success" };
    var formattedMessage =  { message:   "Hello world", 
                              type:      "success", 
                              className: "alert alert-success" };
    FlashService.addMessage(message);

    expect(FlashService.currentMessage()).toEqual([formattedMessage]);
  });

  it("should correctly add multiple messages", function() {
    var message1 = { message: "Hello world",
                     type:    "success" };
    var formattedMessage1 = { message:   "Hello world",
                              type:      "success",
                              className: "alert alert-success" };

    var message2 = { message: "Message 2",   
                     type:    "danger" };
    var formattedMessage2 =  { message:   "Message 2",
                                type:      "danger",
                                className: "alert alert-danger" };
    FlashService.addMessage(message1);
    FlashService.addMessage(message2);
    expect(FlashService.currentMessage()).toEqual([formattedMessage1, formattedMessage2]);
  });

  it("should correctly expire the message", function() {
    var message = { message: "Hello world", 
                    type: "success" };
    var formattedMessage =  { message:   "Hello world", 
                              type:      "success", 
                              className: "alert alert-success" };
    FlashService.addMessage(message);
    expect(FlashService.currentMessage()).toEqual([formattedMessage]);
    $rootScope.$broadcast("$stateChangeSuccess");
    expect(FlashService.currentMessage()).toEqual([]);
  });
});

