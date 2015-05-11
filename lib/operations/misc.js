/**
 * Created by mauricio on 5/11/15.
 */
'use strict';
var constants = require('../constants');
var Interval = require('../interval');
var rmath = require('../round-math');
var utils = require('./utils');
var algebra = require('./algebra');
var arithmetic = require('./arithmetic');

var misc = {};

misc.exp = function (x) {
  if (utils.empty(x)) { return constants.EMPTY; }
  return new Interval(
    rmath.expLo(x.lo),
    rmath.expHi(x.hi)
  );
};

misc.log = function (x) {
  if (utils.empty(x)) { return constants.EMPTY; }
  var l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo);
  return new Interval(l, rmath.logHi(x.hi));
};

misc.LOG_EXP_10 = misc.log( new Interval(10, 10) );

misc.log10 = function (x) {
  if (utils.empty(x)) { return constants.EMPTY; }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_10);
};

misc.LOG_EXP_2 = misc.log( new Interval(2, 2) );

misc.log2 = function (x) {
  if (utils.empty(x)) { return constants.EMPTY; }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_2);
};

module.exports = misc;
