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

  if(stationData.battery_vp) {
    services.push(this.buildBatteryService(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildBatteryService = function(accessory, stationData) {

  var lowBatteryLevel = function(deviceData) {
    var levels = {
      NAMain: 4560,
      NAModule1: 4000,
      NAModule2: 4360,
      NAModule3: 4000,
      NAModule4: 4560
    }

    if (levels[deviceData.type]) {
      return levels[deviceData.type];
    }
    return 4560;
  }

  var fullBatteryLevel = function(deviceData) {
    var levels = {
      NAMain: 5640,
      NAModule1: 5500,
      NAModule2: 5590,
      NAModule3: 5500,
      NAModule4: 5640
    }

    if (levels[deviceData.type]) {
      return levels[deviceData.type];
    }
    return 5640;
  };

  var getBatteryLevel = function (callback) {
    accessory.getData(function (err, deviceData) {
      var percent = deviceData.battery_percent;
      if (!percent) {
        percent = Math.min(Math.round(deviceData.battery_vp / fullBatteryLevel(deviceData) * 100), 100);
      }
      callback(null, percent);
    }.bind(this));
  };

  var getStatusLowBattery = function (callback) {
    accessory.getData(function (err, deviceData) {
      var charge = deviceData.battery_vp;
      var level = charge <= lowBatteryLevel(deviceData) ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
      callback(null, level);
    }.bind(this));
  };

  var batteryService = new Service.BatteryService(accessory.displayName + " Battery Level");
  batteryService.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', getBatteryLevel);
  batteryService.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', getStatusLowBattery);

// this.addCharacteristic(Characteristic.ChargingState);

  return batteryService;
}