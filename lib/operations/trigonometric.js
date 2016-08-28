/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var misc = require('./misc')
var algebra = require('./algebra')
var arithmetic = require('./arithmetic')

/**
 * @mixin trigonometric
 */
var trigonometric = {}

// checks if an interval is
//
// - [-Infinity, -Infinity]
// - [Infinity, Infinity]
//
function onlyInfinity (x) {
  return !isFinite(x.lo) && x.lo === x.hi
}

// moves interval 2PI * k to the right until both
// bounds are positive
function handleNegative (interval) {
  if (interval.lo < 0) {
    if (interval.lo === -Infinity) {
      interval.lo = 0
      interval.hi = Infinity
    } else {
      var n = Math.ceil(-interval.lo / constants.PI_TWICE_LOW)
      interval.lo += constants.PI_TWICE_LOW * n
      interval.hi += constants.PI_TWICE_LOW * n
    }
  }
  return interval
}

/**
 * Computes the cosine of `x`
 * @example
 * Interval.cos(
 *   Interval(0, 0)
 * ) // Interval(1, 1)
 * @example
 * Interval.cos(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * @example
 * Interval.cos(
 *   Interval(3 * Math.PI / 2, 3 * Math.PI)
 * ) // Interval(-1, 1)
 * @example
 * Interval.cos(
 *   Interval(-Infinity, x)
 * )
 * // Interval(-1, 1) if x > -Infinity
 * // Interval.EMPTY otherwise
 * @example
 * Interval.cos(
 *   Interval(x, Infinity)
 * )
 * // Interval(-1, 1) if x < Infinity
 * // Interval.EMPTY otherwise
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.cos = function (x) {
  var rlo, rhi
  if (utils.isEmpty(x) || onlyInfinity(x)) { return constants.EMPTY }

  // create a clone of `x` because the clone is going to be modified
  var cache = Interval()
  cache.set(x.lo, x.hi)
  handleNegative(cache)

  var pi2 = constants.PI_TWICE
  var t = algebra.fmod(cache, pi2)
  if (misc.width(t) >= pi2.lo) {
    return Interval(-1, 1)
  }

  // when t.lo > pi it's the same as
  // -cos(t - pi)
  if (t.lo >= constants.PI_HIGH) {
    var cos = trigonometric.cos(
      arithmetic.sub(t, constants.PI)
    )
    return arithmetic.negative(cos)
  }

  var lo = t.lo
  var hi = t.hi
  rlo = rmath.cosLo(hi)
  rhi = rmath.cosHi(lo)
  // it's ensured that t.lo < pi and that t.lo >= 0
  if (hi <= constants.PI_LOW) {
    // when t.hi < pi
    // [cos(t.lo), cos(t.hi)]
    return Interval(rlo, rhi)
  } else if (hi <= pi2.lo) {
    // when t.hi < 2pi
    // [-1, max(cos(t.lo), cos(t.hi))]
    return Interval(-1, Math.max(rlo, rhi))
  } else {
    // t.lo < pi and t.hi > 2pi
    return Interval(-1, 1)
  }
}

/**
 * Computes the sine of `x`
 * @example
 * Interval.sin(
 *   Interval(0, 0)
 * ) // Interval(0, 0)
 * @example
 * Interval.sin(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * @example
 * Interval.sin(
 *   Interval(Math.PI / 2, Math.PI / 2)
 * ) // Interval(1, 1)
 * @example
 * Interval.sin(
 *   Interval(Math.PI / 2, -Math.PI / 2)
 * ) // Interval(-1, 1)
 * @example
 * Interval.sin(
 *   Interval(Math.PI, 3 * Math.PI / 2)
 * ) // Interval(-1, 0)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.sin = function (x) {
  if (utils.isEmpty(x) || onlyInfinity(x)) { return constants.EMPTY }
  return trigonometric.cos(
    arithmetic.sub(x, constants.PI_HALF)
  )
}

/**
 * Computes the tangent of `x`
 * @example
 * Interval.tan(
 *   Interval(-Math.PI / 4, Math.PI / 4)
 * ) // Interval(-1, 1)
 * @example
 * Interval.tan(
 *   Interval(0, Math.PI / 2)
 * ) // Interval.WHOLE
 * @example
 * Interval.tan(
 *   Interval(-Infinity, x)
 * )
 * // Interval.WHOLE if x > -Infinity
 * // Interval.EMPTY othewise
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.tan = function (x) {
  if (utils.isEmpty(x) || onlyInfinity(x)) { return constants.EMPTY }

  // create a clone of `x` because the clone is going to be modified
  var cache = Interval()
  cache.set(x.lo, x.hi)
  handleNegative(cache)

  var pi = constants.PI
  var t = algebra.fmod(cache, pi)
  if (t.lo >= constants.PI_HALF_LOW) {
    t = arithmetic.sub(t, pi)
  }
  if (t.lo <= -constants.PI_HALF_LOW || t.hi >= constants.PI_HALF_LOW) {
    return constants.WHOLE
  }
  return Interval(
    rmath.tanLo(t.lo),
    rmath.tanHi(t.hi)
  )
}

/**
 * Computes the arcsine of `x`
 * @example
 * Interval.asin(
 *   Interval(-1.57079633, 1.57079633)
 * )  // Interval(-10, 10)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.asin = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.lo <= -1 ? -constants.PI_HALF_HIGH : rmath.asinLo(x.lo)
  var hi = x.hi >= 1 ? constants.PI_HALF_HIGH : rmath.asinHi(x.hi)
  return Interval(lo, hi)
}

/**
 * Computes the arccosine of `x`
 * @example
 * Interval.acos(
 *   Interval(0, 1)
 * )  // Interval(0, Math.PI / 2)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.acos = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.hi >= 1 ? 0 : rmath.acosLo(x.hi)
  var hi = x.lo <= -1 ? constants.PI_HIGH : rmath.acosHi(x.lo)
  return Interval(lo, hi)
}

/**
 * Computes the arctangent of `x`
 * @example
 * Interval.atan(
 *   Interval(-1, 1)
 * )  // Interval(-0.785398163, 0.785398163)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.atan = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.atanLo(x.lo), rmath.atanHi(x.hi))
}

/**
 * Computes the hyperbolic sine of `x`
 * @example
 * Interval.sinh(
 *   Interval(-2, 2)
 * )  // Interval(-3.6286040785, 3.6286040785)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.sinh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.sinhLo(x.lo), rmath.sinhHi(x.hi))
}

/**
 * Computes the hyperbolic cosine of `x`
 * @example
 * Interval.cosh(
 *   Interval(-2, 2)
 * )  // Interval(1, 3.76219569108)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.cosh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (x.hi < 0) {
    return Interval(
      rmath.coshLo(x.hi),
      rmath.coshHi(x.lo)
    )
  } else if (x.lo >= 0) {
    return Interval(
      rmath.coshLo(x.lo),
      rmath.coshHi(x.hi)
    )
  } else {
    return Interval(
      1,
      rmath.coshHi(-x.lo > x.hi ? x.lo : x.hi)
    )
  }
}

/**
 * Computes the hyperbolic tangent of `x`
 * @example
 * Interval.tanh(
 *   Interval(-Infinity, Infinity)
 * )  // Interval(-1, 1)
 * @param {Interval} x
 * @return {Interval}
 */
trigonometric.tanh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.tanhLo(x.lo), rmath.tanhHi(x.hi))
}

module.exports = trigonometric
