// Created by mauricio on 5/10/15.

'use strict'
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var constants = require('../constants')
var division = require('./division')

/**
 * @mixin arithmetic
 */
var arithmetic = {}

/**
 * Adds two intervals
 * @example
 * Interval.add(
 *   Interval(0, 1),
 *   Interval(1, 2),
 * )   // Interval(prev(1), next(3))
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
arithmetic.add = function (x, y) {
  return Interval(
    rmath.addLo(x.lo, y.lo),
    rmath.addHi(x.hi, y.hi)
  )
}

/**
 * Subtracts two intervals
 * @example
 * Interval.subtract(
 *   Interval(0, 1),
 *   Interval(1, 2),
 * )   // Interval(prev(-2), next(0))
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
arithmetic.subtract = function (x, y) {
  return Interval(
    rmath.subLo(x.lo, y.hi),
    rmath.subHi(x.hi, y.lo)
  )
}

/**
 * Alias for {@link arithmetic.subtract}
 * @function
 */
arithmetic.sub = arithmetic.subtract

/**
 * Multiplies two intervals, an explanation of all the possible cases ca
 * be found on [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
 * @example
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(2, 3)
 * ) // Interval(prev(2), next(6))
 * @example
 * Interval.multiply(
 *  Interval(1, Infinity),
 *  Interval(4, 6)
 * ) // Interval(prev(4), Infinity)
 * @example
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(-3, -2)
 * ) // Interval(prev(-6), next(-2))
 * @example
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(-2, 3)
 * ) // Interval(prev(-4), next(6))
 * @example
 * Interval.multiply(
 *  Interval(-2, -1),
 *  Interval(-3, -2)
 * ) // Interval(prev(2), next(6))
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
arithmetic.multiply = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  var xl = x.lo
  var xh = x.hi
  var yl = y.lo
  var yh = y.hi
  var out = Interval()
  if (xl < 0) {
    if (xh > 0) {
      if (yl < 0) {
        if (yh > 0) {
          // mixed * mixed
          out.lo = Math.min(rmath.mulLo(xl, yh), rmath.mulLo(xh, yl))
          out.hi = Math.max(rmath.mulHi(xl, yl), rmath.mulHi(xh, yh))
        } else {
          // mixed * negative
          out.lo = rmath.mulLo(xh, yl)
          out.hi = rmath.mulHi(xl, yl)
        }
      } else {
        if (yh > 0) {
          // mixed * positive
          out.lo = rmath.mulLo(xl, yh)
          out.hi = rmath.mulHi(xh, yh)
        } else {
          // mixed * zero
          out.lo = 0
          out.hi = 0
        }
      }
    } else {
      if (yl < 0) {
        if (yh > 0) {
          // negative * mixed
          out.lo = rmath.mulLo(xl, yh)
          out.hi = rmath.mulHi(xl, yl)
        } else {
          // negative * negative
          out.lo = rmath.mulLo(xh, yh)
          out.hi = rmath.mulHi(xl, yl)
        }
      } else {
        if (yh > 0) {
          // negative * positive
          out.lo = rmath.mulLo(xl, yh)
          out.hi = rmath.mulHi(xh, yl)
        } else {
          // negative * zero
          out.lo = 0
          out.hi = 0
        }
      }
    }
  } else {
    if (xh > 0) {
      if (yl < 0) {
        if (yh > 0) {
          // positive * mixed
          out.lo = rmath.mulLo(xh, yl)
          out.hi = rmath.mulHi(xh, yh)
        } else {
          // positive * negative
          out.lo = rmath.mulLo(xh, yl)
          out.hi = rmath.mulHi(xl, yh)
        }
      } else {
        if (yh > 0) {
          // positive * positive
          out.lo = rmath.mulLo(xl, yl)
          out.hi = rmath.mulHi(xh, yh)
        } else {
          // positive * zero
          out.lo = 0
          out.hi = 0
        }
      }
    } else {
      // zero * any other value
      out.lo = 0
      out.hi = 0
    }
  }
  return out
}

/**
 * Alias for {@link arithmetic.multiply}
 * @function
 */
arithmetic.mul = arithmetic.multiply

/**
 * Computes x/y, an explanation of all the possible cases ca
 * be found on [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
 *
 * NOTE: an extreme case of division might results in multiple
 * intervals, unfortunately this library doesn't support multi-interval
 * arithmetic yet so a single interval will be returned instead with
 * the {@link misc.hull} of the resulting intervals (this is the way
 * Boost implements it too)
 *
 * @example
 * Interval.divide(
 *   Interval(1, 2),
 *   Interval(3, 4)
 * ) // Interval(prev(1/4), next(2/3))
 * @example
 * Interval.divide(
 *   Interval(-2, 1),
 *   Interval(-4, -3)
 * ) // Interval(prev(-1/3), next(2/3))
 * @example
 * Interval.divide(
 *   Interval(1, 2),
 *   Interval(-1, 1)
 * ) // Interval(-Infinity, Infinity)
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
arithmetic.divide = function (x, y) {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  if (utils.zeroIn(y)) {
    if (y.lo !== 0) {
      if (y.hi !== 0) {
        return division.zero(x)
      } else {
        return division.negative(x, y.lo)
      }
    } else {
      if (y.hi !== 0) {
        return division.positive(x, y.hi)
      } else {
        return constants.EMPTY
      }
    }
  } else {
    return division.nonZero(x, y)
  }
}

/**
 * Alias for {@link arithmetic.divide}
 * @function
 */
arithmetic.div = arithmetic.divide

/**
 * Computes +x (identity function)
 * @see misc.clone
 * @example
 * Interval.positive(
 *  Interval(1, 2)
 * )  // Interval(1, 2)
 * @param {Interval} x
 * @return {Interval}
 */
arithmetic.positive = function (x) {
  return Interval(x.lo, x.hi)
}

/**
 * Computes -x
 * @example
 * Interval.negative(
 *   Interval(1, 2)
 * )  // Interval(-2, -1)
 * @example
 * Interval.negative(
 *   Interval(-Infinity, Infinity)
 * )  // Interval(-Infinity, Infinity)
 * @example
 * Interval.negative(
 *   Interval.WHOLE
 * )  // Interval.WHOLE
 * @param {Interval} x
 * @return {Interval}
 */
arithmetic.negative = function (x) {
  return Interval(-x.hi, -x.lo)
}

module.exports = arithmetic
