'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var RAIN_LEVEL_STYPE_ID = "D92D5391-92AF-4824-AF4A-356F25F25EA1";
var RAIN_LEVEL_CTYPE_ID = "C53F35CE-C615-4AA4-9112-EBF679C5EB14";
var RAIN_LEVEL_SUM_1H_CTYPE_ID = "11646117-878C-456B-A770-3924151F773D";
var RAIN_LEVEL_SUM_24H_CTYPE_ID = "E67DDC66-BEB7-4D0C-BD0C-022DB570DABC";

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var RainLevelCharacteristic = function () {
    Characteristic.call(this, 'Rain Level', RAIN_LEVEL_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0.0;
  };
  inherits(RainLevelCharacteristic, Characteristic);

  var RainLevelSum1Characteristic = function () {
    Characteristic.call(this, 'Rain Level (1 hour)', RAIN_LEVEL_SUM_1H_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0.0;
  };
  inherits(RainLevelSum1Characteristic, Characteristic);

  var RainLevelSum24Characteristic = function () {
    Characteristic.call(this, 'Rain Level (24 hours)', RAIN_LEVEL_SUM_24H_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0.0;
  };
  inherits(RainLevelSum24Characteristic, Characteristic);

  var RainLevelSensor = function (displayName, subtype) {
    Service.call(this, displayName, RAIN_LEVEL_STYPE_ID, subtype);

    this.addCharacteristic(RainLevelCharacteristic);
    this.addOptionalCharacteristic(Characteristic.Name);
    this.addOptionalCharacteristic(RainLevelSum1Characteristic);
    this.addOptionalCharacteristic(RainLevelSum24Characteristic);
  };
  inherits(RainLevelSensor, Service);

  RainLevelSensor.prototype.rainLevel      = 0.0;
  RainLevelSensor.prototype.rainLevelSum1  = 0.0;
  RainLevelSensor.prototype.rainLevelSum24 = 0.0;

  RainLevelSensor.prototype.getRainLevel = function (callback) {
    //accessory.getDashboardValue('Rain', callback);
    accessory.getDashboardValue('Rain', function(err, rainValue) {
      if (rainValue) {
        this.rainLevel = Math.round(rainValue * 1000) / 1000;
      }
      callback(err, this.rainLevel);
    }.bind(this));
  };

  RainLevelSensor.prototype.getRainLevelSum1 = function (callback) {
    accessory.getDashboardValue('sum_rain_1', function(err, rainValue) {
      if (rainValue) {
        this.rainLevelSum1 = Math.round(rainValue * 1000) / 1000;
      }
      callback(err, this.rainLevelSum1);
    }.bind(this));
  };

  RainLevelSensor.prototype.getRainLevelSum24 = function (callback) {
    accessory.getDashboardValue('sum_rain_24', function(err, rainValue) {
      if (rainValue) {
        this.rainLevelSum24 = Math.round(rainValue * 1000) / 1000;
      }
      callback(err, this.rainLevelSum24);
    }.bind(this));
  };

  var rainLevelSensor = new RainLevelSensor(accessory.displayName  + " Rain Level");
  rainLevelSensor.getCharacteristic(RainLevelCharacteristic)
      .on('get', rainLevelSensor.getRainLevel);

  var rainLevelSum1Characteristic = rainLevelSensor.getCharacteristic(RainLevelSum1Characteristic)
      || rainLevelSensor.addCharacteristic(RainLevelSum1Characteristic);
  rainLevelSensor.getCharacteristic(RainLevelSum1Characteristic)
      .on('get', rainLevelSensor.getRainLevelSum1);

  var rainLevelSum24Characteristic = rainLevelSensor.getCharacteristic(RainLevelSum24Characteristic)
      || rainLevelSensor.addCharacteristic(RainLevelSum24Characteristic);
  rainLevelSensor.getCharacteristic(RainLevelSum24Characteristic)
      .on('get', rainLevelSensor.getRainLevelSum24);

  return { Service: rainLevelSensor};
}