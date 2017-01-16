'use strict';

const DEFAULT_SERVICES = [
        "motionsensor-homekit"
      ];

var homebridge;
var Characteristic;
var NetatmoAccessory;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    NetatmoAccessory = require("../lib/netatmo-accessory")(homebridge);
    Characteristic = homebridge.hap.Characteristic;
  }

  class CameraAccessory extends NetatmoAccessory {
    constructor(deviceData, netatmoDevice) {

      var accessoryConfig = {
        "id": deviceData.id,
        // TODO: Check Modules in home!
        "netatmoType": deviceData.type || 'camera',
        "firmware": deviceData.firmware || 0.0,
        "name": deviceData.name || "Netatmo " + netatmoDevice.deviceType + " " + deviceData._id,
        "defaultServices": DEFAULT_SERVICES
      }

      super(homebridge, accessoryConfig, netatmoDevice);

      this.currentTemperature = 11.1;
      this.targetTemperature = 20.0;
      this.lastEventTimeStamp = 0;
      this.refreshData(function(err, data) {});

    }

    refreshData(callback) {
      this.device.refreshDeviceData(function (err, deviceData) {
        if (!err) {
          this.notifyUpdate(deviceData);
        }
        callback(err, deviceData);
      }.bind(this));
    }

    notifyUpdate(deviceData) {
      var accessoryData = this.extractAccessoryData(deviceData);
      var homeData = this.mapAccessoryDataToCameraData(accessoryData);
      this.applyHomeData(homeData);
    }

    extractAccessoryData(deviceData) {
      return deviceData[this.id];
    }

    mapAccessoryDataToCameraData(accessoryData) {
      // this.log(JSON.stringify(accessoryData));
      var result = {};

      var events = accessoryData.events;

      var newLastEventTimeStamp = this.lastEventTimeStamp;
      this.log("new ts before: " + newLastEventTimeStamp);
      this.log("new ts before: " + newLastEventTimeStamp);

      result.motionDetected = false;

      if (events) {
        events.forEach(function(event) {
          if (event.time > newLastEventTimeStamp) {
            newLastEventTimeStamp = event.time;
          }
          if (event.time > this.lastEventTimeStamp) {
             result.motionDetected = result.motionDetected || event.type == 'movement'
          }
        }.bind(this));
        this.lastEventTimeStamp = newLastEventTimeStamp;
      }

      return result;
    }

    applyHomeData(homeData) {
      var dataChanged = false

      if(this.motionDetected != homeData.motionDetected) {
        this.motionDetected = homeData.motionDetected;
        dataChanged = true;
      }

      if (dataChanged) {
        this.getServices().forEach(
          function( svc ) {
            svc.updateCharacteristics && svc.updateCharacteristics();
          }
        );
      }

    }

  }

  return CameraAccessory;
}
