var geojsonArea = require('geojson-area').geometry;
var geojsonLength = require('geojson-length');
var simplestats = require('simple-statistics');

function stats( geojson, properties ) {

    var unit = 'kilometers',
        unitFactor = 1000;

    var features;
    if (geojson.type === 'FeatureCollection')
        features = geojson.features;
    else if (geojson.type === 'Feature')
        features = [geojson];
    else
        features = [{type: 'Feature', properties: {}, geometry: geojson}];

    function props(feature) {
        function getLineStringLength(coordinates) {
            if (coordinates.length<2)
                return 0;
            return coordinates.reduce(function(p,c) {
                c.dist = (p.dist||0) + turf.distance(turf.point(p), turf.point(c), unit);
                return c;
            }).dist*unitFactor;
        }
        var output = {};
        if (feature.geometry.type === "LineString" || feature.geometry.type === "MultiLineString") {
            output.length = geojsonLength(feature.geometry);
        }
        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
            output.area = geojsonArea(feature.geometry);
        }
        output.properties = feature.properties;
        return output;
    }

    var featuresProps = features.map(props);

    function gather(prop, basic) {
        function isNumeric(n) {
        return !Array.isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
        }
        var featureLens = featuresProps
            .map(function(f) {
                if (basic)
                    return f[prop];
                else
                    return f.properties[prop];
            })
            .filter(function(x) {
                return x!==undefined && isNumeric(x);
            });
        return {
            title:    prop,
            count:    featureLens.length,
            mean:     simplestats.mean(featureLens),
            sum:      simplestats.sum(featureLens),
            variance: simplestats.variance(featureLens),
            median:   simplestats.median(featureLens),
            min:      simplestats.min(featureLens),
            max:      simplestats.max(featureLens)
        };
    }

    return [
        gather("length", true),
        gather("area", true)
        ].concat(
        (properties||[]).map(function(prop) {
            return gather(prop);
        }));
};

module.exports = stats;
