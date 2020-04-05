import { Interval } from '../interval'
import rmath from '../round'
import * as utils from './utils'
import constants from '../constants'

/**
 * Division between intervals when `y` doesn't contain zero
 * @param {Interval} x
 * @param {Interval} y
 * @returns {Interval}
 */
export function nonZero(x: Interval, y: Interval): Interval {
  const xl = x.lo
  const xh = x.hi
  const yl = y.lo
  const yh = y.hi
  const out = new Interval()
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
}

/**
 * Division between an interval and a positive constant
 * @param {Interval} x
 * @param {number} v
 * @returns {Interval}
 */
export function positive(x: Interval, v: number): Interval {
  if (x.lo === 0 && x.hi === 0) {
    return x
  }

  if (utils.zeroIn(x)) {
    // mixed considering zero in both ends
    return constants.WHOLE
  }

  if (x.hi < 0) {
    // negative / v
    return new Interval(Number.NEGATIVE_INFINITY, rmath.divHi(x.hi, v))
  } else {
    // positive / v
    return new Interval(rmath.divLo(x.lo, v), Number.POSITIVE_INFINITY)
  }
}

/**
 * Division between an interval and a negative constant
 * @param {Interval} x
 * @param {number} v
 * @returns {Interval}
 */
export function negative(x: Interval, v: number): Interval {
  if (x.lo === 0 && x.hi === 0) {
    return x
  }

  if (utils.zeroIn(x)) {
    // mixed considering zero in both ends
    return constants.WHOLE
  }

  if (x.hi < 0) {
    // negative / v
    return new Interval(rmath.divLo(x.hi, v), Number.POSITIVE_INFINITY)
  } else {
    // positive / v
    return new Interval(Number.NEGATIVE_INFINITY, rmath.divHi(x.lo, v))
  }
}

/**
 * Division between an interval and zero
 * @param {Interval} x
 * @returns {Interval}
 */
export function zero(x: Interval): Interval {
  if (x.lo === 0 && x.hi === 0) {
    return x
  }
  return constants.WHOLE
}
