'use strict';
var Service, Characteristic;

// CUSTOM SERVICE AND CHARACTERISTIC IDS
var ATMOSPHERIC_PRESSURE_STYPE_ID = "B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE";
var ATMOSPHERIC_PRESSURE_CTYPE_ID = "28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB";

var NOISE_LEVEL_STYPE_ID = "8C85FD40-EB20-45EE-86C5-BCADC773E580";
var NOISE_LEVEL_CTYPE_ID = "2CD7B6FD-419A-4740-8995-E3BFE43735AB";

var RAIN_LEVEL_STYPE_ID = "D92D5391-92AF-4824-AF4A-356F25F25EA1";
var RAIN_LEVEL_CTYPE_ID = "C53F35CE-C615-4AA4-9112-EBF679C5EB14";
var RAIN_LEVEL_SUM_1H_CTYPE_ID = "11646117-878C-456B-A770-3924151F773D";
var RAIN_LEVEL_SUM_24H_CTYPE_ID = "E67DDC66-BEB7-4D0C-BD0C-022DB570DABC";

var WIND_MEASURE_STYPE_ID = "2AFB775E-79E5-4399-B3CD-398474CAE86C";
var WIND_STRENGTH_CTYPE_ID = "9331096F-E49E-4D98-B57B-57803498FA36";
var WIND_ANGLE_CTYPE_ID = "6C3F6DFA-7340-4ED4-AFFD-0E0310ECCD9E";
var GUST_STRENGTH_CTYPE_ID = "1B7F2F7B-EABF-4A54-8F9D-ABBEE08E8A64";
var GUST_ANGLE_CTYPE_ID = "928BD7DE-1CAA-4472-BBEF-0A9166B7949F";

var THERM_MODE_CTYPE_ID = "9A4CED8B-175E-478D-9737-5F399876EDC6";
var THERM_HG_CTYPE_ID = "3674CD3A-16AF-4C9D-8492-E466B753A697";
var THERM_AWAY_CTYPE_ID = "D5806A47-948D-4707-B350-EF4637B93539";
var THERMOSTAT_STYPE_ID = "43EB2466-3B98-457E-9EE9-BD6E735E6CBF";

