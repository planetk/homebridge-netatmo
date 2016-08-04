'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var EVE_WEATHER_SERVICE_STYPE_ID = 'E863F001-079E-48FF-8F27-9C2605A29F52';
//var EVE_WEATHER_HISTORY_SERVICE_STYPE_ID = 'E863F007-079E-48FF-8F27-9C2605A29F52';

var EVE_AIR_PRESSURE_CTYPE_ID = "E863F10F-079E-48FF-8F27-9C2605A29F52";
var EVE_BATTERY_LEVEL_CTYPE_ID = "E863F11B-079E-48FF-8F27-9C2605A29F52";

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }
  return { ServiceProvider: ServiceProvider};
}

var ServiceProvider = function() {

}

ServiceProvider.prototype.buildServices = function(accessory, stationData) {
  var services = [];

  if(stationData.data_type.indexOf('Pressure') > -1) {
    services.push(this.buildEveWeatherService(accessory, stationData));
  }

  return services;
}

ServiceProvider.prototype.buildEveWeatherService = function(accessory, stationData) {

  var EveAirPressureCharacteristic = function () {
    Characteristic.call(this, 'Air Pressure Sensor', EVE_AIR_PRESSURE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.DATA,
      unit: "hPA", 
      minValue: 500,
      maxValue: 2000,
      minStep: 0.1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = new Buffer('1000', 'hex').toString('base64'); // 1000.0 mbar
  };
  inherits(EveAirPressureCharacteristic, Characteristic);

  var EveBatteryLevelCharacteristic = function () {
    Characteristic.call(this, 'Eve Battery Level', EVE_BATTERY_LEVEL_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT16,
      unit: "PERCENTAGE",
      maxValue: 100,
      minValue: 0,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = 100;
  };
  inherits(EveBatteryLevelCharacteristic, Characteristic);

  var EveWeatherService = function (displayName, subtype) {
    Service.call(this, displayName, EVE_WEATHER_SERVICE_STYPE_ID, subtype);
    this.addCharacteristic(EveAirPressureCharacteristic);
    this.addOptionalCharacteristic(Characteristic.CurrentRelativeHumidity);
    this.addOptionalCharacteristic(Characteristic.CurrentTemperature);
    this.addOptionalCharacteristic(EveBatteryLevelCharacteristic);
  };
  inherits(EveWeatherService, Service);


  EveWeatherService.prototype.airPressure = new Buffer('1000', 'hex').toString('base64');
  EveWeatherService.prototype.batteryLevel = 100;

  EveWeatherService.prototype.getAirPressure = function (callback) {
    var value = 1000 + Math.floor((Math.random() * 50))
    value = value * 10;
    value = ((value & 0xFF) << 8) | ((value >> 8) & 0xFF);
    value = value.toString(16);

    callback(null, new Buffer(value, 'hex').toString('base64'));
    /*
    accessory.getDashboardValue('WindAngle', function(err, value) {
      if (value) {
        this.windAngle = Math.round(value);
      }
      callback(err, this.windAngle);
    }.bind(this));
    */
  };

  EveWeatherService.prototype.getBatteryLevel = function (callback) {
    console.log("get Bat");
    callback(null, 99);
    /*
    accessory.getDashboardValue('WindStrength', function(err, value) {
      if (value) {
        this.windStrength = Math.round(value);
      }
      callback(err, this.windStrength);
    }.bind(this));
    */
  };

  var eveWeatherService = new EveWeatherService(accessory.displayName + " Weather");

  if (stationData.battery_vp) {
    var eveBatteryLevelCharacteristic = eveWeatherService.getCharacteristic(EveBatteryLevelCharacteristic)
      || eveWeatherService.addCharacteristic(EveBatteryLevelCharacteristic);
    eveWeatherService.getCharacteristic(EveBatteryLevelCharacteristic)
      .on('get', eveWeatherService.getBatteryLevel);
  };

  eveWeatherService.getCharacteristic(EveAirPressureCharacteristic)
    .on('get', eveWeatherService.getAirPressure);

  return eveWeatherService;
}