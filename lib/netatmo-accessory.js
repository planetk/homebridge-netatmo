'use strict';

var inherits = require('util').inherits;
var Accessory, Service, Characteristic, uuid;

var glob = require( 'glob' )
  , path = require( 'path' );

module.exports = function(exportedTypes) {
  if (exportedTypes && !Accessory) {
      Accessory = exportedTypes.Accessory;
      Service = exportedTypes.Service;
      Characteristic = exportedTypes.Characteristic;
      uuid = exportedTypes.uuid;

      var acc = NetatmoAccessory.prototype;
      inherits(NetatmoAccessory, Accessory);
      NetatmoAccessory.prototype.parent = Accessory.prototype;
      for (var mn in acc) {
          NetatmoAccessory.prototype[mn] = acc[mn];
      }
      NetatmoAccessory.prototype.Service = Service;
      NetatmoAccessory.prototype.Characteristic = Characteristic;
      NetatmoAccessory.prototype.Accessory = Accessory;
  }
  return NetatmoAccessory;
};

var NetatmoAccessory = function(stationData, netAtmoDevice) {
  this.log = netAtmoDevice.log;
  this.device = netAtmoDevice;
  this.deviceId = stationData._id;
  if (netAtmoDevice.config[stationData.type]) {
    this.configuredServices = netAtmoDevice.config[stationData.type].services || netAtmoDevice.config.services || this.defaultServices;
  } else {
    this.configuredServices = netAtmoDevice.config.services || this.defaultServices;
  }

  this.name = stationData.module_name || "Netatmo weatherstation " + this.deviceId; 
  

  var uid = uuid.generate('netatmo.' + stationData.type + '.' + this.deviceId);
  this.uuid_base = uid;

  this.Accessory.call(this, this.name, uid);

  var globprefix = "services/" + netAtmoDevice.deviceType;
  glob.sync( globprefix + '-*.js' ).forEach( function( file ) {
    try {
      var service = require( path.resolve( file ) )(this, stationData);
      if(this.isConfiguredService(file.slice(globprefix.length + 1, -3))) {
        var serviceProvider = new service.ServiceProvider();
        var services = serviceProvider.buildServices(this, stationData);
        if (services) {
          services.forEach(function(svc) {
            this.log("Adding service " + svc.displayName + " to " + this.name);

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

  var accessoryInformationService = this.getService(Service.AccessoryInformation);

  accessoryInformationService.getCharacteristic(Characteristic.FirmwareRevision)
    || accessoryInformationService.addCharacteristic(Characteristic.FirmwareRevision);

  accessoryInformationService
    .setCharacteristic(Characteristic.Model, "Netatmo weatherstation (" + stationData.type + ")")
    .setCharacteristic(Characteristic.SerialNumber, this.deviceId)
    .setCharacteristic(Characteristic.Manufacturer, "Netatmo")
    .setCharacteristic(Characteristic.FirmwareRevision, stationData.firmware);
}

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
