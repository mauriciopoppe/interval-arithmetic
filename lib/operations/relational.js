// Created by mauricio on 5/14/15.

'use strict'
var utils = require('./utils')

// boost/numeric/interval_lib/compare/certain package on boost

/**
 * @mixin relational
 */
var relational = {}

/**
 * Checks if the intervals `x`, `y` are equal, they're equal when
 * `x.lo === y.lo` and `x.hi === y.hi`, a corner case handled is when `x` and
 * `y` are both empty intervals
 * @example
 * Interval.equal(
 *   Interval(2, 3),
 *   Interval(2, 3)
 * ) // true
 * @example
 * Interval.equal(
 *   Interval.EMPTY,
 *   Interval.EMPTY
 * ) // true
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
relational.equal = function (x, y) {
  if (utils.isEmpty(x)) {
    return utils.isEmpty(y)
  }
  return !utils.isEmpty(y) && x.lo === y.lo && x.hi === y.hi
}

// <debug>
relational.almostEqual = function (x, y) {
  var EPS = 1e-7
  function assert (a, message) {
    /* istanbul ignore next */
    if (!a) {
      throw new Error(message || 'assertion failed')
    }
  }

  function assertEps (a, b) {
    assert(Math.abs(a - b) < EPS, 'expected ' + a + ' to be close to ' + b)
  }

  x = Array.isArray(x) ? x : x.toArray()
  y = Array.isArray(y) ? y : y.toArray()
  assertEps(x[0], y[0])
  assertEps(x[1], y[1])
  assert(x[0] <= x[1], 'interval must not be empty')
}
// </debug>

/**
 * Checks if the intervals `x`, `y` are not equal i.e. when the intervals don't
 * share any value
 * @example
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * @example
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // false
 * @example
 * Interval.notEqual(
 *   Interval(2, 4),
 *   Interval(3, 5)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
relational.notEqual = function (x, y) {
  if (utils.isEmpty(x)) {
    return !utils.isEmpty(y)
  }
  return utils.isEmpty(y) || x.hi < y.lo || x.lo > y.hi
}

/**
 * Checks if the interval `x` is less than `y` i.e. if all the values of `x`
 * are lower than the left endpoint of `y`
 * @example
 * Interval.lessThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * @example
 * Interval.lessThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.lessThan = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi < y.lo
}

/**
 * Alias for {@link relational.lessThan}
 * @function
 */
relational.lt = relational.lessThan

/**
 * Checks if the interval `x` is greater than `y` i.e. if all the values of `x`
 * are greater than the right endpoint of `y`
 * @example
 * Interval.greaterThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // false
 * @example
 * Interval.greaterThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // true
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.greaterThan = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo > y.hi
}

/**
 * Alias for {@link relational.greaterThan}
 * @function
 */
relational.gt = relational.greaterThan

/**
 * Checks if the interval `x` is less or equal than `y` i.e.
 * if all the values of `x` are lower or equal to the left endpoint of `y`
 * @example
 * Interval.lessEqualThan(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // true
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.lessEqualThan = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi <= y.lo
}

/**
 * Alias for {@link relational.lessEqualThan}
 * @function
 */
relational.leq = relational.lessEqualThan

/**
 * Checks if the interval `x` is greater or equal than `y` i.e.
 * if all the values of `x` are greater or equal to the right endpoint of `y`
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.greaterEqualThan = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo >= y.hi
}

/**
 * Alias for {@link relational.greaterEqualThan}
 * @function
 */
relational.geq = relational.greaterEqualThan

module.exports = relational
