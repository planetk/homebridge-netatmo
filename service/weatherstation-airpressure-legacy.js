'use strict';

var homebridge;
var Characteristic;

const ATMOSPHERIC_PRESSURE_STYPE_ID = "B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE";
//Elgato
const ATMOSPHERIC_PRESSURE_CTYPE_ID = "E863F10F-079E-48FF-8F27-9C2605A29F52";
//const ATMOSPHERIC_PRESSURE_CTYPE_ID = "28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB";

/*
const ATMOSPHERIC_PRESSURE_STYPE_ID = "B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE";
const ATMOSPHERIC_PRESSURE_CTYPE_ID = "28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB";
var EVE_WEATHER_SERVICE_STYPE_ID = 'E863F001-079E-48FF-8F27-9C2605A29F52';
var EVE_AIR_PRESSURE_CTYPE_ID = "E863F10F-079E-48FF-8F27-9C2605A29F52";
*/

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class AtmosphericPressureCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Atmospheric Pressure', ATMOSPHERIC_PRESSURE_CTYPE_ID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        unit: "hPA", 
        minValue: 500,
        maxValue: 2000,
        minStep: 0.1,
        perms: [
          Characteristic.Perms.READ,
          Characteristic.Perms.NOTIFY
        ]
      });
      this.value = this.getDefaultValue();
    }
  } 

  class AirPressureService extends homebridge.hap.Service {
    constructor(accessory) {
      super(accessory.name + " Air Pressure", ATMOSPHERIC_PRESSURE_STYPE_ID);
      this.accessory = accessory;

      this.addCharacteristic(AtmosphericPressureCharacteristic)
        .on('get', this.getAtmosphericPressure.bind(this))
        .eventEnabled = true;

      // this.addOptionalCharacteristic(Characteristic.StatusActive);
      // this.addOptionalCharacteristic(Characteristic.StatusFault);
      this.addOptionalCharacteristic(Characteristic.Name);
      
    }

    updateCharacteristics() {
      this.getCharacteristic(AtmosphericPressureCharacteristic)
            .updateValue(this.accessory.airPressure);
    }

    getAtmosphericPressure(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.airPressure);
      }.bind(this));
    }

  }

  return AirPressureService;
}
