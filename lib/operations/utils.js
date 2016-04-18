/**
 * Created by mauricio on 5/10/15.
 * Extended by MiLia 04/2016.
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
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isEmpty = function (x) {
//  return x.lo > x.hi
	return (x.lo == Number.NaN && x.hi == Number.NaN)
}

/**
 *  Checks if the interval is positive
 *  @param {Interval} x	
 *  @return {boolean}
 */
utils.isPositive = function (x) {
	return x.lo > 0
}

/** Checks if an interval is not negative
 *	@param {Interval} x
 *	@returns {boolean}
 */ 
utils.isNotNegative = function (x) {
	return x.lo >= 0
}

/**	 Checks if an interval is the zero interval [0,0].
 *	@param   {Interval} x
 *  @returns {boolean}
 */
utils.isZero = function (x) {
	if (x.lo == 0 && x.hi ==0) { return true}
}

/**
 * Checks if an interval is a whole interval, that is it covers all
 * the real numbers
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isWhole = function (x) {
  return x.lo === -Infinity && x.hi === Infinity
}

/*
 * True if zero is included in the interval `a`
 * @param {Interval} x
 * @returns {boolean}
 */
utils.zeroIn = function (x) {
  return utils.hasValue(x, 0)
}

/**
 * True if `v` is included in the interval `a`
 * @param {Interval} a
 * @param {number} v
 * @returns {boolean}
 */
utils.hasValue = function (x, v) {
  if (utils.isEmpty(a)) { return false }
  return x.lo <= v && v <= x.hi
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

/**
/**
 * Checks if the intervals `x` is a singleton (an interval representing a single value)
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isSingleton = function (x) {
  return !utils.isEmpty(x) && x.lo === x.hi
}

module.exports = utils
