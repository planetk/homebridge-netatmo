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
            deviceMap[device["_id"]] = device;
          }.bind(this));
          this.cache.set(this.deviceType, deviceMap);
          this.oldDeviceData = this.deviceData;
          this.deviceData = deviceMap;
        }
        callback(err, this.deviceData, this.oldDeviceData);
      }.bind(this));
    }

    buildAccessories(callback) {
      Object.keys(this.deviceData).forEach(function(key) {
        var accessory = this.buildAccessory(this.deviceData[key]);
        this.log("Did build acc " + accessory.name );
        this.accessories.push(accessory);
      }.bind(this));
      callback(null, this.accessories);
    }

    buildAccessory(deviceData) {
      this.log("building accessory" + deviceData);
      return new ThermostatAccessory(deviceData, this);
    }

  }

  return ThermostatDeviceType;

}
