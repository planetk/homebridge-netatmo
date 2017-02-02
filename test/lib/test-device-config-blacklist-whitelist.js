var assert = require('assert');
var logx = require("./logger")._system;

var homebridgeMock = require('./homebridge-mock')();

var dummyAuth = {
        client_id: "1234567890",
        client_secret: "0987654321",
        username: "test@tester.com",
        password: "password"
};

var api = {
  getStationsData: function(callback) {
    var stationData = [
      {
        "_id": "d1:00:00:00:00:00",
        "modules": [
          { "_id": "d1:m1:11:11:11:11", "data_type": []  },
        ],
        "data_type": []
      }, {
        "_id": "d2:00:00:00:00:00",
        "modules": [
          { "_id": "d2:m1:11:11:11:11", "data_type": [] },
          { "_id": "d2:m2:11:11:11:11", "data_type": []  },
          { "_id": "d2:m3:11:11:11:11", "data_type": []  }
        ],
        "data_type": []
      }, {
        "_id": "d3:00:00:00:00:00",
        "modules": [
          { "_id": "d3:m1:11:11:11:11", "data_type": []  },
          { "_id": "d3:m2:11:11:11:11", "data_type": []  },
          { "_id": "d3:m3:11:11:11:11", "data_type": []  }
        ],
        "data_type": []
      }
    ];
    callback(null, stationData);
  },
  getHomeData: function(callback) {
    var homeData = { "homes" :
      [ 
        { "id" : "11:22:33:44:55:66" },
        { "id" : "22:22:22:22:22:22" },
        { "id" : "33:33:33:33:33:33" },
        { "id" : "44:22:44:44:22:44" },
        { "id" : "55:00:00:00:00:55" },
        { "id" : "66:66:66:66:66:66" }
      ]
    };
    callback(null, homeData);
  }
};

describe("Blacklist / Whitelist", function() {

  describe("Weather Device", function() {

    var WeatherDevice = require("../../device/weatherstation-device")(homebridgeMock);

    it('build accessories with empty config loads all', function (done) {
      var config = {};
      var station = new WeatherDevice(logx, api, config);

      station.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 10);
        done();
      });
    });

    it('build accessories with blacklist device loads all but module', function (done) {
      var config = { blacklist: [ "d2:00:00:00:00:00" ] };
      var station = new WeatherDevice(logx, api, config);

      station.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 9);
        done();
      });
    });

    it('build accessories with blacklist module loads all but module', function (done) {
      var config = { blacklist: [ "d2:m2:11:11:11:11" ] };
      var station = new WeatherDevice(logx, api, config);

      station.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 9);
        done();
      });
    });

  });

  describe("Camera Device", function() {

    var CameraDevice = require("../../device/camera-device")(homebridgeMock);

    it('build accessories with empty config loads all', function (done) {
      var config = {};
      var camera = new CameraDevice(logx, api, config);
      camera.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 6);
        done();
      });
    });

    it('build accessories with empty whitelist loads all', function (done) {
      var config = { whitelist: [] };
      var camera = new CameraDevice(logx, api, config);
      camera.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 6);
        done();
      });
    });

    it('build accessories with empty blacklist loads all', function (done) {
      var config = { blacklist: [] };
      var camera = new CameraDevice(logx, api, config);
      camera.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 6);
        done();
      });
    });

    it('build accessories with blacklist entry loads 5', function (done) {
      var config = { blacklist: [ "33:33:33:33:33:33" ] };
      var camera = new CameraDevice(logx, api, config);
      camera.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 5);
        // TODO: Check 333 not there!
        done();
      });
    });

    it('build accessories with whitelist entry loads 1', function (done) {
      var config = { whitelist: [ "55:00:00:00:00:55" ] };
      var camera = new CameraDevice(logx, api, config);
      camera.buildAccessoriesForDevices( function(err, deviceAccessories) {
        assert.equal(deviceAccessories.length, 1);
        // TODO: Check 333 not there!
        done();
      });
    });
  });
});
