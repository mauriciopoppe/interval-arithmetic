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
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    rmath.expLo(x.lo),
    rmath.expHi(x.hi)
  )
}

misc.log = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  var l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo)
  return Interval(l, rmath.logHi(x.hi))
}

misc.ln = misc.log

misc.LOG_EXP_10 = misc.log(Interval(10, 10))

misc.log10 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_10)
}

misc.LOG_EXP_2 = misc.log(Interval(2, 2))

misc.log2 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_2)
}

misc.hull = function (x, y) {
  var badX = utils.isEmpty(x)
  var badY = utils.isEmpty(y)
  if (badX) {
    if (badY) {
      return constants.EMPTY
    } else {
      return y.clone()
    }
  } else {
    if (badY) {
      return x.clone()
    } else {
      return Interval(
        Math.min(x.lo, y.lo),
        Math.max(x.hi, y.hi)
      )
    }
  }
}

misc.intersection = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) { return constants.EMPTY }
  var lo = Math.max(x.lo, y.lo)
  var hi = Math.min(x.hi, y.hi)
  if (lo <= hi) {
    return Interval(lo, hi)
  }
  return constants.EMPTY
}

misc.union = function (x, y) {
  if (!utils.intervalsOverlap(x, y)) {
    throw TypeError('Interval.union: intervals do not overlap')
  }
  return Interval(
    Math.min(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

misc.difference = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  if (utils.intervalsOverlap(x, y)) {
    if (x.lo < y.lo && y.hi < x.hi) {
      // difference creates multiple subsets
      throw TypeError('Interval.difference: difference creates multiple intervals')
    }
    if (y.lo < x.lo) {
      return Interval(rmath.next(y.hi), x.hi)
    }
    if (y.hi > x.hi) {
      return Interval(x.lo, rmath.prev(y.lo))
    }
  }
  return Interval.clone(x)
}

/**
 * Computes the distance of the bounds of an interval
 * @param {Interval} x
 * @returns {number}
 */

// Width of an interval (aka diameter)
misc.wid = function (x) {
  if (utils.isEmpty(x)) { return 0 }
  return rmath.subHi(x.hi, x.lo)
}

// Radius of an interval
misc.rad = function (x) {
	return 0.5*misc.wid(x)
}

// Midpoint or center of an interval
misc.mid = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	return 0.5*rmath.addHi(x.lo, x.hi)
}

// Magnitude of an interval
misc.mag = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	return Math.max(Math.abs(x.lo), Math.abs(x.hi))
}

// Mignitude of an interval
// As in: С.П. Шарый Конечномерный интервальный анализ. – Новосибирск: XYZ, 2016, pg. 34
misc.mig = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	if (utils.zeroIn(x))  { return 0 }
	return Math.min(Math.abs(x.lo), Math.abs(x.hi))
}

/** Deprecated. Subtituted with abs(x) below
	misc.abs = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (x.lo >= 0) { return Interval.clone(x) }
  if (x.hi <= 0) { return arithmetic.negative(x) }
  return Interval(0, Math.max(-x.lo, x.hi))
}**/

// Deviance from point zero
// As in: С.П. Шарый Конечномерный интервальный анализ. – Новосибирск: XYZ, 2016, pg. 34
misc.dev = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	if (Math.abs(x.lo) >= Math.abs(x.hi)) { 
		return x.lo 
	} else {
		return x.hi 
	}
}


// Absolute value
// As in Validated Numerics: A Short Introduction to Rigorous Computations, W. Tucker, Princeton University Press (2010)
misc.abs = function (x) {
	if (utils.isEmpty(x)) { return constants.EMPTY }
	return Interval(misc.mig(x), misc.mag(x))
}


misc.max = function (x, y) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    Math.max(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

misc.min = function (x, y) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    Math.min(x.lo, y.lo),
    Math.min(x.hi, y.hi)
  )
}

misc.clone = function (x) {
  // no bound checking
  return Interval().set(x.lo, x.hi)
}

module.exports = misc
