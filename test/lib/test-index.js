var assert = require('assert');

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
          var platform = new homebridgeMock.PlatformType(console.log, config);
        } catch (error) {
          assert.equal(error.message, "Authenticate 'args' not set.");
        }
      });
    });

    describe("Homebridge Platform", function() {
      it('succeeds with existing API Auth Info', function () {
        var config = { auth: dummyAuth};
        var platform = new homebridgeMock.PlatformType(console.log, config);
        assert.ok(platform, "Could not init platform");
      });
    });

    describe("Homebridge Platform", function() {

      it('creates accessories', function (done) {
        var config = { auth: dummyAuth};

        var platform = new homebridgeMock.PlatformType(console.log, config);
        platform.api = require("../../lib/netatmo-api-mock")('default');

        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          done();
        });

      });

      it('creates only 3 weatherstation devices in default context', function (done) {
        var config = { auth: dummyAuth, deviceTypes: ['weatherstation']};
        var platform = new homebridgeMock.PlatformType(console.log, config);
        platform.api = require("../../lib/netatmo-api-mock")('default');

        platform.accessories(function(acc) {
          assert.ok(acc, "Did not find any accessories!");
          assert.equal(acc.length, 3);
          done();
        });
      });

    });

  });

});