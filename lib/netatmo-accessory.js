'use strict';

var inherits = require('util').inherits;
var Accessory, Service, Characteristic, uuid;

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
  this.device = netAtmoDevice;
  this.deviceId = stationData._id;

  this.name = stationData.module_name || "Netatmo weatherstation " + this.deviceId; 
  
  var uid = uuid.generate('netatmo.' + stationData.type + '.' + this.deviceId);
  this.uuid_base = uid;

  this.Accessory.call(this, this.name, uid);

  var accessoryInformationService = this.getService(Service.AccessoryInformation);

  accessoryInformationService.getCharacteristic(Characteristic.FirmwareRevision)
    || accessoryInformationService.addCharacteristic(Characteristic.FirmwareRevision);

  accessoryInformationService
    .setCharacteristic(Characteristic.Model, "Netatmo weatherstation (" + stationData.type + ")")
    .setCharacteristic(Characteristic.SerialNumber, this.deviceId)
    .setCharacteristic(Characteristic.Manufacturer, "Netatmo")
    .setCharacteristic(Characteristic.FirmwareRevision, stationData.firmware);
}

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
