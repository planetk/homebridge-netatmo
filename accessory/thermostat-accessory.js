'use strict';

const DEFAULT_SERVICES = [
        "thermostat-homekit",
        "battery-homekit"
      ];

const MIN_BATTERY_LEVEL = 2800;
const LOW_BATTERY_LEVEL = 3000;
const FULL_BATTERY_LEVEL = 4100;

var homebridge;
var Characteristic;
var NetatmoAccessory;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    NetatmoAccessory = require("../lib/netatmo-accessory")(homebridge);
    Characteristic = homebridge.hap.Characteristic;
  }

  class ThermostatAccessory extends NetatmoAccessory {
    constructor(deviceData, netatmoDevice) {

      var accessoryConfig = {
        "id": deviceData._id,
        "netatmoType": deviceData.type,
        "firmware": deviceData.firmware,
        "name": deviceData.station_name || "Netatmo " + netatmoDevice.deviceType + " " + deviceData._id,
        "defaultServices": DEFAULT_SERVICES
//        "dataTypes"
      }

      super(homebridge, accessoryConfig, netatmoDevice);

      this.module_id = deviceData.modules[0]._id;
      this.currentTemperature = 11.1;
      this.targetTemperature = 20.0;
      this.batteryPercent = 100;
      this.lowBattery = false;

      this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
      this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.OFF;

      this.refreshData(function(err, data) {});

    }

    refreshData(callback) {
      this.device.refreshDeviceData(function (err, deviceData) {
        if (!err) {
          this.notifyUpdate(deviceData);
        }
        callback(err, deviceData);
      }.bind(this));
    }

    notifyUpdate(deviceData) {
      var accessoryData = this.extractAccessoryData(deviceData);
      var thermostatData = this.mapAccessoryDataToThermostatData(accessoryData);
      this.applyThermostatData(thermostatData);
    }

    extractAccessoryData(deviceData) {
      return deviceData[this.id];
    }

    mapAccessoryDataToThermostatData(accessoryData) {
      // this.log(JSON.stringify(accessoryData));
      var result = {};
      var module = accessoryData.modules[0];

      if (module) {
        result.currentTemperature = module.measured.temperature;

        result.targetTemperature = 0;
        if (module.measured.setpoint_temp) {
          result.targetTemperature = module.measured.setpoint_temp;
        }

        var setpoint = module.setpoint;
        if (setpoint) {
          if (setpoint.setpoint_temp != undefined) {
            result.targetTemperature = setpoint.setpoint_temp;
            result.mode = setpoint.setpoint_mode;
          }
        }

        if (result.targetTemperature < 10) result.targetTemperature = 10;

        result.heating = (module.therm_relay_cmd != 0);
        result.batteryPercent = module.battery_percent;

        result.lowBattery = false;
        if (module.battery_vp) {
          if (!result.batteryPercent) {
            result.batteryPercent = Math.min(Math.round(Math.max(module.battery_vp - MIN_BATTERY_LEVEL, 0) / (FULL_BATTERY_LEVEL - MIN_BATTERY_LEVEL) * 100), 100);
          }
          if (module.battery_vp < LOW_BATTERY_LEVEL) {
            result.lowBattery = true;
          }
        }
        if (!result.batteryPercent) {
          result.batteryPercent = 100;
        }
      } else {
        this.device.forceRefresh();
      }
      return result;
    }

    applyThermostatData(thermostatData) {
      var dataChanged = false

      if(thermostatData.currentTemperature && this.currentTemperature != thermostatData.currentTemperature) {
        this.currentTemperature = thermostatData.currentTemperature;
        dataChanged = true;
      }

      if(thermostatData.targetTemperature && this.targetTemperature != thermostatData.targetTemperature) {
        this.targetTemperature = thermostatData.targetTemperature;
        dataChanged = true;
      }

      if(thermostatData.mode && this.mode != thermostatData.mode) {
        this.mode = thermostatData.mode;
        switch(this.mode) {
          case 'hg':
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.COOL;
            break;
          case 'max':
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.HEAT;
            break;
          case 'off':
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.OFF;          
            break;
          default: // manual, program
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.AUTO;        
        }
        dataChanged = true;
      }

      if(thermostatData.heating && this.heating != thermostatData.heating) {
        this.heating = thermostatData.heating;
        if (this.heating) {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.HEAT;
        } else {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
        }
        dataChanged = true;
      }

      if(thermostatData.batteryPercent && this.batteryPercent != thermostatData.batteryPercent) {
        this.batteryPercent = thermostatData.batteryPercent;
        dataChanged = true;
      }

      if(thermostatData.lowBattery && this.lowBattery != thermostatData.lowBattery) {
        this.lowBattery = thermostatData.lowBattery;
        dataChanged = true;
      }

      if (dataChanged) {
        this.getServices().forEach(
          function( svc ) {
            svc.updateCharacteristics && svc.updateCharacteristics();
          }
        );
      }
    }

    setThermpoint(mode, temperature, callback) {
      this.device.api.setThermpoint({
        device_id: this.id,
        module_id: this.module_id,
        setpoint_mode: mode,
        setpoint_temp: temperature
      }, function(err, value) { 
        this.device.forceRefresh();
        callback(err, value);
      }.bind(this));
    }

  }

  return ThermostatAccessory;
}