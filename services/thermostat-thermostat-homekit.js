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

  services.push(this.buildThermostatService(accessory, stationData));

  return services;
}

ServiceProvider.prototype.buildThermostatService = function(accessory, stationData) {

  var thermostat = new Service.Thermostat(accessory.name + " Thermostat (homekit)");
  var currentTemperature = thermostat.getCharacteristic(Characteristic.CurrentTemperature);
  
  thermostat.targetTemperature = 10.0;
  thermostat.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;

  thermostat.getTemperatureDisplayUnits = function (callback) {
    callback(null, this.temperatureDisplayUnits);
  };

  thermostat.setTemperatureDisplayUnits = function (value, callback) {
    this.temperatureDisplayUnits = value;
    currentTemperature.setProps({ unit: value});
    callback(null, this.temperatureDisplayUnits);
  };
 
  thermostat.getTargetTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].setpoint && deviceData.modules[0].setpoint.setpoint_temp != undefined) {
        this.targetTemperature = deviceData.modules[0].setpoint.setpoint_temp;
      }
      if (this.targetTemperature < 10){
        this.targetTemperature = 10;
      }



      callback(err, this.targetTemperature);
    }.bind(this));
  };

  thermostat.setTargetTemperature = function (value, callback) {
    if (value > 30) {
      value = 30;
    }

    if (value == this.targetTemperature) {
      callback(null, value);
      return;
    }

    this.targetTemperature = value;
    accessory.getData(function (err, deviceData) {
      accessory.device.api.setThermpoint({
        device_id: accessory.deviceId,
        module_id: accessory.moduleId,
        setpoint_mode: 'manual',
        setpoint_temp: this.targetTemperature,
        setpoint_endtime: deviceData.modules[0].measured.time + (60 * 60 * 3)
      }, function(err, value) {
        accessory.device.cache.flushAll();
        callback(err, value);
      });
    }.bind(this));
  };

  thermostat.getCurrentTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].measured && deviceData.modules[0].measured.temperature != undefined) {
        this.currentTemperature = deviceData.modules[0].measured.temperature;
      }
      callback(err, this.currentTemperature);
    }.bind(this));
  };

  thermostat.getCurrentHeatingCoolingState = function (callback) {
    /*
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].measured && deviceData.modules[0].measured.temperature != undefined) {
        this.currentTemperature = deviceData.modules[0].measured.temperature;
      }
      callback(err, this.currentTemperature);
    }.bind(this));
    */
    callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
  };

  thermostat.getTargetHeatingCoolingState = function (callback) {
    /*
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].measured && deviceData.modules[0].measured.temperature != undefined) {
        this.currentTemperature = deviceData.modules[0].measured.temperature;
      }
      callback(err, this.currentTemperature);
    }.bind(this));
    */
    callback(null, Characteristic.TargetHeatingCoolingState.HEAT);
  };

  thermostat.setTargetHeatingCoolingState = function (value, callback) {
    callback(null, value);
  
    /*
    if (value > 30) {
      value = 30;
    }

    if (value == this.targetTemperature) {
      callback(null, value);
      return;
    }

    this.targetTemperature = value;
    accessory.getData(function (err, deviceData) {
      accessory.device.api.setThermpoint({
        device_id: accessory.deviceId,
        module_id: accessory.moduleId,
        setpoint_mode: 'manual',
        setpoint_temp: this.targetTemperature,
        setpoint_endtime: deviceData.modules[0].measured.time + (60 * 60 * 3)
      }, function(err, value) {
        accessory.device.cache.flushAll();
        callback(err, value);
      });
    }.bind(this));
    */
  };

  thermostat.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
    .on('get', thermostat.getCurrentHeatingCoolingState)
    ;

/*
            heatingOn: (thermostat.therm_relay_cmd !== 0),
            setPoint: thermostat.measured.setpoint_temp,
            mode: thermostat.setpoint.setpoint_mode,
*/

 // heatingOn:  (thermostat.therm_relay_cmd !== 0),

  thermostat.getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('get', thermostat.getTargetHeatingCoolingState)
      .on('set', thermostat.setTargetHeatingCoolingState)
      ;
    
//!! get
//!! set
    thermostat.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', thermostat.getCurrentTemperature);
    thermostat.getCharacteristic(Characteristic.TargetTemperature)
      .on('get', thermostat.getTargetTemperature)
      .on('set', thermostat.setTargetTemperature);
    thermostat.getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', thermostat.getTemperatureDisplayUnits)
      .on('set', thermostat.setTemperatureDisplayUnits);

/*
  // Optional Characteristics
  this.addOptionalCharacteristic(Characteristic.CurrentRelativeHumidity);
  this.addOptionalCharacteristic(Characteristic.TargetRelativeHumidity);
  this.addOptionalCharacteristic(Characteristic.CoolingThresholdTemperature);
!!  this.addOptionalCharacteristic(Characteristic.HeatingThresholdTemperature);
!!  this.addOptionalCharacteristic(Characteristic.Name);
*/

  return thermostat;
}
 