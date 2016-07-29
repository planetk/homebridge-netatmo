'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var getAirQuality = function (callback) {
    accessory.getDashboardValue('CO2', function(err, level) {
      var quality = Characteristic.AirQuality.UNKNOWN;
      if (level > 2000) quality = Characteristic.AirQuality.POOR;
      else if (level > 1500) quality = Characteristic.AirQuality.INFERIOR;
      else if (level > 1000) quality = Characteristic.AirQuality.FAIR;
      else if (level > 500) quality = Characteristic.AirQuality.GOOD;
      else if (level > 250) quality = Characteristic.AirQuality.EXCELLENT;
      callback(err, quality);
    });
  };

  var airQualitySensor = new Service.AirQualitySensor(accessory.displayName + " Air Quality");
  airQualitySensor.getCharacteristic(Characteristic.AirQuality)
    .on('get', getAirQuality);

  return { Service: airQualitySensor} ; 
}
