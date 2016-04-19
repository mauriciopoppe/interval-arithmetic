/**
 * Created by mauricio on 5/11/15.
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var arithmetic = require('./arithmetic')

/**
 * @mixin misc
 */
var misc = {}

/**
 * Computes e^x where e is the mathematical constant equal to the base of the
 * natural logarithm
 * @example
 * Interval.exp(
 *   Interval(-1, 1)
 * )  // Interval(0.3679, 2.7183)
 * @param {Interval} x
 * @return {Interval}
 */
misc.exp = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(
    rmath.expLo(x.lo),
    rmath.expHi(x.hi)
  )
}

/**
 * Computes the natural logarithm of x
 * @example
 * Interval.log(
 *   Interval(1, Math.exp(3))
 * )  // Interval(0, 3)
 * @param {Interval} x
 * @return {Interval}
 */
misc.log = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  var l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo)
  return Interval(l, rmath.logHi(x.hi))
}

/**
 * Alias for {@link misc.log}
 * @function
 */
misc.ln = misc.log

misc.LOG_EXP_10 = misc.log(Interval(10, 10))

/**
 * Computes the logarithm base 10 of x
 * @example
 * Interval.log10(
 *   Interva(1, 1000)
 * )  // Interval(0, 3)
 * @param {Interval} x
 * @return {Interval}
 */
misc.log10 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_10)
}

misc.LOG_EXP_2 = misc.log(Interval(2, 2))

/**
 * Computes the logarithm base 2 of x
 * @example
 * Interval.log10(
 *   Interva(1, 8)
 * )  // Interval(0, 3)
 * @param {Interval} x
 * @return {Interval}
 */
misc.log2 = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return arithmetic.div(misc.log(x), misc.LOG_EXP_2)
}

/**
 * Computes an interval that has all the values of x and y, note that it may be
 * possible that values that don't belong to either x or y are included in the
 * interval that represents the hull
 *
 * @example
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // Interval(-1, 7)
 * @example
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval.EMPTY
 * )  // Interval(-1, 1)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.hull = function (x, y) {
  var badX = utils.isEmpty(x)
  var badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return Interval(
      Math.min(x.lo, y.lo),
      Math.max(x.hi, y.hi)
    )
  }
}

/**
 * Computes an interval that has all the values that belong to both x and y
 *
 * @example
 * Interval.intersection(
 *   Interval(-1, 1),
 *   Interval(0, 7)
 * )  // Interval(0, 1)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.intersection = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) { return constants.EMPTY }
  var lo = Math.max(x.lo, y.lo)
  var hi = Math.min(x.hi, y.hi)
  if (lo <= hi) {
    return Interval(lo, hi)
  }
  return constants.EMPTY
}

/**
 * Computes an interval that has all the values that belong to both x and y,
 * the difference with {@link misc.hull} is that x and y must overlap to
 * compute the union
 * @example
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // throws error
 * @example
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(1, 7)
 * )  // Interval(-1, 7)
 * @throws {Error} When x and y don't overlap
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.union = function (x, y) {
  if (!utils.intervalsOverlap(x, y)) {
    throw Error('Interval#union: intervals do not overlap')
  }
  return Interval(
    Math.min(x.lo, y.lo),
    Math.max(x.hi, y.hi)
  )
}

/**
 * Computes the difference between `x` and `y`, i.e. an interval with all the
 * values of `x` that are not in `y`
 * @example
 * Interval.difference(
 *   Interval(3, 5),
 *   Interval(4, 6)
 * )  // Interval(3, prev(4))
 * @example
 * Interval.difference(
 *   Interval(0, 3),
 *   Interval(0, 1)
 * )  // Interval(next(1), 3)
 * @example
 * Interval.difference(
 *   Interval(0, 1),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * @example
 * Interval.difference(
 *   Interval(-Infinity, 0),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * @throws {Error} When the difference creates multiple intervals
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.difference = function (x, y) {
  if (utils.isEmpty(x) || utils.isWhole(y)) {
    return constants.EMPTY
  }
  if (utils.intervalsOverlap(x, y)) {
    if (x.lo < y.lo && y.hi < x.hi) {
      // difference creates multiple subsets
      throw Error('Interval.difference: difference creates multiple intervals')
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
      return Interval().halfOpenLeft(y.hi, x.hi)
    }

    // y.hi >= x.hi
    return Interval().halfOpenRight(x.lo, y.lo)
  }
  return Interval.clone(x)
}

/**
 * Computes the distance between the endpoints of the interval i.e.
 * `x.hi - x.lo`
 * @example
 * Interval.width(
 *   Interval(1, 2)
 * )  // 1
 * @example
 * Interval.width(
 *   Interval(-1, 1)
 * )  // 2
 * @example
 * Interval.width(
 *   Interval(1, 1)
 * )  // next(0) ~5e-324
 * @example
 * Interval.width(
 *   Interval.EMPTY
 * )  // 0
 * @param {Interval} x
 * @returns {number}
 */
misc.width = function (x) {
  if (utils.isEmpty(x)) { return 0 }
  return rmath.subHi(x.hi, x.lo)
}

/**
 * Alias for {@link misc.width}
 * @function
 */
misc.wid = misc.width

/**
 * Computes the absolute value of `x`
 * @example
 * Interval.abs(
 *   Interval(2, 3)
 * )  // Interval(2, 3)
 * @example
 * Interval.abs(
 *   Interval(-2, 3)
 * )  // Interval(2, 3)
 * @example
 * Interval.abs(
 *   Interval(-3, -2)
 * )  // Interval(2, 3)
 * @example
 * Interval.abs(
 *   Interval(-3, 2)
 * )  // Interval(0, 3)
 * @param {Interval} x
 * @return {Interval}
 */
misc.abs = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (x.lo >= 0) { return Interval.clone(x) }
  if (x.hi <= 0) { return arithmetic.negative(x) }
  return Interval(0, Math.max(-x.lo, x.hi))
}

/**
 * Computes an interval with the maximum values for each endpoint based on `x`
 * and `y`
 * @example
 * Interval.max(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(1, 3)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.max = function (x, y) {
  var badX = utils.isEmpty(x)
  var badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return Interval(
      Math.max(x.lo, y.lo),
      Math.max(x.hi, y.hi)
    )
  }
}

/**
 * Computes an interval with the minimum values for each endpoint based on `x`
 * and `y`
 * @example
 * Interval.min(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(0, 2)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
misc.min = function (x, y) {
  var badX = utils.isEmpty(x)
  var badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return Interval(
      Math.min(x.lo, y.lo),
      Math.min(x.hi, y.hi)
    )
  }
}

/**
 * Creates an interval equal to `x`, equivalent to `Interval().set(x.lo, x.hi)`
 * @example
 * Interval.clone(
 *   Interval(1, 2)
 * )  // Interval(1, 2)
 * @example
 * Interval.clone(
 *   Interval.EMPTY
 * )  // Interval.EMPTY
 * @param {Interval} x
 * @return {Interval}
 */
misc.clone = function (x) {
  // no bound checking
  return Interval().set(x.lo, x.hi)
}

module.exports = misc
