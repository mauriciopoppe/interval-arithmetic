/**
 * Created by mauricio on 5/10/15.
 */
'use strict';
var interval = require('../interval');
var rmath = require('../round-math');

var arithmetic = {};

/**
 * Checks if an interval is empty, it's empty whenever
 * the `lo` property has a higher value than the `hi` property
 * @param {Interval} a
 * @returns {boolean}
 */
arithmetic.empty = function (a) {
  return a.lo > a.hi;
};

/**
 * True if zero is included in the interval `a`
 * @param {Interval} a
 * @returns {boolean}
 */
arithmetic.zeroIn = function (a) {
  return arithmetic.in(a, 0);
};

/**
 * True if `v` is included in the interval `a`
 * @param {Interval} a
 * @param v
 * @returns {boolean}
 */
arithmetic.in = function (a, v) {
  if (arithmetic.empty(a)) { return false; }
  return a.lo <= v && v <= a.hi;
};

/**
 * Checks if `a` is a subset of `b`
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
arithmetic.subset = function (a, b) {
  if (arithmetic.empty(a)) { return true; }
  return !arithmetic.empty(b) && b.lo <= a.lo && a.hi <= b.hi;
};

/**
 * Checks if the intervals `a`, `b` overlap
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
arithmetic.overlap = function (a, b) {
  if (arithmetic.empty(a) || arithmetic.empty(b)) { return false; }
  return (a.lo <= b.lo && b.lo <= a.hi) ||
    (b.lo <= a.lo && a.lo <= b.hi);
};

/**
 * Checks if the intervals `a`, `b` are equal
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
arithmetic.equal = function (a, b) {
  if (arithmetic.empty(a)) { return arithmetic.empty(b); }
  return !arithmetic.empty(b) && a.lo === b.lo && a.hi === b.hi;
};

module.exports = arithmetic;
