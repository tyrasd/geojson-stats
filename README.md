geojson-length
==============

Calculate statistics of [GeoJSON](http://geojson.org/) data.

usage
-----

### as a **command line tool**:

    npm install -g geojson-stats
    geojson-stats file.geojson

![](https://cloud.githubusercontent.com/assets/1927298/5631886/810c0464-95ca-11e4-85e3-883a129ed44d.png)

### as a **library**:

    npm install geojson-stats

    var stats = require('geojson-stats');
    console.log(stats(geojson));

API
---

### `function( geojson, properties )`

* `geojson`: GeoJSON data. Can be a FeatureCollection, Feature or Geometry object.
* `properties`: optional. An array of property names for which stats should be gathered (in addition to line lengths and polygon areas).

The result is an array of objects containing the stats for each requested variable.

Lengths and areas are approximate calculations and given in [SI units](https://en.wikipedia.org/wiki/International_System_of_Units).
