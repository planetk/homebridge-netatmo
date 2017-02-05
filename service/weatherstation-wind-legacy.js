'use strict';

var homebridge;
var Characteristic;

const WIND_MEASURE_STYPE_ID = "2AFB775E-79E5-4399-B3CD-398474CAE86C";
const WIND_STRENGTH_CTYPE_ID = "9331096F-E49E-4D98-B57B-57803498FA36";
const WIND_ANGLE_CTYPE_ID = "6C3F6DFA-7340-4ED4-AFFD-0E0310ECCD9E";
const GUST_STRENGTH_CTYPE_ID = "1B7F2F7B-EABF-4A54-8F9D-ABBEE08E8A64";
const GUST_ANGLE_CTYPE_ID = "928BD7DE-1CAA-4472-BBEF-0A9166B7949F";

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class WindStrengthCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Wind Strength', WIND_STRENGTH_CTYPE_ID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        unit: "km/h",
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

  class WindAngleCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Wind Angle', WIND_ANGLE_CTYPE_ID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        unit: "deg",
        minValue: 0,
        maxValue: 360,
        minStep: 1,
        perms: [
          Characteristic.Perms.READ,
          Characteristic.Perms.NOTIFY
        ]
      });
      this.value = this.getDefaultValue();
    }
  } 

  class GustStrengthCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Gust Strength', GUST_STRENGTH_CTYPE_ID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        unit: "km/h",
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

  class GustAngleCharacteristic extends Characteristic {
    constructor(accessory) {
      super('Gust Angle', GUST_ANGLE_CTYPE_ID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        unit: "deg",
        minValue: 0,
        maxValue: 360,
        minStep: 1,
        perms: [
          Characteristic.Perms.READ,
          Characteristic.Perms.NOTIFY
        ]
      });
      this.value = this.getDefaultValue();
    }
  }

  class WindService extends homebridge.hap.Service {
    constructor(accessory) {
      super(accessory.name + " Wind Sensor", WIND_MEASURE_STYPE_ID);
      this.accessory = accessory;

      this.addCharacteristic(WindStrengthCharacteristic)
        .on('get', this.getWindStrength.bind(this))
        .eventEnabled = true;
      this.addCharacteristic(WindAngleCharacteristic)
        .on('get', this.getWindAngle.bind(this))
        .eventEnabled = true;
      this.addCharacteristic(GustStrengthCharacteristic)
        .on('get', this.getGustStrength.bind(this))
        .eventEnabled = true;
      this.addCharacteristic(GustAngleCharacteristic)
        .on('get', this.getGustAngle.bind(this))
        .eventEnabled = true;

      this.addOptionalCharacteristic(Characteristic.Name);
    }

    updateCharacteristics() {
      this.getCharacteristic(WindStrengthCharacteristic)
            .updateValue(this.accessory.windStrength);
      this.getCharacteristic(WindAngleCharacteristic)
            .updateValue(this.accessory.windAngle);
      this.getCharacteristic(GustStrengthCharacteristic)
            .updateValue(this.accessory.gustStrength);
      this.getCharacteristic(GustAngleCharacteristic)
            .updateValue(this.accessory.gustAngle);
    }

    getWindStrength(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.windStrength);
      }.bind(this));
    }

    getWindAngle(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.windAngle);
      }.bind(this));
    }

    getGustStrength(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.gustStrength);
      }.bind(this));
    }

    getGustAngle(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.gustAngle);
      }.bind(this));
    }
  }

  return WindService;
};
