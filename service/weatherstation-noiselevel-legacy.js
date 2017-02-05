'use strict';

var homebridge;
var Characteristic;

const NOISE_LEVEL_STYPE_ID = "8C85FD40-EB20-45EE-86C5-BCADC773E580";
const NOISE_LEVEL_CTYPE_ID = "2CD7B6FD-419A-4740-8995-E3BFE43735AB";

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class NoiseLevelCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Noise Level', NOISE_LEVEL_CTYPE_ID);
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
    }
  }

  class NoiseLevelService extends homebridge.hap.Service {
    constructor(accessory) {
      super(accessory.name + " Noise Level", NOISE_LEVEL_STYPE_ID);
      this.accessory = accessory;

      this.addCharacteristic(NoiseLevelCharacteristic)
        .on('get', this.getNoiseLevel.bind(this))
        .eventEnabled = true;

      // this.addOptionalCharacteristic(Characteristic.StatusActive);
      // this.addOptionalCharacteristic(Characteristic.StatusFault);
      // this.addOptionalCharacteristic(Characteristic.StatusTampered);
      this.addOptionalCharacteristic(Characteristic.Name);
    }

    updateCharacteristics() {
      this.getCharacteristic(NoiseLevelCharacteristic)
            .updateValue(this.accessory.noiseLevel);
    }

    getNoiseLevel(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.noiseLevel);
      }.bind(this));
    }

  }

  return NoiseLevelService;
};    
