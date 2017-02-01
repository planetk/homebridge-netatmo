[![Build Status](https://secure.travis-ci.org/planetk/homebridge-netatmo.png?branch=dev)](http://travis-ci.org/planetk/homebridge-netatmo)
[![downloads][downloads-image]][downloads-url]
Like this? Please buy me a beer ...
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7ZGEPWHG5UH6S)

[downloads-image]: https://img.shields.io/npm/dm/homebridge-netatmo.svg?style=flat
[downloads-url]: https://npmjs.org/package/homebridge-netatmo


# This is an unreleased Version

Things might be broken and no longer working as expected ...

**Changes**

* thermostat Implementation is now supported in "home" App
* Regular polling for updates (Trying to b nice to the API, so update may take a while to be seen on the phone)
* Fully refactored, cleaner classes
* renamed "welcome" devices to "camera"
* support for "presence"
* new motion detection 
* Using ES6
* new homekit 0.4
* netatmo API update
* new logging API

**TODO**

* Test Fixes
* Recheck Thermostat Ranges


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
            "ttl": 5,
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

### Control Accessories by device type

<pre>
            "deviceTypes": [
              <b>"weatherstation"</b>,
              <b>"thermostat"</b>,
              "camera"
            ]
</pre>

This allows you to include/exclude devices of a certain type in your accessories.
The device types marked **bold** are the **default types**, if this config section is left out.

Please note, that welcome support is by default switched off, since it is not fully implemented yet.

###  Control Accessories by device ID

Not yet implemented

###  Control Services

TBD (Needs description here)


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
- "not supported"
- "notifications only when home app opened" -> update, ifttt plugin


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

* enhance support for netatmo welcome (images?, callbacks?,)
* complete tests
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
* whitelist /blacklist
* trigger switches (-> pushover, enigma, virtual switch for scenes -> push)

----

Is this plugin useful for you? Please buy me a beer ...
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7ZGEPWHG5UH6S)

Thank you for buying me a beer to follwing mates:

* Samuel J.
* Alexis A.
* Sylvain D.
* Sebastian K.
* Frank H.
