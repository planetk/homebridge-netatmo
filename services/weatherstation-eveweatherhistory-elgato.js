'use strict';

var inherits = require('util').inherits;
var Service, Characteristic;

var EVE_WEATHER_HISTORY_SERVICE_STYPE_ID = 'E863F007-079E-48FF-8F27-9C2605A29F52';

var EVE_WEATHER_116_CTYPE_ID = 'E863F116-079E-48FF-8F27-9C2605A29F52';
var EVE_WEATHER_117_CTYPE_ID = 'E863F117-079E-48FF-8F27-9C2605A29F52';
var EVE_WEATHER_11C_CTYPE_ID = 'E863F11C-079E-48FF-8F27-9C2605A29F52';
var EVE_WEATHER_121_CTYPE_ID = 'E863F121-079E-48FF-8F27-9C2605A29F52';


var fs = require('fs');


/*

121 schreibt die Sekunden seit dem 1.1.2001,

z.B.
Epoch Timestamp 1.1.2001 = 978307200;

c121 =       cf1b521d
-> reverse   1d521bcf
-> hex2dec   491920335

978307200 + 491920335 = 1470227535

= Wed, 03 Aug 2016 12:32:15 GMT
= 3.8.2016, 14:32:15 GMT+2:00 DST (Berlin Zeit)



116 INIT:

b7460100 88a70000 33d2661d 03010202020302 9200 f50f0000000000000000
secs     ????     timestam const          meas const

*/

module.exports = function(accessory) {
  if (accessory && !Service) {
    Service = accessory.Service;
    Characteristic = accessory.Characteristic;
  }
  return { ServiceProvider: ServiceProvider};
}

var ServiceProvider = function() {

}

ServiceProvider.prototype.buildServices = function(accessory, stationData) {
  var services = [];

  services.push(this.buildEveWeatherHistoryService(accessory, stationData));

  return services;
}

var swapHexEndianString = function(str) {
  var s = str.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
  var a = s.match(/../g);                   // split number in groups of two
  a.reverse();                              // reverse the groups
  return a.join("");                        // join the groups back together
}

var swapHexEndianNum = function(value) {
  var s = value.toString(16);         // translate to hexadecimal notation
  s = s.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
  var a = s.match(/../g);             // split number in groups of two
  a.reverse();                        // reverse the groups
  var s2 = a.join("");                // join the groups back together
  return parseInt(s2, 16);            // convert to a number
}

var fillZeros = function(value, digits) {
  var suffix = "0".repeat(digits);
  var result = '' + value + digits;
  return result.substring(0, digits);
}

var hexToBase64 = function(val) {
    return new Buffer((''+val).replace(/[^0-9A-F]/ig, ''), 'hex').toString('base64');
};

var base64ToHex = function(val) {
    if(!val) return val;
    return new Buffer(val, 'base64').toString('hex');
}

var hPAtoHex = function(val) {
    return swap16(Math.round(val)).toString(16);
}

var numToHex = function(val, len) {
    var s = Number(val).toString(16);
    if(s.length % 2 != 0) {
        s = '0' + s;
    }
    if(len) {
        return ('0000000000000' + s).slice(-1 * len);
    }
    return s;
};

var swap16 = function (val) {
  return ((val & 0xFF) << 8)
  | ((val >> 8) & 0xFF);
}

function EveLogEntry(type, id, timestamp, sensorDatapoints) {
    this.type = type;
    this.id = id;
    this.timestamp = timestamp;
    if(type == 0x10) {
        this.sensorDatapoints = sensorDatapoints;
    } else {

    }
}

EveLogEntry.prototype.toHex = function() {

    var bytes = [this.type, this.id, 0x00, 0x00, 0x00, numToHex(parseInt(hPAtoHex(this.timestamp), 16), 4), 0x00, 0x00 ];

    if(this.type == 0x10) {
        bytes.push((this.sensorDatapoints.length * 2) + 1);
        bytes.push.apply(bytes, this.sensorDatapoints.map(function(s) {
            return hPAtoHex(s);
        }));
    }
    var bytesAsStrings = bytes.map(function(s) { return typeof s === 'string' ? s :numToHex(s); });

    // console.log(bytes, bytesAsStrings)
    return new Buffer(bytesAsStrings.join(''), 'hex').toString('hex');
}

var formatTimeStamp(ts) {
  // Strip millis
  if (ts > 999999999999) ts = Math.floor(ts / 1000);

  ts = ts - 978307200; // Seconds since 1.1.2001
  var result = swapHexEndianNum(ts);
  result = fillZeros(result, 8);

  return result;
}


