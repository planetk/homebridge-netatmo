'use strict';

const DEFAULT_CACHE_TTL = 10; // 10 seconds caching - use config["ttl"] to override
var NodeCache = require("node-cache");

class NetatmoDevice {
  constructor(log, api, config) {
    this.api = api;
    this.log = log;
    this.AccessoryType = {};
    var ttl = typeof config["ttl"] !== 'undefined' ? config["ttl"] : DEFAULT_CACHE_TTL;
    this.cache = new NodeCache({stdTTL: ttl});
    this.config = config;

    this.deviceData = null;
    this.accessories = [];
    this.refreshRequired = false;
    this.refreshRunning = false;

    this.runCheckInterval = setInterval(function() {
      if(!this.refreshRunning ) {
        this.refreshRunning = true;
        this.log.debug(">>>> Checking for update");
        if(this.refreshRequired) {
          this.refreshRequired=false;
          this.refreshDeviceData(function(err, data, oldData) {
            if (this.accessories) {
              this.accessories.forEach(function( accessory ) {
                accessory.notifyUpdate(data,oldData);
              }.bind(this));
            }
            this.refreshRunning = false;
          }.bind(this));
        } else {
          this.refreshRunning = false;
        }
      }
    }.bind(this), 1000);

    this.refreshDataInterval = setInterval(function() {
      this.refreshRequired = true;
    }.bind(this), 5000);

  }

  buildAccessoriesForDevices(callback) {
    var accessories = [];
    this.refreshDeviceData(function(err, data, oldData) {
      if (!err) {
        this.buildAccessories(callback);
      } else {
        callback(err, accessories);
      }
    }.bind(this));
  }

  refreshDeviceData(callback) {
    this.cache.get(this.deviceType, function (err, data) {
      if (!err) {
        if (data == undefined) {
          this.log.debug("Loading new data from netatmo " + this.AccessoryType);
          this.loadDeviceData(callback);
        } else {
          this.deviceData = data;
          callback(null, data);
        }
      } else {
        callback(err, this.deviceData);
      }
    }.bind(this));
  }

  loadDeviceData(callback) {
    this.deviceData = null;
    callback("abstract method loadDeviceData should be overridden", null)
  }

  buildAccessories(callback) {
    this.accessories = null;
    callback("abstract method buildAccessories should be overridden", null)
  }

}

module.exports = NetatmoDevice;