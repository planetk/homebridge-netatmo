'use strict';

module.exports = function(context) {
  return new HombridgeMock(context);
};

function HombridgeMock(context) {
  this.context = context;
  this.hap = {};
  this.hap.Service = require("hap-nodejs").Service;
  this.hap.Characteristic = require("hap-nodejs").Characteristic;
  this.hap.Accessory = require("hap-nodejs").Accessory;
  this.hap.uuid = require("hap-nodejs").uuid;
}

HombridgeMock.prototype.registerPlatform = function (name, title, Platform) {
  this.name = name;
  this.title = title;
  this.Platform = Platform;
}
