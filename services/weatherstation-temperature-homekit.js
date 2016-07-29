'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var getCurrentTemperature = function (callback) {
    accessory.getDashboardValue('Temperature', callback);
  };

  var temperatureSensor = new Service.TemperatureSensor(accessory.displayName + " Temperature");
  var currentTemperatureCharacteristics = 
  					temperatureSensor.getCharacteristic(Characteristic.CurrentTemperature)
  currentTemperatureCharacteristics.setProps({minValue: -100});
  currentTemperatureCharacteristics.on('get', getCurrentTemperature);
  return { Service: temperatureSensor} ; 
}

