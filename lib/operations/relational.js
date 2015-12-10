/**
 * Created by mauricio on 5/14/15.
 */
'use strict'
var utils = require('./utils')

// boost/numeric/interval_lib/compare/certain
// certain package in boost
var relational = {}

/**
 * Checks if the intervals `x`, `y` are equal
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
 * Checks if the intervals `x`, `y` are not equal
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
 * Checks if the interval x is less than y
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.lt = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi < y.lo
}

/**
 * Checks if the interval x is greater than y
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.gt = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo > y.hi
}

/**
 * Checks if the interval x is less or equal than y
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.leq = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi <= y.lo
}

/**
 * Checks if the interval x is greater or equal than y
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
relational.geq = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo >= y.hi
}

module.exports = relational