ServiceProvider.prototype.buildEveWeatherHistoryService = function(accessory, stationData) {

  var deviceSetUpTimeStamp = 1470009600000; // 01.08.2016 0:00:00 '000 GMT
  var measurementBaseTimeStamp  = Date.now();
  var measurementsSinceTimeStamp = 0;

  console.log("NOW: " + measurementBaseTimeStamp + " - " + formatTimeStamp(measurementBaseTimeStamp));
  console.log("SET: " + deviceSetUpTimeStamp + " - " + formatTimeStamp(deviceSetUpTimeStamp));



  var Eve116Characteristic = function () {
    Characteristic.call(this, 'Hist 116', EVE_WEATHER_116_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [
        Characteristic.Perms.READ
      ]
    });
    this.value = hexToBase64('01010000 FF000000 3C0F0000 03010202 0203021D 00F50F00 00000000 000000');
  };
  inherits(Eve116Characteristic, Characteristic);

  var Eve117Characteristic = function () {
    Characteristic.call(this, 'Hist 117', EVE_WEATHER_117_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [ Characteristic.Perms.READ, Characteristic.Perms.WRITE ]
    });
    this.value = hexToBase64(
                '1500 0000  0000 0000  0080 0000  0000 0000  0000 0000  00' +
                new EveLogEntry(0x10, 1, 0, [1870, 7214, 9900]).toHex()
              + new EveLogEntry(0x10, 2, 600, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 3, 1200, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 4, 1800, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 5, 2400, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 6, 3000, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 7, 3600, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 8, 3601, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 9, 3602, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 10, 3603, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 11, 3604, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 12, 3605, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 13, 3606, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 14, 3607, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 15, 3608, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 16, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 17, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 18, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 19, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 20, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 21, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 22, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 23, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 24, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 25, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 26, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 27, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 28, 3609, [1870, 7214, 1234]).toHex()
                // new EveLogEntry(0x10, 3, 1800, [1870, 7214, 9900]).toHex() +
                // new EveLogEntry(0x10, 4, 2400, [1870, 7214, 9900]).toHex() +
                // new EveLogEntry(0x10, 5, 3000, [1870, 7214, 9900]).toHex() +
                // new EveLogEntry(0x10, 6, 3600, [1870, 7214, 9900]).toHex() +
                // new EveLogEntry(0x10, 7, 4200, [1870, 7214, 9900]).toHex()
                // '1001 0000  0001 0000  0007 4e07  2e1c ac26' +
                // '1502 0000  00c8 0000  0081 3ce1  c21b 0000  0000 0000  00' +
                // '1003 0000  0059 0200  0007 6507  b919 a226' +
                // '1004 0000  00b2 0400  0007 e807  671d ac26' +
                // '1005 0000  0009 0700  0007 E807  671D 3930'
            )
  };
  inherits(Eve117Characteristic, Characteristic);

  var Eve11CCharacteristic = function () {
    Characteristic.call(this, 'Hist 11C', EVE_WEATHER_11C_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [
        Characteristic.Perms.WRITE
      ]
    });
  };
  inherits(Eve11CCharacteristic, Characteristic);

  var Eve121Characteristic = function () {
    Characteristic.call(this, 'Hist 121', EVE_WEATHER_121_CTYPE_ID);
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [
        Characteristic.Perms.WRITE
      ]
    });
  };
  inherits(Eve121Characteristic, Characteristic);

  var EveWeatherHistoryService = function (displayName, subtype) {
    Service.call(this, displayName, EVE_WEATHER_HISTORY_SERVICE_STYPE_ID, subtype);
    this.addCharacteristic(Eve116Characteristic);
    this.addCharacteristic(Eve117Characteristic);
    this.addCharacteristic(Eve11CCharacteristic);
    this.addCharacteristic(Eve121Characteristic);
  };
  inherits(EveWeatherHistoryService, Service);

  var eveWeatherHistoryService = new EveWeatherHistoryService(accessory.displayName + " History");

  eveWeatherHistoryService.getCharacteristic(Eve117Characteristic)
      .on('set', function(val, cb) {
          console.log('117 was written: %s', base64ToHex(val));
          cb(null, val);
      })
      .on('get', function(cb) {
        console.log('Reading 117');

        fs.readFile('/Users/stefan/.homebridge/c117data.txt', 'utf8', function (err,data) {
          if (err) {
            console.log(err);
            cb(err,null);
          } else {
            console.log(data);

            var val = hexToBase64(
                  data
              + new EveLogEntry(0x10, 1, 0, [1870, 7214, 9900]).toHex()
              + new EveLogEntry(0x10, 2, 600, [1870, 7214, 1234]).toHex()
/*
              + new EveLogEntry(0x10, 3, 1200, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 4, 1800, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 5, 2400, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 6, 3000, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 7, 3600, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 8, 3601, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 9, 3602, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 10, 3603, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 11, 3604, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 12, 3605, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 13, 3606, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 14, 3607, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 15, 3608, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 16, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 17, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 18, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 19, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 20, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 21, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 22, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 23, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 24, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 25, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 26, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 27, 3609, [1870, 7214, 1234]).toHex()
              + new EveLogEntry(0x10, 28, 3609, [1870, 7214, 1234]).toHex()
*/
                  // new EveLogEntry(0x10, 3, 1800, [1870, 7214, 9900]).toHex() +
                  // new EveLogEntry(0x10, 4, 2400, [1870, 7214, 9900]).toHex() +
                  // new EveLogEntry(0x10, 5, 3000, [1870, 7214, 9900]).toHex() +
                  // new EveLogEntry(0x10, 6, 3600, [1870, 7214, 9900]).toHex() +
                  // new EveLogEntry(0x10, 7, 4200, [1870, 7214, 9900]).toHex()
                  // '1001 0000  0001 0000  0007 4e07  2e1c ac26' +
                  // '1502 0000  00c8 0000  0081 3ce1  c21b 0000  0000 0000  00' +
                  // '1003 0000  0059 0200  0007 6507  b919 a226' +
                  // '1004 0000  00b2 0400  0007 e807  671d ac26' +
                  // '1005 0000  0009 0700  0007 E807  671D 3930'
            );
            cb(null, val);
          }
        });
      });



  eveWeatherHistoryService.getCharacteristic(Eve11CCharacteristic)
      .on('set', function(val, cb) {
          console.log('11C was written: %s', base64ToHex(val));

          // 01140100000000
          //cb(null, val);
          cb(null, hexToBase64('0114012f35521d'));
      });

  eveWeatherHistoryService.getCharacteristic(Eve121Characteristic)
      .on('set', function(val, cb) {
          console.log('121 was written: %s', base64ToHex(val));

          // datum: 2f35521d
          //cb(null, val);
          cb(null, hexToBase64('1c33521d'));
      });

  return eveWeatherHistoryService;
}