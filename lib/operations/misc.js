/**
 * Created by mauricio on 5/11/15.
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var arithmetic = require('./arithmetic')

var misc = {}

misc.exp = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(
    rmath.expLo(x.lo),
    rmath.expHi(x.hi)
  )
}

misc.log = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  var l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo)
  return new Interval(l, rmath.logHi(x.hi))
}

misc.ln = misc.log

misc.LOG_EXP_10 = misc.log(new Interval(10, 10))

misc.log10 = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_10)
}

misc.LOG_EXP_2 = misc.log(new Interval(2, 2))

misc.log2 = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_2)
}

// elementary
misc.hull = function (x, y) {
  var badX = utils.empty(x)
  var badY = utils.empty(y)
  if (badX) {
    if (badY) { return constants.EMPTY } else { return y }
  } else {
    if (badY) { return x } else {
      return new Interval(
        Math.min(x.lo, y.lo),
        Math.max(x.hi, y.hi)
      )
    }
  }
}

misc.intersect = function (x, y) {
  if (utils.empty(x) || utils.empty(y)) { return constants.EMPTY }
  var lo = Math.max(x.lo, y.lo)
  var hi = Math.min(x.hi, y.hi)
  if (lo <= hi) {
    return new Interval(lo, hi)
  }
  return constants.EMPTY
}

misc.abs = function (x) {
  if (utils.empty(x)) { return constants.EMPTY }
  if (x.lo >= 0) { return x }
  if (x.hi <= 0) { return arithmetic.negative(x) }
  return new Interval(0, Math.max(-x.lo, x.hi))
}

misc.max = function (x, y) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(
    Math.max(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

misc.min = function (x, y) {
  if (utils.empty(x)) { return constants.EMPTY }
  return new Interval(
    Math.min(x.lo, y.lo),
    Math.min(x.hi, y.hi)
  )
}

misc.clone = function (x) {
  // no bound checking
  return new Interval().set(x.lo, x.hi)
}

module.exports = misc
