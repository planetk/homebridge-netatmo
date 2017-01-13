'use strict';

const DEFAULT_SERVICES = [
        "thermostat-homekit",
        "battery-homekit"
      ];

var AccessoryConfig = require("../lib/accessory-config");

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

      var accessoryConfig = new AccessoryConfig (
          deviceData._id
        , deviceData.type
        , deviceData.firmware
        , deviceData.station_name || "Netatmo " + netatmoDevice.deviceType + " " + deviceData._id
      );
      
      super(homebridge, accessoryConfig, netatmoDevice, DEFAULT_SERVICES);

      this.module_id = deviceData.modules[0]._id;
      this.currentTemperature = 11.1;
      this.targetTemperature = 20.0;
      this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
      this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.OFF;

      this.refreshData(function(err, data) {});

    }

    refreshData(callback) {
      this.log("refresh");
      this.device.refreshDeviceData(function (err, deviceData, oldDeviceData) {
        if (!err) {
          
          var accessoryData = this.extractAccessoryData(deviceData);
          var thermostatData = this.mapAccessoryDataToThermostatData(accessoryData);
          this.applyThermostatData(thermostatData);
        }
        callback(err, deviceData);
      }.bind(this));
    }

    notifyUpdate(deviceData,oldDeviceData) {
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
      }
      return result;
    }

    applyThermostatData(thermostatData) {
      this.log(">>>THERM: " + JSON.stringify(thermostatData));

      if(thermostatData.currentTemperature && this.currentTemperature != thermostatData.currentTemperature) {
        this.currentTemperature = thermostatData.currentTemperature;
        this.log(">>> Notify Services!! current")
      }

      if(thermostatData.targetTemperature && this.targetTemperature != thermostatData.targetTemperature) {
        this.targetTemperature = thermostatData.targetTemperature;
        this.log(">>> Notify Services!! target")
      }

      if(thermostatData.mode && this.mode != thermostatData.mode) {
        this.mode = thermostatData.mode;
        switch(this.mode) {
          case 'program':
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.AUTO;
            break;
          case 'manual':
          case 'max':
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.HEAT;
          default:
            this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.OFF;        
        }
        this.log(">>> Notify Services!! mode")
      }

      if(thermostatData.heating && this.heating != thermostatData.heating) {
        this.heating = thermostatData.heating;
        if (this.heating) {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.HEAT;
        } else {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
        }
        this.log(">>> Notify Services!! heating")
      }
    }

    setThermpoint(mode, temperature, callback) {
      this.device.api.setThermpoint({
        device_id: this.id,
        module_id: this.module_id,
        setpoint_mode: mode,
        setpoint_temp: temperature
      }, function(err, value) { 
        this.refreshData(callback)
      }.bind(this));
    }

  }

  return ThermostatAccessory;
}