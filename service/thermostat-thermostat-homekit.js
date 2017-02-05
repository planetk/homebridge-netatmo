'use strict';

var homebridge;
var Characteristic;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class ThermostatService extends homebridge.hap.Service.Thermostat {
    constructor(accessory) {
      super(accessory.name + " Thermostat");
      this.accessory = accessory;

      this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;

      this.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
        .on('get', this.getCurrentHeatingCoolingState.bind(this))
        .eventEnabled = true;

      this.getCharacteristic(Characteristic.TargetHeatingCoolingState)
        .on('get', this.getTargetHeatingCoolingState.bind(this))
        .on('set', this.setTargetHeatingCoolingState.bind(this))
        .eventEnabled = true;

      this.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getCurrentTemperature.bind(this))
        .eventEnabled = true;
      
      this.getCharacteristic(Characteristic.TargetTemperature)
        .on('get', this.getTargetTemperature.bind(this))
        .on('set', this.setTargetTemperature.bind(this))
        .eventEnabled = true;
      
      this.getCharacteristic(Characteristic.TemperatureDisplayUnits)
        .on('get', this.getTemperatureDisplayUnits.bind(this))
        .on('set', this.setTemperatureDisplayUnits.bind(this));

    }

    updateCharacteristics() {
      this.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
            .updateValue(this.accessory.currentHeatingCoolingState);
      this.getCharacteristic(Characteristic.TargetHeatingCoolingState)
            .updateValue(this.accessory.targetHeatingCoolingState);
      this.getCharacteristic(Characteristic.CurrentTemperature)
            .updateValue(this.accessory.currentTemperature);
      // TODO: Unter 10 -> Was tun?
      this.getCharacteristic(Characteristic.TargetTemperature)
            .updateValue(this.accessory.targetTemperature);
    }

    getCurrentHeatingCoolingState(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.currentHeatingCoolingState);
      }.bind(this));
    }

    getCurrentTemperature(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.currentTemperature);
      }.bind(this));
    }

    getTargetHeatingCoolingState(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.targetHeatingCoolingState);
      }.bind(this));
    }

    setTargetHeatingCoolingState(value, callback) {

        if (this.accessory.targetHeatingCoolingState === value) {
            callback(null, value);
            return;
        }

        switch (value) {
          case Characteristic.TargetHeatingCoolingState.OFF:
            this.accessory.setThermpoint('off', this.accessory.targetTemperature, function(err, data) {
              callback(err, value);
            }.bind(this));
            break;
          case Characteristic.TargetHeatingCoolingState.COOL:
            this.accessory.setThermpoint('hg', this.accessory.targetTemperature, function(err, data) {
              callback(err, value);
            }.bind(this));
            break;
          case Characteristic.TargetHeatingCoolingState.HEAT:
            this.accessory.setThermpoint('max', this.accessory.targetTemperature, function(err, data) {
              callback(err, value);
            }.bind(this));
            break;
          default: // Characteristic.TargetHeatingCoolingState.AUTO:
            this.accessory.setThermpoint('program', this.accessory.targetTemperature, function(err, data) {
              callback(err, value);
            }.bind(this));
        }
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
};
 