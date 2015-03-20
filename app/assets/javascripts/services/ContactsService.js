"use strict";

var app = angular.module("getHired");

app.factory("ContactsService", ['Restangular',
  function(Restangular) {
    var Contact = Restangular.all('user/contacts');
    return {
      getContacts: function(params) {
        if (params) {
          if (params.job_id) {
            return Restangular.one('user/jobs', params.job_id).all('contacts').getList();
          } else if (params.job_application_id) {
            return Restangular.one('user/job_applications', params.job_application_id).all('contacts').getList();
          }
        } else {
          return Contact.getList();
        }
      },
      createContact: function(newContact) {
        return Contact.post({contact: newContact});
      },
      editContact: function(editContact) {
        return Contact.customPUT({contact: editContact}, editContact.id);
      },
      deleteContact: function(contact) {
        return Contact.customDELETE(contact.id);
      }
    }
  }
]);
