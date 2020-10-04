"use strict";
/*
 * Measurement model.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */
exports.__esModule = true;
exports.MeasurementConstants = exports.GeoJSON = void 0;
var GeoJSON = /** @class */ (function () {
    function GeoJSON() {
    }
    return GeoJSON;
}());
exports.GeoJSON = GeoJSON;
var MeasurementConstants = /** @class */ (function () {
    function MeasurementConstants() {
    }
    MeasurementConstants.SecondsPerMinute = 60;
    MeasurementConstants.MinutesPerHour = 60;
    MeasurementConstants.LatitudeMin = -90;
    MeasurementConstants.LatitudeMax = 90;
    MeasurementConstants.LongitudeMin = -180;
    MeasurementConstants.LongitudeMax = 80;
    return MeasurementConstants;
}());
exports.MeasurementConstants = MeasurementConstants;
