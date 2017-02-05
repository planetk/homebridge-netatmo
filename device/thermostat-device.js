'use strict';

var NetatmoDevice = require("../lib/netatmo-device");

var homebridge;
var ThermostatAccessory;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    ThermostatAccessory = require("../accessory/thermostat-accessory")(homebridge);
  }

  class ThermostatDeviceType extends NetatmoDevice {
    constructor(log, api, config) {
      super(log, api, config);
      this.deviceType = "thermostat";
    }

    loadDeviceData(callback) {
      this.api.getThermostatsData(function (err, devices) {
        if(!err) {
          var deviceMap = {};
          devices.forEach(function( device ) {
            deviceMap[device._id] = device;
          }.bind(this));
          this.cache.set(this.deviceType, deviceMap);
          this.deviceData = deviceMap;
        }
        callback(err, this.deviceData);
      }.bind(this));
    }

    buildAccessory(deviceData) {
      return new ThermostatAccessory(deviceData, this);
    }

  }

  return ThermostatDeviceType;

};
