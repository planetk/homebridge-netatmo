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

  if(stationData.data_type.indexOf('Humidity') > -1) {
    services.push(this.buildHumiditySensor(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildHumiditySensor = function(accessory, stationData) {

  var getCurrentRelativeHumidity = function (callback) {
    accessory.getDashboardValue('Humidity', callback);
  };

  var humiditySensor = new Service.HumiditySensor(accessory.name + " Humidity");
  humiditySensor.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', getCurrentRelativeHumidity);

  return humiditySensor;
}

