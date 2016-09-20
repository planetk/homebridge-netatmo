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


var ThermostatAccessory = function(accessoryDataSources, netAtmoDevice) {
  NetatmoAccessory.call(this, accessoryDataSources, netAtmoDevice);
  this.moduleType = accessoryDataSources.modules[0].type;
  this.moduleId = accessoryDataSources.modules[0]._id;
};

ThermostatAccessory.prototype.defaultServices = [
    "thermostat-legacy",
    "battery-homekit"
];

var ThermostatDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "thermostat";
}
inherits(ThermostatDevice, NetatmoDevice);

ThermostatDevice.prototype.AccessoryType = ThermostatAccessory;


ThermostatDevice.prototype.refresh = function (callback) {
  this.api.getThermostatsData(function (err, devices) {
    // querying for the device infos and the main module
    var i, device, len = devices.length;
    var accessoryDataSources = {};
    
    for (i=0; i<len; ++i) {
      device = devices[i];
      device.module_name = device.station_name; // Multiple ??
      // device.module_name = device.station_name + " " + device.module_name

      this.log.debug("Refreshing thermostat device " + device._id + " (" + device.module_name + ")");
      accessoryDataSources[device._id] = device;

    }
    this.cache.set(this.deviceType, accessoryDataSources);

    callback(err, accessoryDataSources);
  }.bind(this));

}
