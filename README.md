[![Build Status](https://secure.travis-ci.org/planetk/homebridge-netatmo.png?branch=master)](http://travis-ci.org/planetk/homebridge-netatmo)
[![downloads][downloads-image]][downloads-url]
Like this? Please buy me a beer ...
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7ZGEPWHG5UH6S)

[downloads-image]: https://img.shields.io/npm/dm/homebridge-netatmo.svg?style=flat
[downloads-url]: https://npmjs.org/package/homebridge-netatmo

# homebridge-netatmo

This is a plugin for homebridge. It's a working implementation for several netatmo devices:

* **netatmo weather station**
* **netatmo thermostat**
* **netatmo welcome** 

_Please check [notes on devices](#notes) below for detailed information on supported modules_.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-netatmo
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

## Simple Configuration


Configuration sample:

```
"platforms": [
        {
            "platform": "netatmo",
            "name": "netatmo platform",
            "ttl": 10,
            "auth": {
    	        "client_id": "XXXXX Create at https://dev.netatmo.com/",
                "client_secret": "XXXXX Create at https://dev.netatmo.com/",
                "username": "your netatmo username",
                "password": "your netatmo password"
            }
        }
    ],

```

To retrieve client id and secret please follow following guide:

1. Register at http://dev.netatmo.com as a developer
2. After successful registration create your own app by using the menu entry "CREATE AN APP"
3. On the following page, enter a name for your app. Any name can be chosen. All other fields of the form (like callback url, etc.) can be left blank.
4. After successfully submitting the form the overview page of your app should show client id and secret.


## Advanced Configuration

There are some optional configuration options in the netatmo section of the config which provide finer control about what device and services to use to create accessories.

### API Refresh and timings

Communication towards netatmo API is time by three parameters:

<dl>
 <dt>ttl</dt>
 <dd>Time in seconds, how long data will be kept in the internal cache. Mainly useful to avoide duplicated requests for different values from the same device. Defaults to 10 seconds if left out in config.</dd>
 <dt>refresh_check</dt>
 <dd>Time in milliseconds, how often the api will be automatically polled to check for changes. Defaults to 900000 which is 15 Minutes. Do not take values much lower, or you risk, that you put to much traffic to the netatmo API. In worst case netatmo might temporarilly exclude your app from the api.</dd>
 <dt> refresh_run </dt>
 <dd>Time in milliseconds, how often the the module checks if there was a request to refresh the data, either from the automatic polling or due to changes in the homekit app. This allows to have regular checks as well as refreshes after changes were done in the app. Defaults to 20000 which is 20 Seconds.</dd>

<pre>

    "platforms": [
        {
            "platform": "netatmo",
            
            ...
            
			  <b>"ttl": 10,
			  "refresh_check": 900000
			  "refresh_run": 20000</b>
            ...
            
        }
    ],

</pre>




### Control Accessories by device type

<pre>

    "platforms": [
        {
            "platform": "netatmo",
            
            ...
            
            <b>"deviceTypes": [
              "weatherstation",
              "thermostat",
              "camera"
            ],</b>

            ...
            
        }
    ],

</pre>

This allows you to include/exclude devices of a certain type in your accessories.
The device types marked **bold** are the **default types**, if this config section is left out.

Please note, that welcome support is by default switched off, since it is not fully implemented yet.

###  Control Accessories by device ID

Controlling devices can be done pn a finer level by id. The id of a netatmo device or module basically is it's mac address.

In order to include or exclude a specific device, the corresponding id can be included in a whitelist resp. blacklist.

If the whitelist contains at least one entry, all oter ids will be excluded.

<pre>

    "platforms": [
        {
            "platform": "netatmo",
            
            ...
            
            <b>"whitelist": [
              "aa:bb:cc:11:22:33"
            ],
            "blacklist": [
              "01:02:03:04:05:06",
              "01:23:45:67:89:ab"
            ],</b>

            ...
            
        }
    ],

</pre>

###  Control Services

TBD (Needs description here)

<!-- 
"options_weather": {
"device_id": "XX:XX:XX:XX:XX:XX"
},
-->

#<a name="notes"></a> Notes on devices
## Weather station
The indoor module and outdoor module are fully supported.
The rain gauge and the wind gauge are in general supported, but these devices use characteristics, which are not supported by the home app.

For this reason the home app shows the devices as not supported. If you want to use this devices you should consider to use a different homekit app. For example elgato's <a href="https://itunes.apple.com/us/app/elgato-eve/id917695792" target="blank">eve</a> app is a good free alternative.

## Thermostat
The thermostat is fully supported. There are a few things to know:

* The allowed temperature ranges differ between netatmo themostat and apple home app. This results in a narrower range of possible temperatures.
* Mapping of Temperature Modes between netatmo and apple is done as good as possible, but might be slightly confusing under certain conditions.
* After setting a temperature, the thermostat might return to automatic mode. Check your netatmo settings.

## Cameras (Welcome and Presence)
The camera devices are currently only supported as simple motion sensors.
Motion detection might be delayed, since the polling is required an netatmo has strict request rate limits.

Any events of Type "movement", "person" and "outdoor" will be considered as a motion.

This implementation will most likely be refactored in future.

#FAQ

##My rain/wind gauge shows up as not supported
This is due to limmited support of the home app. Try to use a different homekit app. Check [notes on devices](#notes) for further info.

##I only get notifications when home app is opened
This themes to ba an issue with ios and hap lib. There is nothing I can do about it. Possible you should check the hombridge ifttt plugin with pushover app for notifications.

##Updates of vlaues are delayed
This is due to rate limits from netatmo. If polling rate is increased your account might get blocked by netatmo

##netatmo authentication failes
Please recheck your config settings and your netatmo account.
Sometimes the used netatmo API seems to have connection problems. Often a reload is enough

##Things are messed up. How do I start from scratch?
In short:

* stop homebridge.
* reset your homekit config on the phone (delete the Home in home app).
* remove the .hombridge/persist folder
* check the .hombridge/config file
* start homebridge

##This is cool, how can I support?
If you like this, your welcome to give a small donation. Check button at top/bottom of page.
If you like to join development check the sources, open issues and pull requests.
Thanx!


# Changes

## 0.2.0
* Version 0.2.0 is a complete refactoring, some config changes might be required
* thermostat implementation is now supported in "home" App
* Regular polling for updates (Trying to be nice to the API, so update may take a while to be seen on the phone)
* Fully refactored, cleaner classes
* renamed "welcome" devices to "camera"
* support for "presence" devices
* new motion detection 
* Using ES6
* new homekit 0.4
* netatmo API update
* new logging API

# Development

Following information is not relevant for users who just want to access netatmo via homekit.
It is intented for software developers who want to modify / enhance the functionality of the software.

## Terms

<dl>
 <dt>Device</dt>
 <dd>A device in this context is a netatmo hadware device.</dd>

 <dt>Device Type</dt>
 <dd>Describes the type of the netatmo device i.e. weatherstation, thermostat or welcome.</dd>


 <dt>Module</dt>
 <dd>Some devices contain several modules (e.g. weatherstation: main module, rain gauge, outside module, wind gauge). A device or module results in an accessory</dd>
 
</dl>

## Concepts

New deviceTypes should be put into the */devices* folder. It might be helpful to use the existing deviceTypess as template and to inherit the NetatmoDevice. Each device provides one or more accessories which provide one or more services.

Services are defined inside the */services* folder. The naming convention is, that a service source code file starts with the device name.

The default set of devices and services that are used is the one which resulted from earlier versions.

Please see Chapter **Advanced Configuration** on details about how to add a device or a service.

## Mock API & Testing

New features should be developed with a test scenario. Tests are executed via travis-ci or npm test.

For debugging and test purposes the software contains a support for a mock netatmo api.

The mock-api is activate by putting a

    mockapi: "name"

into the netatmo section of the config file.

When activated there will be no calls to the netatmo API. Instead raw json data is read from file located in the */mockapi_calls* folder.

The file name is *[apimethod]-[name].json* where
 
* *[apimethod]* is the name of the netatmo method to be called (e.g. getstationsdata )
* *[name]* is the name given in the config file (e.g. wind)
 
If this file is not found a *[apimethod]-default.json* file is read.
If this is not found as well, empty data is returned.

# TODO / Next Features
Following things are to be developed next.

* static code checks
* release management
* recheck thermostat ranges
* enhance support for netatmo welcome (images?, callbacks?,)
* complete tests (config, unit tests, devices)
* add optional eve services including history data
* recheck temperature units (Celsius - Fahrenheit)
* support for min/max temperature
* add Radio Link Quality characteristic
* I18N for service and accessory names (config)
* add SoftwareRevision characteristic -> plugin version
* log callbacks with error != null
* Review all //TODO comments from sources
* document extended config (switch on/off devices/services)
* fix env/tests
* names in config
* trigger switches (-> pushover, enigma, virtual switch for scenes -> push)

----

Is this plugin useful for you? Please buy me a beer ...
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7ZGEPWHG5UH6S)

<small>
Thank you for buying me a beer to follwing users:

* 2016-07-18: Samuel J.
* 2016-09-03: Alexis A. 
* 2016-09-16: Sylvain D. 
* 2016-11-01: Sebastian K.
* 2016-11-04: Frank H.
</small>