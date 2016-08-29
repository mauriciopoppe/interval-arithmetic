/**
 * Created by mauricio on 5/11/15.
 */
'use strict'

var isSafeInteger = require('is-safe-integer')

var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var arithmetic = require('./arithmetic')
var constants = require('../constants')

/**
 * @mixin algebra
 */
var algebra = {}

/**
 * Computes x mod y (x - k * y)
 * @example
 * Interval.fmod(
 *   Interval(5.3, 5.3),
 *   Interval(2, 2)
 * ) // Interval(1.3, 1.3)
 * @example
 * Interval.fmod(
 *   Interval(5, 7),
 *   Interval(2, 3)
 * ) // Interval(2, 5)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
algebra.fmod = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  var yb = x.lo < 0 ? y.lo : y.hi
  var n = rmath.intLo(rmath.divLo(x.lo, yb))
  // x mod y = x - n * y
  return arithmetic.sub(x, arithmetic.mul(y, Interval(n)))
}

/**
 * Computes 1 / x
 * @example
 * Interval.multiplicativeInverse(
 *   Interval(2, 6)
 * )  // Interval(1/6, 1/2)
 * @example
 * Interval.multiplicativeInverse(
 *   Interval(-6, -2)
 * )  // Interval(-1/2, -1/6)
 * @param {Interval} x
 * @returns {Interval}
 */
algebra.multiplicativeInverse = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (utils.zeroIn(x)) {
    if (x.lo !== 0) {
      if (x.hi !== 0) {
        return constants.WHOLE
      } else {
        return Interval(
          Number.NEGATIVE_INFINITY,
          rmath.divHi(1, x.lo)
        )
      }
    } else {
      if (x.hi !== 0) {
        return Interval(
          rmath.divLo(1, x.hi),
          Number.POSITIVE_INFINITY
        )
      } else {
        return constants.EMPTY
      }
    }
  } else {
    return Interval(
      rmath.divLo(1, x.hi),
      rmath.divHi(1, x.lo)
    )
  }
}

/**
 * Computes x^power given that `power` is an integer
 *
 * If `power` is an Interval it must be a singletonInterval i.e. x^x is not
 * supported yet
 *
 * If `power` is a rational number use {@link arithmetic.nthRoot} instead
 *
 * @example
 * // 2^{-2}
 * Interval.pow(
 *   Interval(2, 2),
 *   -2
 * )  // Interval(1/4, 1/4)
 * @example
 * // [2,3]^2
 * Interval.pow(
 *   Interval(2, 3),
 *   2
 * )  // Interval(4, 9)
 * @example
 * // [2,3]^0
 * Interval.pow(
 *   Interval(2, 3),
 *   0
 * )  // Interval(1, 1)
 * @example
 * // with a singleton interval
 * Interval.pow(
 *   Interval(2, 3),
 *   Interval(2)
 * )  // Interval(4, 9)
 * @param {Interval} x
 * @param {number|Interval} power A number of a singleton interval
 * @returns {Interval}
 */
algebra.pow = function (x, power) {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  if (typeof power === 'object') {
    if (!utils.isSingleton(power)) {
      return constants.EMPTY
    }
    power = power.lo
  }

  if (power === 0) {
    if (x.lo === 0 && x.hi === 0) {
      // 0^0
      return constants.EMPTY
    } else {
      // x^0
      return constants.ONE
    }
  } else if (power < 0) {
    // compute 1 / x^-power if power is negative
    return algebra.multiplicativeInverse(algebra.pow(x, -power))
  }

  // power > 0
  if (isSafeInteger(power)) {
    // power is integer
    if (x.hi < 0) {
      // [negative, negative]
      // assume that power is even so the operation will yield a positive interval
      // if not then just switch the sign and order of the interval bounds
      var yl = rmath.powLo(-x.hi, power)
      var yh = rmath.powHi(-x.lo, power)
      if (power & 1) {
        // odd power
        return Interval(-yh, -yl)
      } else {
        // even power
        return Interval(yl, yh)
      }
    } else if (x.lo < 0) {
      // [negative, positive]
      if (power & 1) {
        return Interval(
          -rmath.powLo(-x.lo, power),
          rmath.powHi(x.hi, power)
        )
      } else {
        // even power means that any negative number will be zero (min value = 0)
        // and the max value will be the max of x.lo^power, x.hi^power
        return Interval(
          0,
          rmath.powHi(Math.max(-x.lo, x.hi), power)
        )
      }
    } else {
      // [positive, positive]
      return Interval(
        rmath.powLo(x.lo, power),
        rmath.powHi(x.hi, power)
      )
    }
  } else {
    console.warn('power is not an integer, you should use nth-root instead, returning an empty interval')
    return constants.EMPTY
  }
}

/**
 * Computes sqrt(x), alias for `nthRoot(x, 2)`
 * @example
 * Interval.sqrt(
 *   Interval(4, 9)
 * ) // Interval(prev(2), next(3))
 * @param {Interval} x
 * @returns {Interval}
 */
algebra.sqrt = function (x) {
  return algebra.nthRoot(x, 2)
}

/**
 * Computes x^(1/n)
 *
 * @example
 * Interval.nthRoot(
 *   Interval(-27, -8),
 *   3
 * ) // Interval(-3, -2)
 * @param {Interval} x
 * @param {number|Interval} n A number or a singleton interval
 * @return {Interval}
 */
algebra.nthRoot = function (x, n) {
  if (utils.isEmpty(x) || n < 0) {
    // compute 1 / x^-power if power is negative
    return constants.EMPTY
  }

  // singleton interval check
  if (typeof n === 'object') {
    if (!utils.isSingleton(n)) {
      return constants.EMPTY
    }
    n = n.lo
  }

  var power = 1 / n
  if (x.hi < 0) {
    // [negative, negative]
    if (isSafeInteger(n) & (n & 1)) {
      // when n is odd we can always take the nth root
      var yl = rmath.powHi(-x.lo, power)
      var yh = rmath.powLo(-x.hi, power)
      return Interval(-yl, -yh)
    }
    // n is not odd therefore there's no nth root
    return Interval.EMPTY
  } else if (x.lo < 0) {
    // [negative, positive]
    var yp = rmath.powHi(x.hi, power)
    if (isSafeInteger(n) & (n & 1)) {
      // nth root of x.lo is possible (n is odd)
      var yn = -rmath.powHi(-x.lo, power)
      return Interval(yn, yp)
    }
    return Interval(0, yp)
  } else {
    // [positive, positive]
    return Interval(
      rmath.powLo(x.lo, power),
      rmath.powHi(x.hi, power)
    )
  }
}

module.exports = algebra
