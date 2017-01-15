'use strict';

var homebridge;
var Characteristic;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class BatteryService extends homebridge.hap.Service.BatteryService {
    constructor(accessory) {
      super(accessory.name + " Battery Level");
      this.accessory = accessory;

      this.getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.getBatteryLevel.bind(this))
        .eventEnabled = true;
      this.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this))
        .eventEnabled = true;
      this.getCharacteristic(Characteristic.ChargingState)
        .on('get', this.getChargingState.bind(this));
    }
    
    getBatteryLevel(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.batteryPercent);
      }.bind(this));
    }

    getStatusLowBattery(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.lowBattery ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      }.bind(this));
    }

    getChargingState(callback) {
      callback(null, Characteristic.ChargingState.NOT_CHARGING);
    }

    updateCharacteristics() {
      this.getCharacteristic(Characteristic.BatteryLevel)
            .updateValue(this.accessory.batteryPercent);
      this.getCharacteristic(Characteristic.StatusLowBattery)
            .updateValue(this.accessory.lowBattery ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    }
  }
  
  return BatteryService;
}