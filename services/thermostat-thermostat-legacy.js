'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var THERM_HG_CTYPE_ID = "3674CD3A-16AF-4C9D-8492-E466B753A697";
var THERM_AWAY_CTYPE_ID = "D5806A47-948D-4707-B350-EF4637B93539";
var THERMOSTAT_STYPE_ID = "43EB2466-3B98-457E-9EE9-BD6E735E6CBF";

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

  var ThermostatAwayModeCharacteristic = function () {
    Characteristic.call(this, 'Mode Absent', THERM_AWAY_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.BOOL,
      minValue: 0,
      maxValue: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.WRITE,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(ThermostatAwayModeCharacteristic, Characteristic);

  var ThermostatHgModeCharacteristic = function () {
    Characteristic.call(this, 'Mode Hors Gel', THERM_HG_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.BOOL,
      minValue: 0,
      maxValue: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.WRITE,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(ThermostatHgModeCharacteristic, Characteristic);

  var NetatmoThermostatService = function (displayName, subtype) {
    Service.call(this, displayName, THERMOSTAT_STYPE_ID, subtype);

    // Required Characteristics
    this.addCharacteristic(ThermostatAwayModeCharacteristic);
    this.addCharacteristic(ThermostatHgModeCharacteristic);
    this.addCharacteristic(Characteristic.CurrentTemperature);
    this.addCharacteristic(Characteristic.TargetTemperature);
    this.addCharacteristic(Characteristic.TemperatureDisplayUnits);
    // This went to Battery Service !
    //this.addCharacteristic(Characteristic.BatteryLevel);
    //this.addCharacteristic(Characteristic.StatusLowBattery);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(NetatmoThermostatService, Service);

  NetatmoThermostatService.prototype.awayMode = false;
  NetatmoThermostatService.prototype.hgMode = false;
  NetatmoThermostatService.prototype.targetTemperature = 0.0;
  NetatmoThermostatService.prototype.currentTemperature = 0.0;

  NetatmoThermostatService.prototype.getThermostatAwayMode = function (callback) {
    accessory.getData(function (err, deviceData) {
      if (deviceData.modules[0].setpoint) {
        this.awayMode = (deviceData.modules[0].setpoint.setpoint_mode === 'away');
      }
      callback(err, this.awayMode);
    }.bind(this));
  };

  NetatmoThermostatService.prototype.setThermostatAwayMode = function (value, callback) {
    this.awayMode = value;
    accessory.device.api.setThermpoint({
      device_id: accessory.deviceId,
      module_id: accessory.moduleId,
      setpoint_mode: (this.awayMode ? 'away' : 'program')
    }, function(err, value) {
      accessory.device.cache.flushAll();
      callback(err, value);
    });
  };

  NetatmoThermostatService.prototype.getThermostatHgMode = function (callback) {
    accessory.getData(function (err, deviceData) {
      if (deviceData.modules[0].setpoint) {
        this.hgMode = (deviceData.modules[0].setpoint.setpoint_mode === 'hg');
      }
      callback(err, this.hgMode);
    }.bind(this));
  };

  NetatmoThermostatService.prototype.setThermostatHgMode = function (value, callback) {
    this.hgMode = value;
    accessory.device.api.setThermpoint({
      device_id: accessory.deviceId,
      module_id: accessory.moduleId,
      setpoint_mode: (this.hgMode ? 'hg' : 'program')
    }, function(err, value) {
      accessory.device.cache.flushAll();
      callback(err, value);
    });
  };

  NetatmoThermostatService.prototype.getTargetTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].setpoint && deviceData.modules[0].setpoint.setpoint_temp != undefined) {
        this.targetTemperature = deviceData.modules[0].setpoint.setpoint_temp;
      }
      callback(err, this.targetTemperature);
    }.bind(this));
  };

  NetatmoThermostatService.prototype.setTargetTemperature = function (value, callback) {
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

  NetatmoThermostatService.prototype.getCurrentTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {

      if (deviceData.modules[0].measured && deviceData.modules[0].measured.temperature != undefined) {
        this.currentTemperature = deviceData.modules[0].measured.temperature;
      }
      callback(err, this.currentTemperature);
    }.bind(this));
  };

  var thermostatService = new NetatmoThermostatService(accessory.name + " Thermostat");
 
  thermostatService.getCharacteristic(ThermostatAwayModeCharacteristic)
    .on('get', thermostatService.getThermostatAwayMode)
    .on('set', thermostatService.setThermostatAwayMode);

  thermostatService.getCharacteristic(ThermostatHgModeCharacteristic)
    .on('get', thermostatService.getThermostatHgMode)
    .on('set', thermostatService.setThermostatHgMode);

  thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', thermostatService.getCurrentTemperature);

  thermostatService.getCharacteristic(Characteristic.TargetTemperature)
    .on('get', thermostatService.getTargetTemperature)
    .on('set', thermostatService.setTargetTemperature);

/*
    thermostatService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', this.getTemperatureDisplayUnits.bind(this));

Characteristic.TemperatureDisplayUnits.CELSIUS
*/

  return thermostatService;
}
 