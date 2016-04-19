//  Created by mauricio on 5/10/15.
'use strict'

/**
 * @mixin utils
 */
var utils = {}

/**
 * Checks if `x` is an interval, `x` is an interval if it's an object which has
 * `x.lo` and `x.hi` defined and both are numbers
 * @example
 * Interval.isInterval(
 *   Interval()
 * ) // true
 * @example
 * Interval.isInterval(
 *   undefined
 * ) // false
 * @example
 * Interval.isInterval(
 *   {lo: 1, hi: 2}
 * ) // true
 * @param  {*} x
 * @return {Boolean} true if `x` is an interval
 */
utils.isInterval = function (x) {
  return typeof x === 'object' && typeof x.lo === 'number' && typeof x.hi === 'number'
}

/**
 * Checks if `x` is empty, it's empty when `x.lo > x.hi`
 * @example
 * Interval.isEmpty(
 *   Interval.EMPTY
 * ) // true
 * @example
 * Interval.isEmpty(
 *   Interval.WHOLE
 * ) // false
 * @example
 * Interval.isEmpty(
 *   // bypass empty interval check
 *   Interval().set(1, -1)
 * ) // true
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isEmpty = function (x) {
  return x.lo > x.hi
}

/**
 * Checks if an interval is a whole interval, that is an interval which covers
 * all the real numbers i.e. when `x.lo === -Infinity` and `x.hi === Infinity`
 * @example
 * Interval.isWhole(
 *   Interval.WHOLE
 * ) // true
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isWhole = function (x) {
  return x.lo === -Infinity && x.hi === Infinity
}

/**
 * Checks if the intervals `x` is a singleton (an interval representing a single
 * value) i.e. when `x.lo === x.hi`
 * @example
 * Interval.isSingleton(
 *  Interval(2, 2)
 * ) // true
 * @example
 * Interval.isSingleton(
 *  Interval(2)
 * ) // true
 * @param {Interval} x
 * @returns {boolean}
 */
utils.isSingleton = function (x) {
  return x.lo === x.hi
}

/**
 * Checks if zero is included in the interval `x`
 * @example
 * Interval.zeroIn(
 *   Interval(-1, 1)
 * ) // true
 * @param {Interval} x
 * @returns {boolean}
 */
utils.zeroIn = function (x) {
  return utils.hasValue(x, 0)
}

/**
 * Checks if `value` is included in the interval `x`
 * @example
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   0
 * ) // true
 * @example
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   10
 * ) // false
 * @param {Interval} x
 * @param {number} value
 * @returns {boolean}
 */
utils.hasValue = function (a, value) {
  if (utils.isEmpty(a)) { return false }
  return a.lo <= value && value <= a.hi
}

/**
 * Checks if `x` is a subset of `y`
 * @example
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * @example
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 4)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
utils.hasInterval = function (x, y) {
  if (utils.isEmpty(x)) { return true }
  return !utils.isEmpty(y) && y.lo <= x.lo && x.hi <= y.hi
}

/**
 * Checks if the intervals `x`, `y` overlap i.e. if they share at least one
 * value
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(1, 3)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(2, 3)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 1),
 *   Interval(2, 3)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
utils.intervalsOverlap = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) { return false }
  return (x.lo <= y.lo && y.lo <= x.hi) ||
  (y.lo <= x.lo && x.lo <= y.hi)
}

module.exports = utils
