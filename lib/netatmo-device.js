'use strict';

const DEFAULT_CACHE_TTL = 10; // 10 seconds caching - use config["ttl"] to override

const REFRESH_CHECK_RATE = 5 * 60 * 1000; // Alle 5 Minuten
const REFRESH_RUN_RATE = 2 * 1000; // Alle 2 Sekunden 

var NodeCache = require("node-cache");

class NetatmoDevice {
  constructor(log, api, config) {
    this.api = api;
    this.log = log;
    var ttl = typeof config["ttl"] !== 'undefined' ? config["ttl"] : DEFAULT_CACHE_TTL;
    this.cache = new NodeCache({stdTTL: ttl});
    this.config = config;

    this.deviceData = null;
    this.accessories = [];
    this.refreshRequired = false;
    this.refreshRunning = false;
    this.refreshCheckRunning = false;

    this.runCheckInterval = setInterval(function() {
      if(!this.refreshCheckRunning ) {
        this.refreshCheckRunning = true;
        if(this.refreshRequired) {
          this.log.debug("Executing Timed Refresh");

          this.refreshRequired=false;
          this.refreshDeviceData(function(err, data) {
            if (this.accessories) {
              this.accessories.forEach(function( accessory ) {
                accessory.notifyUpdate(data);
              }.bind(this));
            }
            this.refreshCheckRunning = false;
          }.bind(this));
        } else {
          this.refreshCheckRunning = false;
        }
      }
    }.bind(this), REFRESH_RUN_RATE);

    this.refreshDataInterval = setInterval(function() {
      this.refreshRequired = true;
    }.bind(this), REFRESH_CHECK_RATE);

  }

  buildAccessoriesForDevices(callback) {
    var accessories = [];
    this.refreshDeviceData(function(err, data) {
      if (!err) {
        this.buildAccessories(callback);
      } else {
        callback(err, accessories);
      }
    }.bind(this));
  }

  refreshDeviceData(callback) {
    this.log.debug("Refreshing data for netatmo " + this.deviceType);
    this.cache.get(this.deviceType, function (err, data) {
      if (!err) {
        if (data == undefined) {
          this.log.debug("Loading new data from netatmo for " + this.deviceType);
          this.loadDeviceData(function(err, data) {
            callback(err,data);
          }.bind(this));
        } else {
          this.deviceData = data;
          callback(null, data);
        }
      } else {
        callback(err, this.deviceData);
      }
    }.bind(this));
  }

  forceRefresh() {
    this.cache.del(this.deviceType, function(err,count) {
      this.refreshRequired = true;
    }.bind(this));
  }

  loadDeviceData(callback) {
    this.deviceData = null;
    callback("The abstract method loadDeviceData should be overridden", null)
  }

  buildAccessories(callback) {
    Object.keys(this.deviceData).forEach(function(key) {
      var accessory = this.buildAccessory(this.deviceData[key]);
      this.log.debug("Did build accessory " + accessory.name );
      this.accessories.push(accessory);
    }.bind(this));
    callback(null, this.accessories);
  }

}

module.exports = NetatmoDevice;