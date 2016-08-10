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

var WelcomeAccessory = function(accessoryDataSource, netatmoDevice) {
  NetatmoAccessory.call(this, accessoryDataSource, netatmoDevice);

  this.moduleType = "welcome";
  this.moduleId = accessoryDataSource.id;
};

WelcomeAccessory.prototype.defaultServices = [
    "motionsensor-homekit"
];

var WelcomeDevice = function(log, api, config) {
  NetatmoDevice.call(this, log, api, config);
  this.deviceType = "welcome";
}
inherits(WelcomeDevice, NetatmoDevice);

WelcomeDevice.prototype.AccessoryType = WelcomeAccessory;

WelcomeDevice.prototype.refresh = function (callback) {
  this.api.getHomeData(function (err, homeData) {

    var accessoryDataSources = {};
    var i, home, len = homeData.homes.length;
    
    for (i=0; i<len; ++i) {
      home = homeData.homes[i];

      home.module_name = home.name;
      home._id = home.id;
      home.firmware = "0.0";
      home.type="welcome";

      this.log("refreshing welcome device " + home._id + " (" + home.module_name + ")");
      accessoryDataSources[home._id] = home;
    }

    this.cache.set(this.deviceType, accessoryDataSources);
    callback(err, accessoryDataSources);
  }.bind(this));
}
