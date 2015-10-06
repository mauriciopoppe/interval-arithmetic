/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var constants = require('../constants')

var division = {
  /**
   * Division between intervals when `y` doesn't contain zero
   * @param {Interval} x
   * @param {Interval} y
   * @returns {Interval}
   */
  nonZero: function (x, y) {
    var xl = x.lo
    var xh = x.hi
    var yl = y.lo
    var yh = y.hi
    var out = Interval()
    if (xh < 0) {
      if (yh < 0) {
        out.lo = rmath.divLo(xh, yl)
        out.hi = rmath.divHi(xl, yh)
      } else {
        out.lo = rmath.divLo(xl, yl)
        out.hi = rmath.divHi(xh, yh)
      }
    } else if (xl < 0) {
      if (yh < 0) {
        out.lo = rmath.divLo(xh, yh)
        out.hi = rmath.divHi(xl, yh)
      } else {
        out.lo = rmath.divLo(xl, yl)
        out.hi = rmath.divHi(xh, yl)
      }
    } else {
      if (yh < 0) {
        out.lo = rmath.divLo(xh, yh)
        out.hi = rmath.divHi(xl, yl)
      } else {
        out.lo = rmath.divLo(xl, yh)
        out.hi = rmath.divHi(xh, yl)
      }
    }
    return out
  },

  /**
   * Division between an interval and a positive constant
   * @param {Interval} x
   * @param {number} v
   * @returns {Interval}
   */
  positive: function (x, v) {
    if (x.lo === 0 && x.hi === 0) {
      return x
    }

    if (utils.zeroIn(x)) {
      // mixed considering zero in both ends
      return constants.WHOLE
    }

    if (x.hi < 0) {
      // negative / v
      return Interval(
        Number.NEGATIVE_INFINITY,
        rmath.divHi(x.hi, v)
      )
    } else {
      // positive / v
      return Interval(
        rmath.divLo(x.lo, v),
        Number.POSITIVE_INFINITY
      )
    }
  },

  /**
   * Division between an interval and a negative constant
   * @param {Interval} x
   * @param {number} v
   * @returns {Interval}
   */
  negative: function (x, v) {
    if (x.lo === 0 && x.hi === 0) {
      return x
    }

    if (utils.zeroIn(x)) {
      // mixed considering zero in both ends
      return constants.WHOLE
    }

    if (x.hi < 0) {
      // negative / v
      return Interval(
        rmath.divLo(x.hi, v),
        Number.POSITIVE_INFINITY
      )
    } else {
      // positive / v
      return Interval(
        Number.NEGATIVE_INFINITY,
        rmath.divHi(x.lo, v)
      )
    }
  },

  /**
   * Division between an interval and zero
   * @param {Interval} x
   * @returns {Interval}
   */
  zero: function (x) {
    if (x.lo === 0 && x.hi === 0) {
      return x
    }
    return constants.WHOLE
  }
}

module.exports = division
