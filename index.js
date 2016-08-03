'use strict';
var exportedTypes
var NetatmoWeatherStationAccessory, NetatmoThermostatAccessory;
var async = require('async');

// TODO: user info auswerten (metrisch /imperial ...)

module.exports = function (homebridge) {

  exportedTypes = {
    Accessory: homebridge.hap.Accessory,
    Service: homebridge.hap.Service,
    Characteristic: homebridge.hap.Characteristic,
    uuid: homebridge.hap.uuid
  };

  homebridge.registerPlatform("homebridge-netatmo", "netatmo", NetatmoPlatform);
}

var netatmo = require("netatmo");
var inherits = require('util').inherits;

//var repo = require("./lib/netatmo-repository");

function NetatmoPlatform(log, config) {
  var that = this;
  this.log = log;
  this.config = config;

  // If this log message is not seen, most likely the config.js is not found.
  this.log('Creating NetatmoPlatform...');

  if (config.mockapi) {
    this.log('CAUTION! USING FAKE NETATMO API: ' + config.mockapi);
    this.api = require("./lib/netatmo-api-mock")(config.mockapi);
  } else {
    this.api = new netatmo(config["auth"]);
  }
  this.api.on("error", function (error) {
    that.log('ERROR - Netatmo: ' + error);
  });
  this.api.on("warning", function (error) {
    that.log('WARN - Netatmo: ' + error);
  });
}

NetatmoPlatform.prototype.accessories = function (callback) {

  var foundAccessories = [];
  var deviceTypes = this.config.deviceTypes || [ "weatherstation", "thermostat" ];

  var calls = [];

  deviceTypes.forEach(function(deviceType) {
    calls.push(function(callback) {
      var device = require('./devices/' + deviceType + '.js')(exportedTypes);
      var dev = new device.Device(this.log, this.api, this.config);
      dev.buildAccessories(function(deviceAccessories) {
        callback(null, deviceAccessories);
      });
    }.bind(this));
  }.bind(this));
  
  async.parallel(calls, function(err, result) {
    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < result[i].length; j++) {
        foundAccessories.push(result[i][j]);
      }
    };
    callback(foundAccessories);    
  });

}
