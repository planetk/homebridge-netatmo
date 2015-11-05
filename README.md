# homebridge-netatmo

This ia a plugin for homebridge. It is a fully-working implementation of a netatmo weather station.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-netatmo
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample:

 ```
"platforms": [
        {
            "platform": "Netatmo",
            "name": "Netatmo Weather",
            "ttl": 5,
            "auth": {
    	        "client_id": "XXXXX Create at https://dev.netatmo.com/",
                "client_secret": "XXXXX Create at https://dev.netatmo.com/",
                "username": "your netatmo username",
                "password": "your netatmo password"
            }
        },
        {
            "platform": "EzControlXS1",
            "name": "EzControl XS1",
            "xs1address" : "xs1"
        }
    ],

```