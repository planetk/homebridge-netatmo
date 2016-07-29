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

  this.serviceTypes = stationData.data_type;
  if (stationData.battery_vp) {
    this.serviceTypes.push("Battery");
  }
  // TODO: Add battery to serviceTypes ...

  var serviceTypes = netAtmoDevice.config.serviceTypes || 
                          [
                            "temperature-homekit",
                            "humidity-homekit",
                            "co2-homekit",
                            "airquality-homekit",
                            "noiselevel-legacy",
                            "airpressure-legacy",
                            "rain-legacy",
                            "wind-legacy",
                            "battery-homekit",
                          ];

  for (var i = 0; i < serviceTypes.length; i++) {
    var serviceType = serviceTypes[i];
    if(this.supportsService(serviceType)) {
      var service = require('./../services/weatherstation-' + serviceType + '.js')(this);
      this.addService(service.Service);
    }
  };
};

WeatherStationAccessory.prototype.supportsService = function (serviceType) {
  var serviceInfo = serviceType.split('-');
  // TODO: Lookup Map!
  if(serviceInfo[0] == 'temperature') {
    return this.serviceTypes.indexOf('Temperature') > -1;
  }
  if(serviceInfo[0] == 'humidity') {
    return this.serviceTypes.indexOf('Humidity') > -1;
  }
  if(serviceInfo[0] == 'co2') {
    return this.serviceTypes.indexOf('CO2') > -1;
  }
  if(serviceInfo[0] == 'airquality') {
    return this.serviceTypes.indexOf('CO2') > -1;
  }
  if(serviceInfo[0] == 'noiselevel') {
    return this.serviceTypes.indexOf('Noise') > -1;
  }
  if(serviceInfo[0] == 'wind') {
    return this.serviceTypes.indexOf('Wind') > -1;
  }
  if(serviceInfo[0] == 'rain') {
    return this.serviceTypes.indexOf('Rain') > -1;
  }
  if(serviceInfo[0] == 'battery') {
    return this.serviceTypes.indexOf('Battery') > -1;
  }
  return false;
};


var WeatherStationDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "weatherstation";
}
inherits(WeatherStationDevice, NetatmoDevice);

WeatherStationDevice.prototype.refresh = function (callback) {
  this.api.getStationsData(function (err, devices) {
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
        var module = modules[j];
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
