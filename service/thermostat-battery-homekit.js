'use strict';

var homebridge;
var Characteristic;

const LOW_BATTERY_LEVEL = 3000;
const FULL_BATTERY_LEVEL = 4100;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class BatteryService extends homebridge.hap.Service.BatteryService {
    constructor() {
      super("BatteryLevel");
      this.getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.getBatteryLevel);
      this.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery);
    }

    getBatteryLevel(callback) {
      callback(null, 20);
    }

    getStatusLowBattery(callback) {
      callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
    }
  }
  
  return BatteryService;
}