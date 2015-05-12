/**
 * Created by mauricio on 5/11/15.
 */
'use strict';
var Interval = require('./interval');

var piLow = (3373259426.0 + 273688.0 / (1 << 21)) / (1 << 30);
var piHigh = (3373259426.0 + 273689.0 / (1 << 21)) / (1 << 30);

var constants = {};

constants.PI_LOW = piLow;
constants.PI_HIGH = piHigh;
constants.PI_HALF_LOW = piLow / 2;
constants.PI_HALF_HIGH = piHigh / 2;
constants.PI_TWICE_LOW = piLow * 2;
constants.PI_TWICE_HIGH = piHigh * 2;

// intervals
constants.PI = new Interval(piLow, piHigh);
constants.PI_HALF = new Interval(constants.PI_HALF_LOW, constants.PI_HALF_HIGH);
constants.PI_TWICE = new Interval(constants.PI_TWICE_LOW, constants.PI_TWICE_HIGH);
constants.ZERO = new Interval(0, 0);
constants.ONE = new Interval(1, 1);
constants.WHOLE = new Interval().setWhole();
constants.EMPTY = new Interval().setEmpty();

module.exports = constants;
