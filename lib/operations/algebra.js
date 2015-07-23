/**
 * Created by mauricio on 5/11/15.
 */
'use strict'
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var arithmetic = require('./arithmetic')
var constants = require('../constants')

var algebra = {}

/**
 * Computes x mod y
 * @param x
 * @param y
 */
algebra.fmod = function (x, y) {
  if (utils.empty(x) || utils.empty(y)) {
    return constants.EMPTY
  }
  var yb = x.lo < 0 ? y.lo : y.hi
  var n = rmath.intLo(rmath.divLo(x.lo, yb))
  // x mod y = x - n * y
  return arithmetic.sub(x, arithmetic.mul(y, new Interval(n, n)))
}

/**
 * Computes 1 / x
 * @param {Interval} x
 * @returns {Interval}
 */
algebra.multiplicativeInverse = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  if (utils.zeroIn(x)) {
    if (x.lo !== 0) {
      if (x.hi !== 0) {
        return constants.WHOLE
      } else {
        return new Interval(
          Number.NEGATIVE_INFINITY,
          rmath.divHi(1, x.lo)
        )
      }
    } else {
      if (x.hi !== 0) {
        return new Interval(
          rmath.divLo(1, x.hi),
          Number.POSITIVE_INFINITY
        )
      } else {
        return constants.EMPTY
      }
    }
  } else {
    return new Interval(
      rmath.divLo(1, x.hi),
      rmath.divHi(1, x.lo)
    )
  }
}

/**
 * Computes x^power
 * @param {Interval} x
 * @param {number|Interval} power An integer power or a singleton interval
 * @returns {Interval}
 */
algebra.pow = function (x, power) {
  if (utils.empty(x)) {
    return constants.EMPTY
  }
  if (typeof power === 'object') {
    if (!utils.singleton(power)) {
      return constants.EMPTY
    }
    power = power.lo
  }

  if (power === 0) {
    if (x.lo === 0 && x.hi === 0) {
      return constants.EMPTY
    } else {
      return constants.ONE
    }
  } else if (power < 0) {
    // compute 1 / x^-power if power is negative
    return algebra.multiplicativeInverse(algebra.pow(x, -power))
  }

  // power > 0
  if (x.hi < 0) {
    // [negative, negative]
    // assume that power is even so the operation will yield a positive interval
    // if not then just switch the sign and order of the interval bounds
    var yl = rmath.powLo(-x.hi, power)
    var yh = rmath.powHi(-x.lo, power)
    if (power & 1) {
      return new Interval(-yh, -yl)
    } else {
      return new Interval(yl, yh)
    }
  } else if (x.lo < 0) {
    // [negative, positive]
    if (power & 1) {
      return new Interval(
        -rmath.powLo(-x.lo, power),
        rmath.powHi(x.hi, power)
      )
    } else {
      // even power means that any negative number will be zero (min value = 0)
      // and the max value will be the max of x.lo^power, x.hi^power
      return new Interval(
        0,
        rmath.powHi(Math.max(-x.lo, x.hi), power)
      )
    }
  } else {
    // [positive, positive]
    return new Interval(
      rmath.powLo(x.lo, power),
      rmath.powHi(x.hi, power)
    )
  }
}

/**
 * Computes sqrt(x)
 * @param {Interval} x
 * @returns {Interval}
 */
algebra.sqrt = function (x) {
  if (utils.empty(x) || x.hi < 0) {
    return constants.EMPTY
  }
  // lower bound min value can't be negative
  var t = x.lo <= 0 ? 0 : rmath.sqrtLo(x.lo)
  return new Interval(t, rmath.sqrtHi(x.hi))
}

// TODO: root finding

module.exports = algebra
