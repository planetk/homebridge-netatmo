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

    var acc = WelcomeAccessory.prototype;
    inherits(WelcomeAccessory, NetatmoAccessory);
    WelcomeAccessory.prototype.parent = NetatmoAccessory.prototype;
    for (var mn in acc) {
      WelcomeAccessory.prototype[mn] = acc[mn];
    }
  }

  return {
    Device: WelcomeDevice
  };
};

var WelcomeAccessory = function(homeData, netAtmoDevice) {
  NetatmoAccessory.call(this, homeData, netAtmoDevice);

  this.moduleType = "welcome";
  this.moduleId = homeData.id;
};

WelcomeAccessory.prototype.defaultServices = [
/*
    "thermostat-legacy",
    "battery-homekit"
*/
];

var WelcomeDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "welcome";
}
inherits(WelcomeDevice, NetatmoDevice);

WelcomeDevice.prototype.refresh = function (callback) {
  this.api.getHomeData(function (err, homeData) {

    var homeDevices = {};
    var i, home, len = homeData.homes.length;
    
    for (i=0; i<len; ++i) {
      home = homeData.homes[i];

      home.module_name = home.name;
      home._id = home.id;
      home.firmware = "0.0";

      this.log("refreshing thermostat device " + device._id + " (" + device.module_name + ")");
      homeDevices[home._id] = home;
    }

    this.cache.set(this.deviceType, homeDevices);
    callback(err, homeDevices});
  }.bind(this));
}

WelcomeDevice.prototype.buildAccessories = function (callback) {
  var accessories = [];
  this.load(function(err, homeDevices) {
    for (var id in homeDevices) {
      var deviceData = homeDevices[id];
      var accesory = new WelcomeAccessory(deviceData, this);
      accessories.push(accesory);
    };
    callback(accessories);
  }.bind(this));
}
