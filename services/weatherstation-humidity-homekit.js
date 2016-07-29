'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var getCurrentRelativeHumidity = function (callback) {
    accessory.getDashboardValue('Humidity', callback);
  };

  var humiditySensor = new Service.HumiditySensor(accessory.displayName + " Humidity");
  humiditySensor.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', getCurrentRelativeHumidity);

  return { Service: humiditySensor} ; 
}

