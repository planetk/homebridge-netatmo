var assert = require('assert');
var log = require("./logger")._system;

var homebridgeMock = require('./homebridge-mock')();

var dummyAuth = {
        client_id: "1234567890",
        client_secret: "0987654321",
        username: "test@tester.com",
        password: "password"
};

require("../../index")(homebridgeMock);

describe("Netatmo Plugin (index)", function() {

  describe("Homebridge Platform", function() {

    it('registerPlatform is called with name', function () {
      assert.equal(homebridgeMock.pluginName, "homebridge-netatmo");
    });    

    it('registerPlatform is called with config name', function () {
      assert.equal(homebridgeMock.configName, "netatmo");
    });    

    it('Platform is existant', function () {
      assert.ok(homebridgeMock.PlatformType, "Platform not defined");
    });
  });

  describe("Netatmo Platform Functionality", function() {

    describe("Homebridge Platform", function() {
      it('fails with missing auth key in config', function () {
        var config = {};
        try {
          var platform = new homebridgeMock.PlatformType(log, config);
        } catch (error) {
          assert.equal(error.message, "Authenticate 'args' not set.");
        }
      });
    });

    describe("Homebridge Platform", function() {
      it('succeeds with existing API Auth Info', function () {
        var config = { auth: dummyAuth};
        var platform = new homebridgeMock.PlatformType(log, config);
        assert.ok(platform, "Could not init platform");
      });
    });

    describe("Homebridge Platform", function() {

      it('creates 5 accessories', function (done) {
        var config = {
          auth: dummyAuth,
          mockapi: 'default'
        };

        var platform = new homebridgeMock.PlatformType(log, config);

        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          assert.equal(acc.length, 5);
          done();
        });

      });

      it('creates 4 weatherstation accesories in wind context', function (done) {
        var config = {
          auth: dummyAuth,
          mockapi: 'wind',
          deviceTypes: ['weatherstation']
        };
        var platform = new homebridgeMock.PlatformType(log, config);
        
        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          assert.equal(acc.length, 4);
          done();
        });
      });

      it('creates 3 weatherstation accesories in default context', function (done) {
        var config = {
          auth: dummyAuth,
          mockapi: 'default',
          deviceTypes: ['weatherstation']
        };
        var platform = new homebridgeMock.PlatformType(log, config);
        
        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          assert.equal(acc.length, 3);
          done();
        });
      });

      it('creates 1 thermostat accesory in default context', function (done) {
        var config = {
          auth: dummyAuth,
          mockapi: 'default',
          deviceTypes: ['thermostat']
        };
        var platform = new homebridgeMock.PlatformType(log, config);
        
        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          assert.equal(acc.length, 1);
          done();
        });
      });

    });

  });

});