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

  var getThermostatAwayMode = function (callback) {
    accessory.getData(function (err, deviceData) {
      var awayMode = (deviceData.modules[0].setpoint.setpoint_mode === 'away');
      callback(err, awayMode);
    });
  };

  var setThermostatAwayMode = function (value, callback) {
    accessory.device.api.setThermpoint({
      device_id: accessory.deviceId,
      module_id: accessory.moduleId,
      setpoint_mode: (value ? 'away' : 'program')
    }, callback);
    // TODO: call refresh to update cache ?
  };

  var getTargetTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {
      if (deviceData.modules[0].setpoint.setpoint_temp != undefined) {
        callback(null, deviceData.modules[0].setpoint.setpoint_temp);
      } else {
        callback(err, null);
      }
    });
  };

  var setTargetTemperature = function (value, callback) {
    accessory.getData(function (err, deviceData) {
      accessory.device.api.setThermpoint({
        device_id: accessory.deviceId,
        module_id: accessory.moduleId,
        setpoint_mode: 'manual',
        setpoint_temp: value,
        setpoint_endtime: deviceData.modules[0].measured.time + (60 * 60 * 3)
      }, callback);
    });
  };

  var getThermostatHgMode = function (callback) {
    accessory.getData(function (err, deviceData) {
      var awayMode = (deviceData.modules[0].setpoint.setpoint_mode === 'hg');
      callback(err, awayMode);
    });
  };

  var setThermostatHgMode = function (value, callback) {
    accessory.device.api.setThermpoint({
      device_id: accessory.deviceId,
      module_id: accessory.moduleId,
      setpoint_mode: (value ? 'hg' : 'program')
    }, callback);
    // TODO: call refresh to update cache ?
  };

  var getCurrentTemperature = function (callback) {
    accessory.getData(function (err, deviceData) {
      if (deviceData.modules[0].measured.temperature != undefined) {
        callback(null, deviceData.modules[0].measured.temperature);
      } else {
        callback(err, null);
      }
    });
  };


  var thermostatService = new NetatmoThermostatService(accessory.displayName + " Thermostat");

  thermostatService.getCharacteristic(ThermostatAwayModeCharacteristic)
    .on('get', getThermostatAwayMode)
    .on('set', setThermostatAwayMode);

  thermostatService.getCharacteristic(ThermostatHgModeCharacteristic)
    .on('get', getThermostatHgMode)
    .on('set', setThermostatHgMode);

  thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', getCurrentTemperature);

  thermostatService.getCharacteristic(Characteristic.TargetTemperature)
    .on('get', getTargetTemperature)
    .on('set', setTargetTemperature);

/*
    thermostatService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', this.getTemperatureDisplayUnits.bind(this));

Characteristic.TemperatureDisplayUnits.CELSIUS
*/

  return thermostatService;
}
 