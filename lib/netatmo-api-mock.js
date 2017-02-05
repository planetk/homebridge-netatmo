'use strict';

var inherits = require('util').inherits;
var EventEmitter = require("events").EventEmitter;

module.exports = function(context) {
  return new NetatmoAPIMock(context);
};

function NetatmoAPIMock(context) {
  EventEmitter.call(this);
  this.context = context;
}
inherits(NetatmoAPIMock, EventEmitter);

NetatmoAPIMock.prototype.getMockData = function (methodname) {
  var filename = this.context || "default";
  var data;
  try {
    data = require("./../mockapi_calls/" + methodname + "-" + filename + ".json");
  } catch (err) {
    this.emit("warning", new Error("No fake api call for '" + methodname + "-" + this.context + "'! using default"));
    data = require("./../mockapi_calls/" + methodname + "-default.json");    
  }
  if (!data) {
    this.emit("error", new Error("No fake api call for " + methodname));
    data = {};
  }
  return data;
};

NetatmoAPIMock.prototype.getStationsData = function (options, callback) {
  if (options != null && callback == null) {
    callback = options;
    options = null;
  }
  
  var data = this.getMockData("getstationsdata");
  var devices = [];
  if (data && data.body) {
    devices = data.body.devices;
  }

  if (callback) {
    return callback(null, devices);
  }
};

NetatmoAPIMock.prototype.getThermostatsData = function (options, callback) {
  if (options != null && callback == null) {
    callback = options;
    options = null;
  }

  var data = this.getMockData("getthermostatsdata");  
  var devices = [];
  if (data && data.body) {
    devices =data.body.devices;
  }

  if (callback) {
    return callback(null, devices);
  }
};

NetatmoAPIMock.prototype.getHomeData = function (options, callback) {
  if (options != null && callback == null) {
    callback = options;
    options = null;
  }

  var data = this.getMockData("gethomedata");  

  var result = {};
  if (data && data.body) {
    result = data.body;
  }

  if (callback) {
    return callback(null, result);
  }
};


