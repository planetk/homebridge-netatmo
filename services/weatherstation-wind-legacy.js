'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var WIND_MEASURE_STYPE_ID = "2AFB775E-79E5-4399-B3CD-398474CAE86C";
var WIND_STRENGTH_CTYPE_ID = "9331096F-E49E-4D98-B57B-57803498FA36";
var WIND_ANGLE_CTYPE_ID = "6C3F6DFA-7340-4ED4-AFFD-0E0310ECCD9E";
var GUST_STRENGTH_CTYPE_ID = "1B7F2F7B-EABF-4A54-8F9D-ABBEE08E8A64";
var GUST_ANGLE_CTYPE_ID = "928BD7DE-1CAA-4472-BBEF-0A9166B7949F";

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

  if(stationData.data_type.indexOf('Wind') > -1) {
    services.push(this.buildWindSensor(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildWindSensor = function(accessory, stationData) {

  var WindStrengthCharacteristic = function () {
    Characteristic.call(this, 'Wind Strength', WIND_STRENGTH_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "km/h",
      minValue: 0,
      maxValue: 200,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0;
  };
  inherits(WindStrengthCharacteristic, Characteristic);

  var WindAngleCharacteristic = function () {
    Characteristic.call(this, 'Wind Angle', WIND_ANGLE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "deg",
      minValue: 0,
      maxValue: 360,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0;
  };
  inherits(WindAngleCharacteristic, Characteristic);

  var GustStrengthCharacteristic = function () {
    Characteristic.call(this, 'Gust Strength', GUST_STRENGTH_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "km/h",
      minValue: 0,
      maxValue: 200,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0;
  };
  inherits(GustStrengthCharacteristic, Characteristic);

  var GustAngleCharacteristic = function () {
    Characteristic.call(this, 'Gust Angle', GUST_ANGLE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "deg",
      minValue: 0,
      maxValue: 360,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = 0;
  };
  inherits(GustAngleCharacteristic, Characteristic);

  var WindSensor = function (displayName, subtype) {
    Service.call(this, displayName, WIND_MEASURE_STYPE_ID, subtype);
    this.addCharacteristic(WindAngleCharacteristic);
    this.addCharacteristic(WindStrengthCharacteristic);
    this.addOptionalCharacteristic(GustAngleCharacteristic);
    this.addOptionalCharacteristic(GustStrengthCharacteristic);
  };
  inherits(WindSensor, Service);

  WindSensor.prototype.windStrength = 0;
  WindSensor.prototype.windAngle    = 0;
  WindSensor.prototype.gustStrength = 0;
  WindSensor.prototype.gustAngle    = 0;

  WindSensor.prototype.getWindStrength = function (callback) {
    accessory.getDashboardValue('WindStrength', function(err, value) {
      if (value) {
        this.windStrength = Math.round(value);
      }
      callback(err, this.windStrength);
    }.bind(this));
  };

  WindSensor.prototype.getWindAngle = function (callback) {
    accessory.getDashboardValue('WindAngle', function(err, value) {
      if (value) {
        this.windAngle = Math.round(value);
      }
      callback(err, this.windAngle);
    }.bind(this));
  };

  WindSensor.prototype.getGustStrength= function (callback) {
    accessory.getDashboardValue('GustStrength', function(err, value) {
      if (value) {
        this.gustStrength = Math.round(value);
      }
      callback(err, this.gustStrength);
    }.bind(this));
  };

  WindSensor.prototype.getGustAngle = function (callback) {
    accessory.getDashboardValue('GustAngle', function(err, value) {
      if (value) {
        this.gustAngle = Math.round(value);
      }
      callback(err, this.gustAngle);
    }.bind(this));
  };

  var windSensor = new WindSensor(accessory.displayName + " Wind Sensor");
  windSensor.getCharacteristic(WindStrengthCharacteristic)
    .on('get', windSensor.getWindStrength);
  windSensor.getCharacteristic(WindAngleCharacteristic)
    .on('get', windSensor.getWindAngle);

  var gustAngleCharacteristic = windSensor.getCharacteristic(GustAngleCharacteristic)
      || windSensor.addCharacteristic(GustAngleCharacteristic);
  windSensor.getCharacteristic(GustAngleCharacteristic)
    .on('get', windSensor.getGustAngle);

  var gustStrengthCharacteristic = windSensor.getCharacteristic(GustStrengthCharacteristic)
      || windSensor.addCharacteristic(GustStrengthCharacteristic);
  windSensor.getCharacteristic(GustStrengthCharacteristic)
    .on('get', windSensor.getGustStrength);

  return windSensor;
}