'use strict';

var inherits = require('util').inherits;
var NetatmoDevice = require("../lib/netatmo-device");

var homebridge;
var Service, Characteristic, Accessory, uuid;
var NetatmoAccessory;
var exportedTypes;

module.exports = function(pHomebridge) {
  if (pHomebridge && !Accessory) {
    homebridge = pHomebridge;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    uuid = homebridge.hap.uuid;

    NetatmoAccessory = require("../lib/netatmo-accessory")(pHomebridge);

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
    "thermostat-homekit",
    "battery-homekit"
];

class ThermostatDevice extends NetatmoDevice {
  constructor(log, api, config) {
    super(log, api, config);
    this.deviceType = "thermostat";
  }
}

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
