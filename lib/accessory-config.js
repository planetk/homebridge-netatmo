'use strict';

class AccessoryConfig {
  constructor(id, netatmoType, firmware, name) {
  	this.id = id;
  	this.netatmoType = netatmoType;
  	this.firmware = firmware;
  	this.name = name;
  }
}

module.exports = AccessoryConfig;
