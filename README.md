[![Build Status](https://secure.travis-ci.org/planetk/homebridge-netatmo.png?branch=master)](http://travis-ci.org/planetk/homebridge-netatmo)

# homebridge-netatmo

This is a plugin for homebridge. It's a fully-working implementation of a **netatmo weather station**.

> It now also include a partial implementation for the **netatmo thermostat**

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-netatmo
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

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
