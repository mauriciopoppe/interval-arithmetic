/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var algebra = require('./algebra')
var arithmetic = require('./arithmetic')

var trigonometric = {}

trigonometric.cos = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }

  // cos works with positive intervals only
  if (x.lo < 0) {
    var mult = Math.ceil(Math.abs(x.lo) / Math.PI)
    x.lo += 2 * Math.PI * mult
    x.hi += 2 * Math.PI * mult
  }

  var pi2 = constants.PI_TWICE
  var t = algebra.fmod(x, pi2)
  if (utils.width(t) >= pi2.lo) {
    return new Interval(-1, 1)
  }
  if (t.lo >= constants.PI_HIGH) {
    var cos = trigonometric.cos(
      arithmetic.sub(t, constants.PI)
    )
    return arithmetic.negative(cos)
  }

  var lo = t.lo
  var hi = t.hi
  if (hi <= constants.PI_LOW) {
    var rlo = rmath.cosLo(hi)
    var rhi = rmath.cosHi(lo)
    return new Interval(rlo, rhi)
  } else if (hi <= pi2.lo) {
    return new Interval(
      -1,
      rmath.cosHi(Math.min(rmath.subLo(pi2.lo, hi), lo))
    )
  } else {
    return new Interval(-1, 1)
  }
}

trigonometric.sin = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return trigonometric.cos(
    arithmetic.sub(x, constants.PI_HALF)
  )
}

trigonometric.tan = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }

  // // tan works with positive intervals only
  if (x.lo < 0) {
    var mult = Math.ceil(Math.abs(x.lo) / Math.PI)
    x.lo += 2 * Math.PI * mult
    x.hi += 2 * Math.PI * mult
  }

  var pi = constants.PI
  var t = algebra.fmod(x, pi)
  if (t.lo >= constants.PI_HALF_LOW) {
    t = arithmetic.sub(t, pi)
  }
  if (t.lo <= -constants.PI_HALF_LOW || t.hi >= constants.PI_HALF_LOW) {
    return constants.WHOLE
  }
  return new Interval(
    rmath.tanLo(t.lo),
    rmath.tanHi(t.hi)
  )
}

trigonometric.asin = function (x) {
  if (utils.empty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.lo <= -1 ? -constants.PI_HALF_HIGH : rmath.asinLo(x.lo)
  var hi = x.hi >= 1 ? constants.PI_HALF_HIGH : rmath.asinHi(x.hi)
  return new Interval(lo, hi)
}

trigonometric.acos = function (x) {
  if (utils.empty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.hi >= 1 ? 0 : rmath.acosLo(x.hi)
  var hi = x.lo <= -1 ? constants.PI_HIGH : rmath.acosHi(x.lo)
  return new Interval(lo, hi)
}

trigonometric.atan = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(rmath.atanLo(x.lo), rmath.atanHi(x.hi))
}

trigonometric.sinh = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(rmath.sinhLo(x.lo), rmath.sinhHi(x.hi))
}

trigonometric.cosh = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  if (x.hi < 0) {
    return new Interval(
      rmath.coshLo(x.hi),
      rmath.coshHi(x.lo)
    )
  } else if (x.lo >= 0) {
    return new Interval(
      rmath.coshLo(x.lo),
      rmath.coshHi(x.hi)
    )
  } else {
    return new Interval(
      1,
      rmath.coshHi(-x.lo > x.hi ? x.lo : x.hi)
    )
  }
}

trigonometric.tanh = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(rmath.tanhLo(x.lo), rmath.tanhHi(x.hi))
}

// TODO: inverse hyperbolic functions (asinh, acosh, atanh)

module.exports = trigonometric