module.exports = function (homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  Characteristic.ThermostatAwayMode = function () {
    Characteristic.call(this, 'Mode Absent', THERM_AWAY_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.BOOL,
      unit: null,
      minValue: null,
      maxValue: null,
      minStep: null,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.WRITE,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.ThermostatAwayMode, Characteristic);

  Characteristic.ThermostatMode = function () {
    Characteristic.call(this, 'Affichage mode', THERM_MODE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.STRING,
      unit: null,
      minValue: null,
      maxValue: null,
      minStep: null,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.ThermostatMode, Characteristic);

  Characteristic.ThermostatHgMode = function () {
    Characteristic.call(this, 'Mode Hors Gel', THERM_HG_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.BOOL,
      unit: null,
      minValue: null,
      maxValue: null,
      minStep: null,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.WRITE,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.ThermostatHgMode, Characteristic);

  Characteristic.AtmosphericPressureLevel = function () {
    Characteristic.call(this, 'Pression Atmospherique', ATMOSPHERIC_PRESSURE_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "mbar",
      minValue: 800,
      maxValue: 1200,
      minStep: 1,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.AtmosphericPressureLevel, Characteristic);

  Characteristic.NoiseLevel = function () {
    Characteristic.call(this, 'Niveau de bruit', NOISE_LEVEL_CTYPE_ID);
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
  inherits(Characteristic.NoiseLevel, Characteristic);

  Characteristic.RainLevel = function () {
    Characteristic.call(this, 'Rain Level', RAIN_LEVEL_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.RainLevel, Characteristic);

  Characteristic.RainLevelSum1 = function () {
    Characteristic.call(this, 'Rain Level (1 hour)', RAIN_LEVEL_SUM_1H_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.RainLevelSum1, Characteristic);

  Characteristic.RainLevelSum24 = function () {
    Characteristic.call(this, 'Rain Level (24 hours)', RAIN_LEVEL_SUM_24H_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "mm",
      minValue: 0,
      maxValue: 1000,
      minStep: 0.001,
      perms: [
        Characteristic.Perms.READ,
        Characteristic.Perms.NOTIFY
      ]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.RainLevelSum24, Characteristic);

  Characteristic.WindStrength = function () {
    Characteristic.call(this, 'Wind Strength', WIND_STRENGTH_CTYPE_ID);
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
  };
  inherits(Characteristic.WindStrength, Characteristic);

  Characteristic.WindAngle = function () {
    Characteristic.call(this, 'Wind Angle', WIND_ANGLE_CTYPE_ID);
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
  };
  inherits(Characteristic.WindAngle, Characteristic);

  Characteristic.GustStrength = function () {
    Characteristic.call(this, 'Gust Strength', GUST_STRENGTH_CTYPE_ID);
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
  };
  inherits(Characteristic.GustStrength, Characteristic);

  Characteristic.GustAngle = function () {
    Characteristic.call(this, 'Gust Angle', GUST_ANGLE_CTYPE_ID);
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
  };
  inherits(Characteristic.GustAngle, Characteristic);

  Service.AtmosphericPressureSensor = function (displayName, subtype) {
    Service.call(this, displayName, ATMOSPHERIC_PRESSURE_STYPE_ID, subtype);

    // Required Characteristics
    this.addCharacteristic(Characteristic.AtmosphericPressureLevel);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(Service.AtmosphericPressureSensor, Service);

  Service.NoiseLevelSensor = function (displayName, subtype) {
    Service.call(this, displayName, NOISE_LEVEL_STYPE_ID, subtype);

    // Required Characteristics
    this.addCharacteristic(Characteristic.NoiseLevel);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  inherits(Service.NoiseLevelSensor, Service);

  Service.RainLevelSensor = function (displayName, subtype) {
    Service.call(this, displayName, RAIN_LEVEL_STYPE_ID, subtype);

    // Required Characteristics
    this.addCharacteristic(Characteristic.RainLevel);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.Name);
    this.addOptionalCharacteristic(Characteristic.RainLevelSum1);
    this.addOptionalCharacteristic(Characteristic.RainLevelSum24);
  };
  inherits(Service.RainLevelSensor, Service);

  Service.WindSensor = function (displayName, subtype) {
    Service.call(this, displayName, WIND_MEASURE_STYPE_ID, subtype);

    // Required Characteristics
    this.addCharacteristic(Characteristic.WindAngle);
    this.addCharacteristic(Characteristic.WindStrength);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.GustAngle);
    this.addOptionalCharacteristic(Characteristic.GustStrength);
  };
  inherits(Service.WindSensor, Service);

  homebridge.registerPlatform("homebridge-netatmo", "netatmo", NetatmoPlatform);
}

var DEFAULT_CACHE_TTL = 10; // 10 seconds caching - use config["ttl"] to override

var netatmo = require("netatmo");
var NodeCache = require("node-cache");
var inherits = require('util').inherits;

function NetAtmoRepository(log, api, ttl) {
  this.api = api;
  this.log = log;
  this.cache = new NodeCache({stdTTL: ttl});
}

NetAtmoRepository.prototype = {
  refresh: function (callback) {
    var datasource = {
      modules: {}
    };
    var that = this;
    that.api.getStationsData(function (err, devices) {

      // querying for the device infos and the main module
      for (var device of devices) {
        device.module_name = device.station_name + " " + device.module_name

        that.log("refreshing device " + device._id + " (" + device.module_name + ")");
        datasource.modules[device._id] = device;

        // querying for the extra modules
        for (var module of device.modules) {
          module.module_name = device.station_name + " " + module.module_name

          that.log("refreshing module " + module._id + " (" + module.module_name + ")");
          datasource.modules[module._id] = module;
        }
      }

      that.cache.set("datasource", datasource);
      that.api.getThermostatsData(function (err, devices) {

        // querying for the device infos and the main module
        for (var device of devices) {
          device.module_name = device.station_name;

          that.log("refreshing device " + device._id + " (" + device.module_name + ")");
          datasource.modules[device._id] = device;
        }

        that.cache.set("datasource", datasource);
        callback(datasource);
      });
    });
  },
  load: function (callback) {
    var that = this;
    this.cache.get("datasource", function (err, datasource) {
      if (!err) {
        if (datasource == undefined) {
          that.refresh(callback);
        } else {
          callback(datasource)
        }
      }
    });
  }
}

function NetatmoPlatform(log, config) {
  var that = this;
  this.log = log;
  this.log(config['name']);
  var api = new netatmo(config["auth"]);
  var ttl = typeof config["ttl"] !== 'undefined' ? config["ttl"] : DEFAULT_CACHE_TTL;
  this.repository = new NetAtmoRepository(this.log, api, ttl);
  api.on("error", function (error) {
    that.log('ERROR - Netatmo: ' + error);
  });
  api.on("warning", function (error) {
    that.log('WARN - Netatmo: ' + error);
  });
}

NetatmoPlatform.prototype = {
  accessories: function (callback) {

    var that = this;
    var foundAccessories = [];

    this.repository.load(function (datasource) {
      for (var id in datasource.modules) {
        var device = datasource.modules[id];
        if (device.station_name === 'Thermostat') {
          var accessory = new NetatmoThermostat(that.log, that.repository, device);
        } else {
          var accessory = new NetatmoAccessory(that.log, that.repository, device);
        }
        foundAccessories.push(accessory);
      }
      callback(foundAccessories);
    });
  }
}

function NetatmoAccessory(log, repository, device) {
  this.log = log;
  this.repository = repository;
  this.deviceId = device._id;
  this.name = device.module_name
  this.serial = device._id;
  this.firmware = device.firmware;
  this.model = device.type;
  this.serviceTypes = device.data_type;
  if (device.battery_vp) {
    this.serviceTypes.push("Battery");
  }
}
NetatmoAccessory.prototype = {

  getData: function (callback) {
    var that = this;
    this.repository.load(function (datasource) {
      callback(datasource.modules[that.deviceId]);
    });
  },

  identify: function (callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  currentTemperature: function (callback) {
    this.getData(function (deviceData) {
      if (deviceData.dashboard_data != undefined) {
        if (deviceData.dashboard_data.Temperature != undefined) {
          callback(null, deviceData.dashboard_data.Temperature);
        } else {
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
    }.bind(this));
  },

  currentRelativeHumidity: function (callback) {
    this.getData(function (deviceData) {
      if (deviceData.dashboard_data != undefined) {
        if (deviceData.dashboard_data.Humidity != undefined) {
          callback(null, deviceData.dashboard_data.Humidity);
        } else {
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
    }.bind(this));
  },

  carbonDioxideDetected: function (callback) {
    this.getData(function (deviceData) {
      var result = (deviceData.dashboard_data.CO2 > 1000 ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL);
      callback(null, result);
    }.bind(this));
  },

  carbonDioxideLevel: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.CO2);
    }.bind(this));
  },

  airQuality: function (callback) {
    this.getData(function (deviceData) {
      var level = deviceData.dashboard_data.CO2;
      var quality = Characteristic.AirQuality.UNKNOWN;
      if (level > 2000) quality = Characteristic.AirQuality.POOR;
      else if (level > 1500) quality = Characteristic.AirQuality.INFERIOR;
      else if (level > 1000) quality = Characteristic.AirQuality.FAIR;
      else if (level > 500) quality = Characteristic.AirQuality.GOOD;
      else if (level > 250) quality = Characteristic.AirQuality.EXCELLENT;
      callback(null, quality);
    }.bind(this));
  },

  batteryLevel: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.battery_percent);
    }.bind(this));
  },

  statusLowBattery: function (callback) {
    this.getData(function (deviceData) {
      var charge = deviceData.battery_vp;
      var level = charge < 4600 ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
      callback(null, level);
    }.bind(this));
  },

  atmosphericPressure: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.Pressure);
    }.bind(this));
  },

  noiseLevel: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.Noise);
    }.bind(this));
  },

  rainLevel: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.Rain);
    }.bind(this));
  },

  rainLevelSum1: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.sum_rain_1);
    }.bind(this));
  },

  rainLevelSum24: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.sum_rain_24);
    }.bind(this));
  },

  windStrength: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.WindStrength);
    }.bind(this));
  },

  windAngle: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.WindAngle);
    }.bind(this));
  },

  gustStrength: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.GustStrength);
    }.bind(this));
  },

  gustAngle: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.dashboard_data.GustAngle);
    }.bind(this));
  },

  getServices: function () {
    var that = this;
    var services = [];

    this.log("creating services for " + this.name)

    // INFORMATION ///////////////////////////////////////////////////
    var informationService = new Service.AccessoryInformation();
    var firmwareCharacteristic = informationService.getCharacteristic(Characteristic.FirmwareRevision)
      || informationService.addCharacteristic(Characteristic.FirmwareRevision);
    services.push(informationService);

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Netatmo")
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)
      .setCharacteristic(Characteristic.FirmwareRevision, this.firmware);

    // TEMPERATURE //////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Temperature") > -1) {
      var temperatureSensor = new Service.TemperatureSensor(this.name + " Temperature");
      services.push(temperatureSensor);

      var tmpChar = temperatureSensor.getCharacteristic(Characteristic.CurrentTemperature)
      tmpChar.setProps({minValue: -100});
      tmpChar.on('get', this.currentTemperature.bind(this));
    }

    // HUMIDITY ////////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Humidity") > -1) {
      var humiditySensor = new Service.HumiditySensor(this.name + " Humidity");
      services.push(humiditySensor);
      humiditySensor.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', this.currentRelativeHumidity.bind(this));
    }

    // CO2 SENSOR /////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("CO2") > -1) {
      var carbonDioxideSensor = new Service.CarbonDioxideSensor(this.name + " Carbon Dioxide");
      var carbonDioxideLevelCharacteristic = carbonDioxideSensor.getCharacteristic(Characteristic.CarbonDioxideLevel)
        || carbonDioxideSensor.addCharacteristic(Characteristic.CarbonDioxideLevel);

      services.push(carbonDioxideSensor);
      carbonDioxideSensor.getCharacteristic(Characteristic.CarbonDioxideDetected)
        .on('get', this.carbonDioxideDetected.bind(this));
      carbonDioxideLevelCharacteristic
        .on('get', this.carbonDioxideLevel.bind(this));

      var airQualitySensor = new Service.AirQualitySensor(this.name + " Air Quality");
      services.push(airQualitySensor);
      airQualitySensor.getCharacteristic(Characteristic.AirQuality)
        .on('get', this.airQuality.bind(this));
    }

    // BATTERY SERVICE ////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Battery") > -1) {
      var batteryService = new Service.BatteryService(this.name + " Battery Level");
      services.push(batteryService);
      batteryService.getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.batteryLevel.bind(this));
      batteryService.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.statusLowBattery.bind(this));
    }

    // ATMOSPHERIC PRESSURE /////////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Pressure") > -1) {
      var atmosphericPressureSensor = new Service.AtmosphericPressureSensor(this.name + " Atmospheric Pressure");
      services.push(atmosphericPressureSensor);
      atmosphericPressureSensor.getCharacteristic(Characteristic.AtmosphericPressureLevel)
        .on('get', this.atmosphericPressure.bind(this));
    }

    // NOISE LEVEL //////////////////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Noise") > -1) {
      var noiseLevelSensor = new Service.NoiseLevelSensor(this.name + " Noise Level");
      services.push(noiseLevelSensor);
      noiseLevelSensor.getCharacteristic(Characteristic.NoiseLevel)
        .on('get', this.noiseLevel.bind(this));
    }

    // RAIN LEVEL //////////////////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Rain") > -1) {
      var rainLevelSensor = new Service.RainLevelSensor(this.name + " Rain Level");
      services.push(rainLevelSensor);
      rainLevelSensor.getCharacteristic(Characteristic.RainLevel)
        .on('get', this.rainLevel.bind(this));

      rainLevelSensor.getCharacteristic(Characteristic.RainLevelSum1)
        .on('get', this.rainLevelSum1.bind(this));

      rainLevelSensor.getCharacteristic(Characteristic.RainLevelSum24)
        .on('get', this.rainLevelSum24.bind(this));

    }

    // WIND SENSOR //////////////////////////////////////////////////////////////
    if (this.serviceTypes.indexOf("Wind") > -1) {
      var windSensor = new Service.WindSensor(this.name + " Wind Sensor");
      services.push(windSensor);

      windSensor.getCharacteristic(Characteristic.WindStrength)
        .on('get', this.windStrength.bind(this));
      windSensor.getCharacteristic(Characteristic.WindAngle)
        .on('get', this.windAngle.bind(this));

      windSensor.getCharacteristic(Characteristic.GustStrength)
        .on('get', this.gustStrength.bind(this));
      windSensor.getCharacteristic(Characteristic.GustAngle)
        .on('get', this.gustAngle.bind(this));
    }

    // TODO: Check Elgato Eve Characteristics (map min, max, time series, etc.)!

    return services;
  }
};

