var assert = require('assert');

var homebridgeMock = require('./homebridge-mock')();
require('./mock-types');
var Characteristic = require('./characteristic-mock').Characteristic;
var Service = require('./service-mock').Service;

var dummyAuth = {
        client_id: "1234567890",
        client_secret: "0987654321",
        username: "test@tester.com",
        password: "password"
};

require("../../index")(homebridgeMock);

describe("Services", function() {

  describe("Thermostat Battery Homekit", function() {

    describe("Homebridge Platform", function() {

      var config = {
        auth: dummyAuth,
        mockapi: "wind"
      };

      var platform = new homebridgeMock.PlatformType(console.log, config);

      platform.accessories(function(accs) {
        accs.forEach(function(acc) {
          it("Accessory " + acc.name + " has correct services", function (done) {

            assert(acc.getService(Service.AccessoryInformation), "Module " + acc.moduleType + " should have AccessoryInformationService");

            switch (acc.moduleType) {
              case "NAMain" : // Main module
                assert(acc.getService(Service.TemperatureSensor), "Module " + acc.moduleType + " should have TemperatureSensor");
                assert(acc.getService(Service.HumiditySensor), "Module " + acc.moduleType + " should have HumiditySensor");
                assert(acc.getService(Service.CarbonDioxideSensor), "Module " + acc.moduleType + " should have CarbonDioxideSensor");
                assert(acc.getService(Service.AirQualitySensor), "Module " + acc.moduleType + " should have CarbonDioxideSensor");
                assert(acc.getService(acc.name + " Atmospheric Pressure"), "Module " + acc.moduleType + " should have Atmospheric Pressure service");
                assert(acc.getService(acc.name + " Noise Level"), "Module " + acc.moduleType + " should have Noise Level service");

                assert(null == acc.getService(Service.BatteryService), "Module " + acc.moduleType + " should not have BatteryService");

                break;
              case "NAModule1" : // Outside module
                assert(acc.getService(Service.BatteryService), "Module " + acc.moduleType + " should have BatteryService");
                assert(acc.getService(Service.TemperatureSensor), "Module " + acc.moduleType + " should have TemperatureSensor");
                assert(acc.getService(Service.HumiditySensor), "Module " + acc.moduleType + " should have HumiditySensor");
                break;
              case "NAModule2" : // Wind gauge
                assert(acc.getService(acc.name + " Wind Sensor"), "Module " + acc.moduleType + " should have Wind Strength service");
                assert(acc.getService(Service.BatteryService), "Module " + acc.moduleType + " should have BatteryService");
                break;
              case "NAModule3" : // Rain gauge
                assert(acc.getService(acc.name + " Rain Level"), "Module " + acc.moduleType + " should have Rain Level service");
                assert(acc.getService(Service.BatteryService), "Module " + acc.moduleType + " should have BatteryService");
                break;
              case "NATherm1" : // Thermostat
                assert(acc.getService(acc.name + " Thermostat"), "Module " + acc.moduleType + " should have ThermostatService");
                assert(acc.getService(Service.BatteryService), "Module " + acc.moduleType + " should have BatteryService");
                break;
              default:
                assert.fail(acc.moduleType, 'Any of NAMain, NATherm1', 'Found unknown accsory');

            }

            done();

          })
        });

      });
    });
  });

});