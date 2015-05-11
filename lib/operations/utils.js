/**
 * Created by mauricio on 5/10/15.
 */
'use strict';
var rmath = require('../round-math');

var utils = {};

/**
 * Checks if an interval is empty, it's empty whenever
 * the `lo` property has a higher value than the `hi` property
 * @param {Interval} a
 * @returns {boolean}
 */
utils.empty = function (a) {
  return a.lo > a.hi;
};

/**
 * True if zero is included in the interval `a`
 * @param {Interval} a
 * @returns {boolean}
 */
utils.zeroIn = function (a) {
  return utils.in(a, 0);
};

/**
 * True if `v` is included in the interval `a`
 * @param {Interval} a
 * @param v
 * @returns {boolean}
 */
utils.in = function (a, v) {
  if (utils.empty(a)) { return false; }
  return a.lo <= v && v <= a.hi;
};

/**
 * Checks if `a` is a subset of `b`
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
utils.subset = function (a, b) {
  if (utils.empty(a)) { return true; }
  return !utils.empty(b) && b.lo <= a.lo && a.hi <= b.hi;
};

/**
 * Checks if the intervals `a`, `b` overlap
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
utils.overlap = function (a, b) {
  if (utils.empty(a) || utils.empty(b)) { return false; }
  return (a.lo <= b.lo && b.lo <= a.hi) ||
    (b.lo <= a.lo && a.lo <= b.hi);
};

/**
 * Checks if the intervals `a`, `b` are equal
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
utils.equal = function (a, b) {
  if (utils.empty(a)) { return utils.empty(b); }
  return !utils.empty(b) && a.lo === b.lo && a.hi === b.hi;
};

/**
 * Computes the distance of the bounds of an interval
 * @param {Interval} x
 * @returns {number}
 */
utils.width = function (x) {
  if (utils.empty(x)) { return 0; }
  return rmath.subHi(x.hi, x.lo);
};

// <debug>
utils.almostEqual = function (x, y) {
  var EPS = 1e-7;
  function assert(a, message) {
    if (!a) {
      throw new Error(message || 'assertion error');
    }
  }

  function assertEps(a, b) {
    assert( Math.abs(a - b) < EPS );
  }

  x = x.push ? x : x.toArray();
  y = y.push ? y : y.toArray();
  assertEps(x[0], y[0]);
  assertEps(x[1], y[1]);
  assert(x[0] <= x[1], 'interval must not be empty');
};
// </debug>

module.exports = utils;
