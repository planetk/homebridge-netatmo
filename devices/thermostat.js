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

    var acc = ThermostatAccessory.prototype;
    inherits(ThermostatAccessory, NetatmoAccessory);
    ThermostatAccessory.prototype.parent = NetatmoAccessory.prototype;
    for (var mn in acc) {
      ThermostatAccessory.prototype[mn] = acc[mn];
    }
  }

  return {
    Device: ThermostatDevice
  };
};


var ThermostatAccessory = function(stationData, netAtmoDevice) {
  NetatmoAccessory.call(this, stationData, netAtmoDevice);
  this.moduleId = stationData.modules[0]._id;

  this.serviceTypes = [ "battery", "thermostat" ];

  var serviceTypes = netAtmoDevice.config.serviceTypes || 
                          [
                            "thermostat-legacy",
                            "battery-homekit"
                          ];

  for (var i = 0; i < serviceTypes.length; i++) {
    var serviceType = serviceTypes[i];
    if(this.supportsService(serviceType)) {
      var service = require('./../services/thermostat-' + serviceType + '.js')(this);
      this.addService(service.Service);
    }
  };

};

ThermostatAccessory.prototype.supportsService = function (serviceType) {
  var serviceInfo = serviceType.split('-');
  return this.serviceTypes.indexOf(serviceInfo[0]) > -1;
};


var ThermostatDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "thermostat";
}
inherits(ThermostatDevice, NetatmoDevice);

ThermostatDevice.prototype.refresh = function (callback) {
  this.api.getThermostatsData(function (err, devices) {
    // querying for the device infos and the main module
    var i, device, len = devices.length;
    var thermostats = {};
    
    for (i=0; i<len; ++i) {
      device = devices[i];
      device.module_name = device.station_name; // Multiple ??
      // device.module_name = device.station_name + " " + device.module_name

      this.log("refreshing thermostat device " + device._id + " (" + device.module_name + ")");
      thermostats[device._id] = device;

    }
    this.cache.set(this.deviceType, thermostats);

    callback(err, thermostats);
  }.bind(this));

}

ThermostatDevice.prototype.buildAccessories = function (callback) {
  var accessories = [];
  this.load(function(err, devices) {
    for (var id in devices) {
      var deviceData = devices[id];
      var accesory = new ThermostatAccessory(deviceData, this);
      accessories.push(accesory);
    };
    callback(accessories);
  }.bind(this));
}
