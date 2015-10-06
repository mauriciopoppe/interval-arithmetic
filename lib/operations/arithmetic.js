/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var constants = require('../constants')
var division = require('./division')

var arithmetic = {}

// BINARY
arithmetic.add = function (a, b) {
  return Interval(
    rmath.addLo(a.lo, b.lo),
    rmath.addHi(a.hi, b.hi)
  )
}

arithmetic.sub = function (a, b) {
  return Interval(
    rmath.subLo(a.lo, b.hi),
    rmath.subHi(a.hi, b.lo)
  )
}

arithmetic.mul = function (a, b) {
  if (utils.isEmpty(a) || utils.isEmpty(b)) {
    return constants.EMPTY
  }
  var al = a.lo
  var ah = a.hi
  var bl = b.lo
  var bh = b.hi
  var out = Interval()
  if (al < 0) {
    if (ah > 0) {
      if (bl < 0) {
        if (bh > 0) {
          // mixed * mixed
          out.lo = Math.min(rmath.mulLo(al, bh), rmath.mulLo(ah, bl))
          out.hi = Math.max(rmath.mulHi(al, bl), rmath.mulHi(ah, bh))
        } else {
          // mixed * negative
          out.lo = rmath.mulLo(ah, bl)
          out.hi = rmath.mulHi(al, bl)
        }
      } else {
        if (bh > 0) {
          // mixed * positive
          out.lo = rmath.mulLo(al, bh)
          out.hi = rmath.mulHi(ah, bh)
        } else {
          // mixed * zero
          out.lo = 0
          out.hi = 0
        }
      }
    } else {
      if (bl < 0) {
        if (bh > 0) {
          // negative * mixed
          out.lo = rmath.mulLo(al, bh)
          out.hi = rmath.mulHi(al, bl)
        } else {
          // negative * negative
          out.lo = rmath.mulLo(ah, bh)
          out.hi = rmath.mulHi(al, bl)
        }
      } else {
        if (bh > 0) {
          // negative * positive
          out.lo = rmath.mulLo(al, bh)
          out.hi = rmath.mulHi(ah, bl)
        } else {
          // negative * zero
          out.lo = 0
          out.hi = 0
        }
      }
    }
  } else {
    if (ah > 0) {
      if (bl < 0) {
        if (bh > 0) {
          // positive * mixed
          out.lo = rmath.mulLo(ah, bl)
          out.hi = rmath.mulHi(ah, bh)
        } else {
          // positive * negative
          out.lo = rmath.mulLo(ah, bl)
          out.hi = rmath.mulHi(al, bh)
        }
      } else {
        if (bh > 0) {
          // positive * positive
          out.lo = rmath.mulLo(al, bl)
          out.hi = rmath.mulHi(ah, bh)
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

arithmetic.div = function (a, b) {
  if (utils.isEmpty(a) || utils.isEmpty(b)) {
    return constants.EMPTY
  }
  if (utils.zeroIn(b)) {
    if (b.lo !== 0) {
      if (b.hi !== 0) {
        return division.zero(a)
      } else {
        return division.negative(a, b.lo)
      }
    } else {
      if (b.hi !== 0) {
        return division.positive(a, b.hi)
      } else {
        return constants.EMPTY
      }
    }
  } else {
    return division.nonZero(a, b)
  }
}

// UNARY
arithmetic.positive = function (a) {
  return Interval(a.lo, a.hi)
}

arithmetic.negative = function (a) {
  return Interval(-a.hi, -a.lo)
}

module.exports = arithmetic
