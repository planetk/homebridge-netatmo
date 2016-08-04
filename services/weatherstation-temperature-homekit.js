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

  if(stationData.data_type.indexOf('Temperature') > -1) {
    services.push(this.buildTemperatureSensor(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildTemperatureSensor = function(accessory, stationData) {

  var getCurrentTemperature = function (callback) {
    accessory.getDashboardValue('Temperature', callback);
  };

  var temperatureSensor = new Service.TemperatureSensor(accessory.name + " Temperature");
  var currentTemperatureCharacteristics = 
          temperatureSensor.getCharacteristic(Characteristic.CurrentTemperature)
  currentTemperatureCharacteristics.setProps({minValue: -100});
  currentTemperatureCharacteristics.on('get', getCurrentTemperature);

  return temperatureSensor;

}
