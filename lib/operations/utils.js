/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var utils = {}

/**
 * Checks if the given parameter is an interval
 * @param  {*}  x An object that must have the properties `lo` and `hi` properties
 * to be an interval
 * @return {Boolean} true if `x` is an interval
 */
utils.isInterval = function (x) {
  return typeof x === 'object' && typeof x.lo === 'number' && typeof x.hi === 'number'
}

/**
 * Checks if an interval is empty, it's empty whenever
 * the `lo` property has a higher value than the `hi` property
 * @param {Interval} a
 * @returns {boolean}
 */
utils.isEmpty = function (a) {
  return a.lo > a.hi
}

/**
 * Checks if an interval is a whole interval, that is it covers all
 * the real numbers
 * @param {Interval} a
 * @returns {boolean}
 */
utils.isWhole = function (a) {
  return a.lo === -Infinity && a.hi === Infinity
}

/**
/**
 * Checks if the intervals `x` is a singleton (an interval representing a single value)
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isSingleton = function (x) {
  return !utils.isEmpty(x) && x.lo === x.hi
}

/*
 * True if zero is included in the interval `a`
 * @param {Interval} a
 * @returns {boolean}
 */
utils.zeroIn = function (a) {
  return utils.hasValue(a, 0)
}

/**
 * True if `v` is included in the interval `a`
 * @param {Interval} a
 * @param {number} v
 * @returns {boolean}
 */
utils.hasValue = function (a, v) {
  if (utils.isEmpty(a)) { return false }
  return a.lo <= v && v <= a.hi
}

/**
 * Checks if `a` is a subset of `b`
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
utils.hasInterval = function (a, b) {
  if (utils.isEmpty(a)) { return true }
  return !utils.isEmpty(b) && b.lo <= a.lo && a.hi <= b.hi
}

/**
 * Checks if the intervals `a`, `b` overlap
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean}
 */
utils.intervalsOverlap = function (a, b) {
  if (utils.isEmpty(a) || utils.isEmpty(b)) { return false }
  return (a.lo <= b.lo && b.lo <= a.hi) ||
  (b.lo <= a.lo && a.lo <= b.hi)
}

module.exports = utils
