'use strict;'

var inherits = require('util').inherits;
var NetatmoDevice = require("../lib/netatmo-device");

var Service, Characteristic, Accessory, uuid;
var NetatmoAccessory;
var exportedTypes;

module.exports = function(pExportedTypes, config) {
  if (pExportedTypes && !Accessory) {
    exportedTypes = pExportedTypes;
    Service = exportedTypes.Service;
    Characteristic = exportedTypes.Characteristic;
    Accessory = exportedTypes.Accessory;
    uuid = exportedTypes.uuid;

    NetatmoAccessory = require("../lib/netatmo-accessory")(exportedTypes);

    var acc = WeatherStationAccessory.prototype;
    inherits(WeatherStationAccessory, NetatmoAccessory);
    WeatherStationAccessory.prototype.parent = NetatmoAccessory.prototype;
    for (var mn in acc) {
      WeatherStationAccessory.prototype[mn] = acc[mn];
    }
  }

  return {
    Device: WeatherStationDevice
  };
};

var WeatherStationAccessory = function(stationData, netAtmoDevice) {
  NetatmoAccessory.call(this, stationData, netAtmoDevice);
  this.moduleType = stationData.type;
  this.serviceTypes = stationData.data_type;
  if (stationData.battery_vp) {
    this.serviceTypes.push("Battery");
  }

};

WeatherStationAccessory.prototype.defaultServices = [
        "temperature-homekit",
        "humidity-homekit",
        "co2-homekit",
        "airquality-homekit",
        "noiselevel-legacy",
        "airpressure-legacy",
        "rain-legacy",
        "wind-legacy",
        "battery-homekit"
//        "eveweatherhistory-elgato",
//        "eveweather-elgato"
];

var WeatherStationDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "weatherstation";
}
inherits(WeatherStationDevice, NetatmoDevice);

WeatherStationDevice.prototype.refresh = function (callback) {
  var options = this.config["options_weather"]
 
  this.api.getStationsData(options, function (err, devices) {
    // querying for the device infos and the main module
    var i, device, len = devices.length;
    var weatherstations = {};
    
    for (i=0; i<len; ++i) {
      device = devices[i];
      device.module_name = device.station_name + " " + device.module_name

      this.log("refreshing weatherstation device " + device._id + " (" + device.module_name + ")");
      weatherstations[device._id] = device;

      // querying for the extra modules
      var modulecount = device.modules.length;
      for (var j = 0; j < modulecount; j++) {
        var module = device.modules[j];
        module.module_name = device.station_name + " " + module.module_name
        this.log("refreshing weatherstation module " + module._id + " (" + module.module_name + ")");
        weatherstations[module._id] = module;
      }
    }
    this.cache.set(this.deviceType, weatherstations);

    callback(err, weatherstations);
  }.bind(this));

}

WeatherStationDevice.prototype.buildAccessories = function (callback) {
  var accessories = [];
  this.load(function(err, devices) {
    for (var id in devices) {
      var deviceData = devices[id];
      var accesory = new WeatherStationAccessory(deviceData, this);
      accessories.push(accesory);
    };
    callback(accessories);
  }.bind(this));
}