function NetatmoThermostat(log, repository, device) {
  this.log = log;
  this.repository = repository;
  this.deviceId = device._id;
  this.name = device.module_name
  this.serial = device._id;
  this.firmware = device.firmware;
  this.model = device.type;

  this.mode = 'Programme';
  this.awayMode = false;
  this.hgMode = false;
  this.temperature = 21;
  this.targetTemperature = 21;
  this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;
}
NetatmoThermostat.prototype = {

  getData: function (callback) {
    this.log("getData!");
    var that = this;
    this.repository.load(function (datasource) {
      callback(datasource.modules[that.deviceId]);
    });
  },

  identify: function (callback) {
    this.log("Identify requested!");
    callback();
  },

  // Required
  getThermostatMode: function (callback) {
    this.log("getThermostatMode :", this.mode);
    this.getData(function (deviceData) {
      switch (deviceData.modules[0].setpoint.setpoint_mode) {
        case 'program':
          this.mode = 'Programme';
          break;
        case 'aways':
          this.mode = 'Absent';
          break;
        case 'hg':
          this.mode = 'Hors-Gel';
          break;
        case 'max':
          this.mode = 'Puissance Maximum';
          break;
        case 'off':
          this.mode = 'Eteint';
          break;
      }
      callback(null, this.mode);
    }.bind(this));
  },
  getThermostatAwayMode: function (callback) {
    this.log("getThermostatAwayMode :", this.awayMode);
    this.getData(function (deviceData) {
      this.awayMode = (deviceData.modules[0].setpoint.setpoint_mode === 'away');
      callback(null, this.awayMode);
    }.bind(this));
  },
  setThermostatAwayMode: function (value, callback) {
    this.log("setThermostatAwayMode :", value);
    this.getData(function (deviceData) {
      this.repository.api.setThermpoint({
        device_id: deviceData._id,
        module_id: deviceData.modules[0]._id,
        setpoint_mode: (value ? 'away' : 'program')
      }, callback);
    }.bind(this));
  },
  getThermostatHgMode: function (callback) {
    this.log("getThermostatHgMode :", this.hgMode);
    this.getData(function (deviceData) {
      this.awayMode = (deviceData.modules[0].setpoint.setpoint_mode === 'hg');
      callback(null, this.awayMode);
    }.bind(this));
  },
  setThermostatHgMode: function (value, callback) {
    this.log("setThermostatHgMode :", value)
    this.getData(function (deviceDate) {
      this.repository.api.setThermpoint({
        device_id: deviceData._id,
        module_id: deviceData.modules[0]._id,
        setpoint_mode: (value ? 'hg' : 'program')
      }, callback);
    }.bind(this));
  },
  getCurrentTemperature: function (callback) {
    this.log("getCurrentTemperature!");
    this.getData(function (deviceData) {
      if (deviceData.modules[0].measured.temperature != undefined) {
        this.temperature = deviceData.modules[0].measured.temperature;
      }
      callback(null, this.temperature);
    }.bind(this));
  },
  getTargetTemperature: function (callback) {
    this.log("getTargetTemperature!");
    this.getData(function (deviceData) {
      if (deviceData.modules[0].setpoint.setpoint_temp != undefined) {
        this.targetTemperature = deviceData.modules[0].setpoint.setpoint_temp;
      }
      callback(null, this.targetTemperature);
    }.bind(this));
  },
  setTargetTemperature: function (value, callback) {
    this.log("setTargetTemperature from/to", this.targetTemperature, value);
    this.targetTemperature = value;
    this.getData(function (deviceData) {
      this.repository.api.setThermpoint({
        device_id: deviceData._id,
        module_id: deviceData.modules[0]._id,
        setpoint_mode: 'manual',
        setpoint_temp: value,
        setpoint_endtime: deviceData.modules[0].measured.time + (60 * 60 * 3)
      }, callback);
    }.bind(this));
  },
  getTemperatureDisplayUnits: function (callback) {
    this.log("getTemperatureDisplayUnits :", this.temperatureDisplayUnits);
    callback(null, this.temperatureDisplayUnits);
  },
  batteryLevel: function (callback) {
    this.getData(function (deviceData) {
      callback(null, deviceData.modules[0].battery_percent);
    }.bind(this));
  },

  statusLowBattery: function (callback) {
    this.getData(function (deviceData) {
      var charge = deviceData.modules[0].battery_vp;
      var level = charge < 4600 ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
      callback(null, level);
    }.bind(this));
  },

  getServices: function () {
    var services = [];

    this.log("creating services for " + this.name)

    /**
     * Information Service
     * @type {Service.AccessoryInformation}
     */
    var informationService = new Service.AccessoryInformation();
    var firmwareCharacteristic = informationService.getCharacteristic(Characteristic.FirmwareRevision)
      || informationService.addCharacteristic(Characteristic.FirmwareRevision);
    services.push(informationService);

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Netatmo")
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)
      .setCharacteristic(Characteristic.FirmwareRevision, this.firmware);

    /**
     * Netatmo Thermostat Service
     * @param displayName
     * @param subType
     * @constructor
     */
    Service.NetatmoThermostatService = function (displayName, subtype) {
      Service.call(this, displayName, THERMOSTAT_STYPE_ID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.ThermostatMode);
      this.addCharacteristic(Characteristic.ThermostatAwayMode);
      this.addCharacteristic(Characteristic.ThermostatHgMode);
      this.addCharacteristic(Characteristic.CurrentTemperature);
      this.addCharacteristic(Characteristic.TargetTemperature);
      this.addCharacteristic(Characteristic.TemperatureDisplayUnits);
      this.addCharacteristic(Characteristic.BatteryLevel);
      this.addCharacteristic(Characteristic.StatusLowBattery);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };
    inherits(Service.NetatmoThermostatService, Service);

    /**
     *
     * @type {Service.NetatmoThermostatService}
     */
    var thermostatService = new Service.NetatmoThermostatService(this.name);
    services.push(thermostatService);

    thermostatService
      .getCharacteristic(Characteristic.ThermostatMode)
      .on('get', this.getThermostatMode.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.ThermostatAwayMode)
      .on('get', this.getThermostatAwayMode.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.ThermostatAwayMode)
      .on('set', this.setThermostatAwayMode.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.ThermostatHgMode)
      .on('get', this.getThermostatHgMode.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.ThermostatHgMode)
      .on('set', this.setThermostatHgMode.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.TargetTemperature)
      .on('set', this.setTargetTemperature.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.TargetTemperature)
      .on('get', this.getTargetTemperature.bind(this));

    thermostatService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', this.getTemperatureDisplayUnits.bind(this));

    thermostatService.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', this.batteryLevel.bind(this));

    thermostatService.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', this.statusLowBattery.bind(this));


    return services;
  }
};
