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

  if(stationData.data_type.indexOf('CO2') > -1) {
    services.push(this.buildCarbonDioxideSensor(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildCarbonDioxideSensor = function(accessory, stationData) {

  var getCarbonDioxideDetected = function (callback) {
    accessory.getDashboardValue('CO2', function(err, co2Value) {
      var result = (co2Value > 1000 ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL);
      callback(err, result);
    });
  };

  var getCarbonDioxideLevel = function (callback) {
    accessory.getDashboardValue('CO2', callback);
  };

  var carbonDioxideSensor = new Service.CarbonDioxideSensor(accessory.name + " Carbon Dioxide");

  var carbonDioxideLevelCharacteristic = carbonDioxideSensor.getCharacteristic(Characteristic.CarbonDioxideLevel)
      || carbonDioxideSensor.addCharacteristic(Characteristic.CarbonDioxideLevel);

  carbonDioxideSensor.getCharacteristic(Characteristic.CarbonDioxideDetected)
    .on('get', getCarbonDioxideDetected);
  carbonDioxideLevelCharacteristic
    .on('get', getCarbonDioxideLevel);

  return carbonDioxideSensor;
}
