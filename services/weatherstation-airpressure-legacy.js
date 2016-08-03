'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var ATMOSPHERIC_PRESSURE_STYPE_ID = "B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE";
var ATMOSPHERIC_PRESSURE_CTYPE_ID = "28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB";

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

  if(stationData.data_type.indexOf('Pressure') > -1) {
    services.push(this.buildAtmosphericPressureSensor(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildAtmosphericPressureSensor = function(accessory, stationData) {

  var AtmosphericPressureCharacteristic = function () {
    Characteristic.call(this, 'Atmospheric Pressure', ATMOSPHERIC_PRESSURE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "mbar",
      minValue: 800,
      maxValue: 1200,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(AtmosphericPressureCharacteristic, Characteristic);

  var AtmosphericPressureSensor = function (displayName, subtype) {
    Service.call(this, displayName, ATMOSPHERIC_PRESSURE_STYPE_ID, subtype);
    this.addCharacteristic(AtmosphericPressureCharacteristic);
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(AtmosphericPressureSensor, Service);

  var getAtmosphericPressure = function (callback) {
    accessory.getDashboardValue('Pressure', callback);
  };

  var atmosphericPressureSensor = new AtmosphericPressureSensor(accessory.displayName + " Atmospheric Pressure");
  atmosphericPressureSensor.getCharacteristic(AtmosphericPressureCharacteristic)
    .on('get', getAtmosphericPressure);

  return atmosphericPressureSensor;
}