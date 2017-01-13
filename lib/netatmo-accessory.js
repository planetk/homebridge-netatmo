'use strict';

var inherits = require('util').inherits;
var Accessory, Service, Characteristic, uuid;
var homebridge;

var glob = require( 'glob' )
  , path = require( 'path' );

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;

    class NetatmoAccessory extends Accessory {
      constructor(homebridge, accessoryConfig, netatmoDevice, defaultServices) {

        var name = accessoryConfig.name || "Netatmo " + netatmoDevice.deviceType + " " + accessoryConfig.id; 
        var uid = homebridge.hap.uuid.generate('netatmo.' + accessoryConfig.netatmoType + '.' + accessoryConfig.id);
        super(name, uid);

        this.log = netatmoDevice.log;
        this.config = netatmoDevice.config;
        this.device = netatmoDevice;
        this.id = accessoryConfig.id;
        this.name = name;
        this.deviceType = netatmoDevice.deviceType;
        this.netatmoType = accessoryConfig.netatmoType;
        this.firmware = accessoryConfig.firmware;
        // this.deviceData = stationData;

        this._configureAccessoryInformationService();
        this._buildServices(defaultServices);


        /*
    this.runCheckInterval = setInterval(function(str1, str2) {
  console.log(str1 + " " + str2);
}, 1000, "Hello.", "How are you?");
*/
/*
    this.runCheckInterval = setInterval(function() {
      console.log("Checking..." + this.name);
      if(this.refreshRequired) {
        this.refreshRequired=false;
        console.log(".. Refresh" + this.name);
      }
    }.bind(this), 1000);

    this.refreshDataInterval = setInterval(function() {
      this.refreshRequired = true;
    }.bind(this), 5000);
*/

      }

      getServices() {
        return this.services;
      }

      isConfiguredService(serviceType) {
        return ( this.configuredServices.indexOf(serviceType) > -1 );
      }

      _configureAccessoryInformationService() {

        var accessoryInformationService = this.getService(Service.AccessoryInformation);

        accessoryInformationService.getCharacteristic(Characteristic.FirmwareRevision)
          || accessoryInformationService.addCharacteristic(Characteristic.FirmwareRevision);

        accessoryInformationService
          .setCharacteristic(Characteristic.Model, "Netatmo " + this.deviceType + " (" + this.netatmoType + ")")
          .setCharacteristic(Characteristic.SerialNumber, this.id)
          .setCharacteristic(Characteristic.Manufacturer, "Netatmo")
          .setCharacteristic(Characteristic.FirmwareRevision, this.firmware);
      }

      loadConfiguredServices(defaultServices) {
        if (this.config[this.netatmoType]) {
          this.configuredServices = this.config[this.netatmoType].services || this.config.services || defaultServices;
        } else {
          this.configuredServices = this.config.services || defaultServices;
        }
      }

      notifyUpdate(deviceData,oldDeviceData) {
        console.log("Method notifyUpdate should have been overriden " + this.name);
      }

      _buildServices(defaultServices) {
        this.loadConfiguredServices(defaultServices)
        var serviceDir = path.dirname(__dirname) + '/service';
        var globprefix = this.deviceType;

        glob.sync( globprefix + '-*.js', { 'cwd': serviceDir } ).forEach(
          function( file ) {
            try {
              var NetatmoService = require( serviceDir + '/' + file )(homebridge);
              if(this.isConfiguredService(file.slice(globprefix.length + 1, -3))) {

                var service = new NetatmoService(this);
                this.addService(service);

              }
            } catch (err) {
              this.log("Could not process file " + file);
              this.log(err);
              this.log(err.stack); 
            }
          }.bind(this)
        );
      }

    }

    return NetatmoAccessory;

  }

  

  /*
  var serviceDir = path.dirname(__dirname) + '/services';
  var globprefix = netAtmoDevice.deviceType;
  glob.sync( globprefix + '-*.js', { 'cwd': serviceDir } ).forEach( function( file ) {
    try {
      var service = require( serviceDir + '/' + file )(this, stationData);
      if(this.isConfiguredService(file.slice(globprefix.length + 1, -3))) {
        var serviceProvider = new service.ServiceProvider();
        var services = serviceProvider.buildServices(this, stationData);
        if (services) {
          services.forEach(function(svc) {
            this.addService(svc);
          }.bind(this));
        }
      }
    } catch (err) {
      this.log("Could not process file " + file);
      this.log(err);
      this.log(err.stack); 
    }
  }.bind(this));
  */

}

/*
NetatmoAccessory.prototype.configuredServices = [];
NetatmoAccessory.prototype.defaultServices    = [];

NetatmoAccessory.prototype.isConfiguredService = function (serviceType) {
  return ( this.configuredServices.indexOf(serviceType) > -1 );
};

NetatmoAccessory.prototype.getDashboardValue = function (name, callback) {
  return this.device.getDashboardValue(this.deviceId, name, callback);
}

NetatmoAccessory.prototype.getData = function (callback) {
  return this.device.getData(this.deviceId, callback);
}

NetatmoAccessory.prototype.getServices = function () {
  return this.services;
};

NetatmoAccessory.prototype.supportsService = function (serviceType) {
  return false;
};
*/
