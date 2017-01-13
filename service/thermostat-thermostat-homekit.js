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

  class ThermostatService extends homebridge.hap.Service.Thermostat {
    constructor(accessory) {
      //   var thermostat = new Service.Thermostat(accessory.name + " Thermostat (homekit)");
      super("Thermostat (homekit)");

      this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;

      this.accessory = accessory;

      this.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
        .on('get', this.getCurrentHeatingCoolingState.bind(this));
      this.getCharacteristic(Characteristic.TargetHeatingCoolingState)
        .on('get', this.getTargetHeatingCoolingState.bind(this))
        .on('set', this.setTargetHeatingCoolingState.bind(this));
      this.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getCurrentTemperature.bind(this))
        .eventEnabled = true;
      this.getCharacteristic(Characteristic.TargetTemperature)
        .on('get', this.getTargetTemperature.bind(this))
        .on('set', this.setTargetTemperature.bind(this));
      this.getCharacteristic(Characteristic.TemperatureDisplayUnits)
        .on('get', this.getTemperatureDisplayUnits.bind(this))
        .on('set', this.setTemperatureDisplayUnits.bind(this));

      this.refreshDataInterval = setInterval(function() {
        this.updateCharacteristicsInHomekit();
      }.bind(this), 5000);

    }

    updateCharacteristicsInHomekit() {
      this.setCharacteristic(Characteristic.CurrentHeatingCoolingState,
                this.accessory.currentHeatingCoolingState);
      this.getCharacteristic(Characteristic.CurrentTemperature)
                .updateValue(Math.random() * 20 + 8, null);
//      this.setCharacteristic(Characteristic.CurrentTemperature, Math.random() * 20 + 8;)
    }

    getCurrentHeatingCoolingState(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.currentHeatingCoolingState);
      }.bind(this));
    }

    getTargetHeatingCoolingState(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.targetHeatingCoolingState);
      }.bind(this));
    }

    setTargetHeatingCoolingState(value, callback) {
      callback(null, value);
    }

    getCurrentTemperature(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.currentTemperature);
      }.bind(this));
    }

    getTargetTemperature(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.targetTemperature);
      }.bind(this));
    }

    setTargetTemperature(value, callback) {
      if (value > 30) {
        value = 30;
      }

      if (value == this.accessory.targetTemperature) {
        callback(null, value);
        return;
      }

      this.accessory.setThermpoint('manual', value, function(err, data) {
        callback(err, value);
      }.bind(this));

    }

    // TODO: Fahrenheit
    getTemperatureDisplayUnits(callback) {
      callback(null, this.temperatureDisplayUnits);
    }

    setTemperatureDisplayUnits(value, callback) {
      this.temperatureDisplayUnits = value;
    //currentTemperature.setProps({ unit: value});
      callback(null, this.temperatureDisplayUnits);
    }
  }

  return ThermostatService;
}
 