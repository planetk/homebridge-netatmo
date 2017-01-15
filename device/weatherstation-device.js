'use strict';

var NetatmoDevice = require("../lib/netatmo-device");

var homebridge;
var WeatherStationAccessory;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    WeatherStationAccessory = require("../accessory/weatherstation-accessory")(homebridge);
  }

  class WeatherstationDeviceType extends NetatmoDevice {
  	constructor(log, api, config) {
      super(log, api, config);
      this.log.debug("Creating Weatherstation Devices");
      this.deviceType = "weatherstation";
    }

    loadDeviceData(callback) {
      this.api.getStationsData(function (err, devices) {
        if(!err) {
          var deviceMap = {};
          devices.forEach(function( device ) {
            deviceMap[device["_id"]] = device;
            device._name = device.station_name + " " + device.module_name
            if (device.modules) {
              device.modules.forEach(function( module ) {
                module._name = device.station_name + " " + module.module_name
                deviceMap[module._id] = module;
              }.bind(this));
            }
          }.bind(this));
          this.cache.set(this.deviceType, deviceMap);
          this.deviceData = deviceMap;
        }
        callback(err, this.deviceData);
      }.bind(this));
    }

    buildAccessory(deviceData) {
      return new WeatherStationAccessory(deviceData, this);
    }
  }
  
  return WeatherstationDeviceType;

}
  