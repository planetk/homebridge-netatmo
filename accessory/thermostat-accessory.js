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

/*
var task_is_running = false;
setInterval(function(){
    if(!task_is_running){
        task_is_running = true;
        do_something(42, function(result){
            task_is_running = false;
        });
    }
}, time_interval_in_miliseconds);

*/

    }

    refreshData(callback) {
      this.log("refresh");
      this.device.refreshDeviceData(function (err, allDevicesData, oldDeviceData) {
        if (!err) {
          var accessoryData = allDevicesData[this.id];
          var oldAccessoryData;
          if (oldDeviceData) {
            oldAccessoryData = oldDeviceData[this.id];
          }
          this.mapAccessoryDataToThermostatData(accessoryData, oldAccessoryData);
        }
        callback(err, this.deviceData);
      }.bind(this));
    }

    mapAccessoryDataToThermostatData(accessoryData, oldAccessoryData) {
      this.log(JSON.stringify(accessoryData));
      var module = accessoryData.modules[0];

      if (module) {
        this.currentTemperature = module.measured.temperature;

        var targetTemperature = 0;
        if (module.measured.setpoint_temp) {
          targetTemperature = module.measured.setpoint_temp;
        }

        var setpoint = module.setpoint;

        if (setpoint) {
          if (setpoint.setpoint_temp != undefined) {
            targetTemperature = setpoint.setpoint_temp;

            var mode = setpoint.setpoint_mode;
            if (mode == 'program') {
              this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.AUTO;
            } else if (mode == 'manual' || mode == 'max') {
              this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.HEAT;
            } else {
              this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.OFF;        
            }  
          }
        }

        if (targetTemperature < 10) targetTemperature = 10;
        this.targetTemperature = targetTemperature;

        var heating = module.therm_relay_cmd;
        if (heating != 0) {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.HEAT;
        } else {
          this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
        }

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