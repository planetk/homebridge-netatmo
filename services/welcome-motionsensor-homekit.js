'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }
  return { ServiceProvider: ServiceProvider};
}

var ServiceProvider = function() { }

ServiceProvider.prototype.buildServices = function(accessory, stationData) {
  var services = [];
  services.push(this.buildMotionSensor(accessory, stationData));
  return services;
}



ServiceProvider.prototype.buildMotionSensor = function(accessory, stationData) {

  var getMotionDetected = function (callback) {
    var minTimeStamp = Math.floor(new Date() / 1000) - 1800; // half an hour
    accessory.getData(function (err, deviceData) {
      var motionDetected = false;
      if (deviceData.events) {
        deviceData.events.forEach(function(event) {
          if (event.time > minTimeStamp) {
            motionDetected = motionDetected || event.type == 'movement'
          }
        });
      }
      callback(err, motionDetected);
    }.bind(this));
  };

  var motionSensor = new Service.MotionSensor(accessory.name + " Motion Sensor");
  motionSensor.getCharacteristic(Characteristic.MotionDetected)
      .on('get', getMotionDetected);

  /*
  // Optional Characteristics
  this.addOptionalCharacteristic(Characteristic.StatusActive);
  this.addOptionalCharacteristic(Characteristic.StatusFault);
  this.addOptionalCharacteristic(Characteristic.StatusTampered);
  this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
  */

  return motionSensor;
}