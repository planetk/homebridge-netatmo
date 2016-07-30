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
    this.value = this.getDefaultValue();
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
    this.value = this.getDefaultValue();
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
    this.value = this.getDefaultValue();
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
    this.value = this.getDefaultValue();
  };
  inherits(GustAngleCharacteristic, Characteristic);

  var WindSensor = function (displayName, subtype) {
    Service.call(this, displayName, WIND_MEASURE_STYPE_ID, subtype);
    this.addCharacteristic(WindAngleCharacteristic);
    this.addCharacteristic(WindStrengthCharacteristic);
    this.addOptionalCharacteristic(GustAngleCharacteristic);
    this.addOptionalCharacteristic(GustStrengthCharacteristic);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(WindSensor, Service);

  var getWindStrength = function (callback) {
    accessory.getDashboardValue('WindStrength', callback);
  };

  var getWindAngle = function (callback) {
    accessory.getDashboardValue('WindAngle', callback);
  };

  var getGustStrength= function (callback) {
    accessory.getDashboardValue('GustStrength', callback);
  };

  var getGustAngle = function (callback) {
    accessory.getDashboardValue('GustAngle', callback);
  };

  var windSensor = new WindSensor(accessory.displayName + " Wind Sensor");
  windSensor.getCharacteristic(WindStrengthCharacteristic)
    .on('get', getWindStrength);
  windSensor.getCharacteristic(WindAngleCharacteristic)
    .on('get', getWindAngle);


  var gustAngleCharacteristic = windSensor.getCharacteristic(GustAngleCharacteristic)
      || windSensor.addCharacteristic(GustAngleCharacteristic);
  windSensor.getCharacteristic(GustAngleCharacteristic)
    .on('get', getGustAngle);

  var gustStrengthCharacteristic = windSensor.getCharacteristic(GustStrengthCharacteristic)
      || windSensor.addCharacteristic(GustStrengthCharacteristic);
  windSensor.getCharacteristic(GustStrengthCharacteristic)
    .on('get', getGustStrength);

  return { Service: windSensor};
}