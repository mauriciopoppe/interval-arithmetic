/**
 * Created by mauricio on 5/11/15.
 * Updated by MiLia on 18/04/16
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var arithmetic = require('./arithmetic')

var misc = {}

/**
 * Computes the exponential of an interval.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.exp = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    rmath.expLo(x.lo),
    rmath.expHi(x.hi)
  )
}

/**
 * Computes the natural logarithm of an interval.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.log = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  var l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo)
  return Interval(l, rmath.logHi(x.hi))
}

misc.ln = misc.log

/**
 * Computes the logarithm of base 10 of an interval.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.LOG_EXP_10 = misc.log(Interval(10, 10))
misc.log10 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_10)
}


/**
 * Computes the logarithm of base 2 of an interval.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.LOG_EXP_2 = misc.log(Interval(2, 2))
misc.log2 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_2)
}

/**
 * Computes the hull of two intervals.
 * @param {Interval} x, {Interval} y
 * @returns {Interval}
 */
misc.hull = function (x, y) {
  var badX = utils.isEmpty(x)
  var badY = utils.isEmpty(y)
  if (badX) {
    if (badY) {
      return constants.EMPTY
    } 
	else {
      return y.clone()
    }
  } 
  else if (badY) {    
      return x.clone()
  } 
  else {
      return Interval(
        Math.min(x.lo, y.lo),
        Math.max(x.hi, y.hi)
      )
  }
}


/**
 * Computes the intersection of two intervals.
 * @param {Interval} x, {Interval} y
 * @returns {Interval}
 */
misc.intersection = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) { return constants.EMPTY }
  var lo = Math.max(x.lo, y.lo)
  var hi = Math.min(x.hi, y.hi)
  	if (lo <= hi) { return Interval(lo, hi) }
  	if (lo > hi) {return Interval(hi,lo) }
  return constants.EMPTY
}

/**
 * Computes the union of two intervals.
 * @param {Interval} x, {Interval} y
 * @returns {Interval}
 */
misc.union = function (x, y) {
  if (!utils.intervalsOverlap(x, y)) {
    throw TypeError('Interval.union: intervals do not overlap')
  }
  return Interval(
    Math.min(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

/**
 * Computes the difference between two intervals.
 * @param {Interval} x, {Interval} y
 * @returns {Interval}
 */
misc.difference = function (x, y) {
  if (utils.isEmpty(x) || utils.isWhole(y)) {
    return constants.EMPTY
  }
  if (utils.intervalsOverlap(x, y)) {
    if (x.lo < y.lo && y.hi < x.hi) {
      // difference creates multiple subsets
      throw TypeError('Interval.difference: difference creates multiple intervals')
    }

    // handle corner cases first
    if ((y.lo <= x.lo && y.hi === Infinity) ||
        (y.hi >= x.hi && y.lo === -Infinity)) {
      return constants.EMPTY
    }

    // NOTE: empty interval is handled automatically
    // e.g.
    //
    //    n = difference([0,1], [0,1]) // n = Interval(next(1), 1) = EMPTY
    //    isEmpty(n) === true
    //
    if (y.lo <= x.lo) {
      return Interval(rmath.next(y.hi), x.hi)
    }

    // y.hi >= x.hi
    return Interval(x.lo, rmath.prev(y.lo))
  }
  return Interval.clone(x)
}

/**
 * Computes the width of the interval. Also known as diameter. 
 * @param {Interval} x
 * @returns {number}
 */
misc.wid = function (x) {
  if (utils.isEmpty(x)) { return 0 }
  return rmath.subHi(x.hi, x.lo)
}

/**
 * Computes the radius of the interval.
 * @param {Interval} x
 * @returns {number}
 */
misc.rad = function (x) {
	return 0.5*misc.wid(x)
}

/**
 * Computes the midpoint or center of an interval.
 * @param {Interval} x
 * @returns {number}
 */
misc.mid = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	return 0.5*rmath.addHi(x.lo, x.hi)
}

/**
 * Computes the magnitude of an interval.
 * @param {Interval} x
 * @returns {number}
 */
misc.mag = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	return Math.max(Math.abs(x.lo), Math.abs(x.hi))
}

/**
 * Computes the mignitude of an interval.
 * @param {Interval} x
 * @returns {number}
 *
 * As in: С.П. Шарый Конечномерный интервальный анализ. – Новосибирск: XYZ, 2016, pg. 34
 */
misc.mig = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	if (utils.zeroIn(x))  { return 0 }
	return Math.min(Math.abs(x.lo), Math.abs(x.hi))
}

/**
 * Computes the deviance from point zero.
 * @param {Interval} x
 * @returns {number}
 *
 * As in: С.П. Шарый Конечномерный интервальный анализ. – Новосибирск: XYZ, 2016, pg. 34
 */
misc.dev = function (x) {
	if (utils.isEmpty(x)) { return 0 }
	if (Math.abs(x.lo) >= Math.abs(x.hi)) { 
		return x.lo 
	} else {
		return x.hi 
	}
}

/**
 * Computes the absolute value.
 * @param {Interval} x
 * @returns {Interval}
 *
 * As in Validated Numerics: A Short Introduction to Rigorous Computations, 
 * 							W. Tucker, Princeton University Press (2010)
 */
misc.abs = function (x) {
	if (utils.isEmpty(x)) { return constants.EMPTY }
	return Interval(misc.mig(x), misc.mag(x))
}

/**
 * Computes the maximum of two intervals.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.max = function (x, y) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    Math.max(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

/**
 * Computes the minimum of two intervals.
 * @param {Interval} x
 * @returns {Interval}
 */
misc.min = function (x, y) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    Math.min(x.lo, y.lo),
    Math.min(x.hi, y.hi)
  )
}

/**
 * Creates an identical interval to x
 * @param {Interval} x
 * @returns {Interval}
 */
misc.clone = function (x) {
  // no bound checking
  return Interval().set(x.lo, x.hi)
}

module.exports = misc
