'use strict';

module.exports = function(context) {
  return new NetatmoAPIMock(context);
};

function NetatmoAPIMock(data) {
  this.data = data;
}

NetatmoAPIMock.prototype.getStationsData = function (options, callback) {
  if (options != null && callback == null) {
    callback = options;
    options = null;
  }
  
  var filename = this.context || "default";
  var data = require("./../data/getstationsdata-" + filename + ".json");

  var devices = [];
  if (data && data.body) {
    devices = data.body.devices;
  }

  if (callback) {
    return callback(null, devices);
  }
}

NetatmoAPIMock.prototype.getThermostatsData = function (options, callback) {
  if (options != null && callback == null) {
    callback = options;
    options = null;
  }

  var filename = this.context || "default";
  var data = require("./../data/getthermostatsdata-" + filename + ".json");
  
  var devices = [];
  if (data && data.body) {
    devices =data.body.devices;
  }

  if (callback) {
    return callback(null, devices);
  }
}