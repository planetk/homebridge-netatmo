'use strict';

var DEFAULT_CACHE_TTL = 10; // 10 seconds caching - use config["ttl"] to override
var NodeCache = require("node-cache");

function NetatmoDevice(log, api, config) {
  this.api = api;
  this.log = log;
  // TODO: cache rausziehen ?
  var ttl = typeof config["ttl"] !== 'undefined' ? config["ttl"] : DEFAULT_CACHE_TTL;
  this.cache = new NodeCache({stdTTL: ttl});
  this.config = config;
}

module.exports = NetatmoDevice;


NetatmoDevice.prototype.load = function(callback) {
  this.cache.get(this.deviceType, function (err, datasource) {
    if (!err) {
      if (datasource == undefined) {
        this.refresh(callback);
      } else {
        callback(null, datasource);
      }
    } else {
      callback(err, null);
    }
  }.bind(this));
}

NetatmoDevice.prototype.getData = function (deviceId, callback) {
  this.load(function (err, datasource) {
    if (datasource && !datasource[deviceId]) {
      callback(new Error("unknown device id"), null);
    } else {
      callback(err, datasource[deviceId]);
    }
  });
};

NetatmoDevice.prototype.getDashboardValue = function (deviceId, valueName, callback) {
  this.getData(deviceId, function (err, deviceData) {
    if (err) {
      callback(err, null);
    } else {
      if (!deviceData) {
        callback(new Error("no device data for " + deviceId), null);
      }else {
        if (deviceData.dashboard_data) {
          if (deviceData.dashboard_data[valueName]) {
            callback(null, deviceData.dashboard_data[valueName]);
          } else {
            callback(new Error("dashboard data does not include value for " + valueName), null);
          }
        } else {
          callback(new Error("No dashboard data"), null);
        }
      }
    }
  }.bind(this));
}

