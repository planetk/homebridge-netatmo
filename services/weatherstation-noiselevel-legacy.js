'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var NOISE_LEVEL_STYPE_ID = "8C85FD40-EB20-45EE-86C5-BCADC773E580";
var NOISE_LEVEL_CTYPE_ID = "2CD7B6FD-419A-4740-8995-E3BFE43735AB";

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }

  var NoiseLevelCharacteristic = function () {
    Characteristic.call(this, 'Noise Level', NOISE_LEVEL_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "dB",
      minValue: 0,
      maxValue: 200,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(NoiseLevelCharacteristic, Characteristic);

  var NoiseLevelSensor = function (displayName, subtype) {
    Service.call(this, displayName, NOISE_LEVEL_STYPE_ID, subtype);
    this.addCharacteristic(NoiseLevelCharacteristic);
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(NoiseLevelSensor, Service);

  var getNoiseLevel = function (callback) {
    accessory.getDashboardValue('Noise', callback);
  };

  var noiseLevelSensor = new NoiseLevelSensor(accessory.displayName + " Noise Level");
  noiseLevelSensor.getCharacteristic(NoiseLevelCharacteristic)
    .on('get', getNoiseLevel);

  return { Service: noiseLevelSensor} ; 
}
