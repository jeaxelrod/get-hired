"use strict";

describe("ContactsService", function() {
  var ContactsService, $httpBackend, setResponse, emptyCallback, response, contacts;
  var compareContacts = function(actual, expected) {
    var props = ["id", "user_id", "job_id", "job_application_id", "first_name", "last_name", "email", "phone_number"];
    for (var i=0; i<props.length; i++) {
      var prop = props[i];
      expect(actual[prop]).toEqual(expected[prop]);
    };
  };

  beforeEach(module("getHired"));



  beforeEach(inject(function(_ContactsService_, _$httpBackend_) {
    ContactsService = _ContactsService_;
    $httpBackend = _$httpBackend_;
    contacts = [{ id:                 2,
                  user_id:            1,
                  job_id:             1,
                  job_application_id: 1,
                  first_name:         "First",
                  last_name:          "Last",
                  email:              "first.last@email.com",
                  phone_number:       0123456789 },
                { id:                 1,
                  user_id:            1,
                  job_id:             2,
                  job_application_id: 2,
                  first_name:         "Name",
                  last_name:          "LastName",
                  email:              "name@email.com",
                  phone_number:       1234567890 }]; 
    response = undefined;
    setResponse = function(data) {
      response = data;
    };
    emptyCallback = function(data) {
    };
  }));

  it("should retrieve all contacts", function() {
    $httpBackend.expectGET("/user/contacts").
      respond(contacts);

    ContactsService.getContacts().then(setResponse);
    $httpBackend.flush();

    compareContacts(response[0], contacts[0]);
    compareContacts(response[1], contacts[1]);

  });

  it("should retrieve all contacts for a job", function() {
    $httpBackend.expectGET("/user/jobs/1/contacts").
      respond([contacts[0]]);

    ContactsService.getContacts({job_id: contacts[0].job_id}).then(setResponse);
    $httpBackend.flush();

    compareContacts(response[0], contacts[0]);
  });

  it("should retrieve all contacts for a job application", function() {
    $httpBackend.expectGET("/user/job_applications/1/contacts").
      respond([contacts[0]]);

    ContactsService.getContacts({job_application_id: contacts[0].job_application_id}).then(setResponse);
    $httpBackend.flush();

    compareContacts(response[0], contacts[0]);
  });

  it("should should handle failure to retrieve all contacts", function() {
    $httpBackend.expectGET("/user/contacts").
      respond(400);

    ContactsService.getContacts().then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });

  it("should create new contacts", function() {
    var newContact = contacts[0];
    $httpBackend.expectPOST("/user/contacts", {contact: newContact}).
      respond(newContact);

    ContactsService.createContact(newContact).then(setResponse);
    $httpBackend.flush();

    compareContacts(response, newContact);
  });

  it("should handle failure to create new contacts", function() {
    var newContact = contacts[0];
    $httpBackend.expectPOST("/user/contacts", {contact: newContact}).
      respond(400);

    ContactsService.createContact(newContact).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });

  it("should edit new contacts", function() {
    var editContact = { id:         1,
                        first_name: "NewName",
                        last_name:  "NewLast" };
    $httpBackend.expectPUT("/user/contacts/1", {contact: editContact}).
      respond(editContact);

    ContactsService.editContact(editContact).then(setResponse);
    $httpBackend.flush();

    compareContacts(response, editContact);
  });

  it("should fail to edit new contacts", function() {
    var editContact = { id:         1,
                        first_name: "NewName",
                        last_name:  "NewLast" };
    $httpBackend.expectPUT("/user/contacts/1", {contact: editContact}).
      respond(400)

    ContactsService.editContact(editContact).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });

  it("should delete contacts", function() {
    $httpBackend.expectDELETE("/user/contacts/2").
      respond(204);
    response = "Not undefined";

    expect(response).toBe("Not undefined");
    ContactsService.deleteContact(contacts[0]).then(setResponse);
    $httpBackend.flush();

    expect(response).toBe(undefined);
  });

  it("should handle failure when deleting contacts", function() {
    $httpBackend.expectDELETE("/user/contacts/2").
      respond(400);

    ContactsService.deleteContact(contacts[0]).then(emptyCallback, setResponse);
    $httpBackend.flush();

    expect(response.status).toBe(400);
  });
});
