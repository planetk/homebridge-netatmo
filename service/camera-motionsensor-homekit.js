'use strict';

var homebridge;
var Characteristic;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class MotionSensorService extends homebridge.hap.Service.MotionSensor {
    constructor(accessory) {
      super(accessory.name + " Motion Sensor");
      this.accessory = accessory;

      this.getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getMotionDetected.bind(this))
        .eventEnabled = true;

  /*
  // Optional Characteristics
  this.addOptionalCharacteristic(Characteristic.StatusActive);
  this.addOptionalCharacteristic(Characteristic.StatusFault);
  this.addOptionalCharacteristic(Characteristic.StatusTampered);
  this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
  */

    }

    updateCharacteristics() {
      this.getCharacteristic(Characteristic.MotionDetected)
            .updateValue(this.accessory.motionDetected);
    }

    getMotionDetected(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.motionDetected);
      }.bind(this));
    }

  }

  return MotionSensorService;
};
