'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var lowBatteryLevel = 3000;
  var fullBatteryLevel = 4100;

  var getBatteryLevel = function (callback) {
    accessory.getData(function (err, deviceData) {
      var percent = deviceData.modules[0].battery_percent;
      if (!percent) {
        percent = Math.min(Math.round(deviceData.modules[0].battery_vp / fullBatteryLevel * 100), 100);
      }
      callback(null, percent);
    }.bind(this));
  };

  var getStatusLowBattery = function (callback) {
    accessory.getData(function (err, deviceData) {
      var charge = deviceData.modules[0].battery_vp;
      var level = charge <= lowBatteryLevel ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
      callback(null, level);
    }.bind(this));
  };

  var batteryService = new Service.BatteryService(accessory.displayName + " Battery Level");
  batteryService.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', getBatteryLevel);
  batteryService.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', getStatusLowBattery);

// this.addCharacteristic(Characteristic.ChargingState);
  
  return { Service: batteryService} ; 
}