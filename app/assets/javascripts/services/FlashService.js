"use strict";

var app = angular.module("getHired");

app.factory('FlashService', ['$rootScope', 
  function($rootScope) {
    var currentMessage = [];
    $rootScope.$on("$routeChangeSuccess", function() {
      currentMessage = [];
    });
    return {
      currentMessage: function() {
        return currentMessage;
      },
      addMessage: function(message) {
        currentMessage.push(message);
      },
      className: function(type) {
        return "alert " + "alert-" + type;
      }
    };
  }
]);
