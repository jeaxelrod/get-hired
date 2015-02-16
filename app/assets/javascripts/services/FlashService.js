"use strict";

var app = angular.module("getHired");

app.factory('FlashService', ['$rootScope', 
  function($rootScope) {
    var currentMessage = [];
    var className = function(type) {
        return "alert " + "alert-" + type;
    }
    $rootScope.$on("$stateChangeSuccess", function() {
      $rootScope.messages = currentMessage;
      currentMessage = [];
    });
    return {
      currentMessage: function() {
        return currentMessage;
      },
      addMessage: function(message) {
        message.className = className(message.type);
        currentMessage.push(message);
      }
    };
  }
]);
