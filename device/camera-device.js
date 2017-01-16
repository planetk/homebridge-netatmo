'use strict';

var NetatmoDevice = require("../lib/netatmo-device");

var homebridge;
var CameraAccessory;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    CameraAccessory = require("../accessory/camera-accessory")(homebridge);
  }

  class CameraDeviceType extends NetatmoDevice {
    constructor(log, api, config) {
      super(log, api, config);
      this.deviceType = "camera";
    }

    loadDeviceData(callback) {
      this.api.getHomeData(function (err, homeData) {
        if(!err) {
          var deviceMap = {};
          homeData.homes.forEach(function( home ) {
            deviceMap[home.id] = home;
          }.bind(this));
          this.cache.set(this.deviceType, deviceMap);
          this.deviceData = deviceMap;
        }
        callback(err, this.deviceData);
      }.bind(this));
    }

    buildAccessory(deviceData) {
      return new CameraAccessory(deviceData, this);
    }

  }

  return CameraDeviceType;

}