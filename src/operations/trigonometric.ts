'use strict'
import { Interval } from '../interval'
import rmath from '../round'
import constants from '../constants'

import * as utils from './utils'
import * as arithmetic from './arithmetic'
import * as algebra from './algebra'
import * as misc from './misc'

/**
 * @mixin trigonometric
 */

/**
 * Checks if an interval is
 * - [-Infinity, -Infinity]
 * - [Infinity, Infinity]
 * @param {Interval} x
 * @returns {boolean}
 */
function onlyInfinity(x: Interval): boolean {
  return !isFinite(x.lo) && x.lo === x.hi
}

/**
 * moves interval 2PI * k to the right until both bounds are positive
 * @param interval
 */
function handleNegative(interval: Interval): Interval {
  if (interval.lo < 0) {
    if (interval.lo === -Infinity) {
      interval.lo = 0
      interval.hi = Infinity
    } else {
      const n = Math.ceil(-interval.lo / constants.PI_TWICE_LOW)
      interval.lo += constants.PI_TWICE_LOW * n
      interval.hi += constants.PI_TWICE_LOW * n
    }
  }
  return interval
}

/**
 * Computes the cosine of `x`
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(0, 0)
 * ) // Interval(1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(3 * Math.PI / 2, 3 * Math.PI)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(-Infinity, x)
 * )
 * // Interval(-1, 1) if x > -Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(x, Infinity)
 * )
 * // Interval(-1, 1) if x < Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function cos(x: Interval): Interval {
  if (utils.isEmpty(x) || onlyInfinity(x)) {
    return constants.EMPTY
  }

  // create a clone of `x` because the clone is going to be modified
  const cache = new Interval().set(x.lo, x.hi)
  handleNegative(cache)

  const pi2 = constants.PI_TWICE
  const t = algebra.fmod(cache, pi2)
  if (misc.width(t) >= pi2.lo) {
    return new Interval(-1, 1)
  }

  // when t.lo > pi it's the same as
  // -cos(t - pi)
  if (t.lo >= constants.PI_HIGH) {
    const cosv = cos(arithmetic.sub(t, constants.PI))
    return arithmetic.negative(cosv)
  }

  const lo = t.lo
  const hi = t.hi
  const rlo = rmath.cosLo(hi)
  const rhi = rmath.cosHi(lo)
  // it's ensured that t.lo < pi and that t.lo >= 0
  if (hi <= constants.PI_LOW) {
    // when t.hi < pi
    // [cos(t.lo), cos(t.hi)]
    return new Interval(rlo, rhi)
  } else if (hi <= pi2.lo) {
    // when t.hi < 2pi
    // [-1, max(cos(t.lo), cos(t.hi))]
    return new Interval(-1, Math.max(rlo, rhi))
  } else {
    // t.lo < pi and t.hi > 2pi
    return new Interval(-1, 1)
  }
}

/**
 * Computes the sine of `x`
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(0, 0)
 * ) // Interval(0, 0)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI / 2, Math.PI / 2)
 * ) // Interval(1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI / 2, -Math.PI / 2)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI, 3 * Math.PI / 2)
 * ) // Interval(-1, 0)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function sin(x: Interval): Interval {
  if (utils.isEmpty(x) || onlyInfinity(x)) {
    return constants.EMPTY
  }
  return cos(arithmetic.sub(x, constants.PI_HALF))
}

/**
 * Computes the tangent of `x`
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(-Math.PI / 4, Math.PI / 4)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(0, Math.PI / 2)
 * ) // Interval.WHOLE
 * ```
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(-Infinity, x)
 * )
 * // Interval.WHOLE if x > -Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function tan(x: Interval): Interval {
  if (utils.isEmpty(x) || onlyInfinity(x)) {
    return constants.EMPTY
  }

  // create a clone of `x` because the clone is going to be modified
  const cache = new Interval().set(x.lo, x.hi)
  handleNegative(cache)

  const pi = constants.PI
  let t = algebra.fmod(cache, pi)
  if (t.lo >= constants.PI_HALF_LOW) {
    t = arithmetic.sub(t, pi)
  }
  if (t.lo <= -constants.PI_HALF_LOW || t.hi >= constants.PI_HALF_LOW) {
    return constants.WHOLE
  }
  return new Interval(rmath.tanLo(t.lo), rmath.tanHi(t.hi))
}

/**
 * Computes the arcsine of `x`
 *
 * @example
 * ```typescript
 * Interval.asin(
 *   Interval(-1.57079633, 1.57079633)
 * )  // Interval(-10, 10)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function asin(x: Interval): Interval {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  const lo = x.lo <= -1 ? -constants.PI_HALF_HIGH : rmath.asinLo(x.lo)
  const hi = x.hi >= 1 ? constants.PI_HALF_HIGH : rmath.asinHi(x.hi)
  return new Interval(lo, hi)
}

/**
 * Computes the arccosine of `x`
 *
 * @example
 * ```typescript
 * Interval.acos(
 *   Interval(0, 1)
 * )  // Interval(0, Math.PI / 2)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function acos(x: Interval): Interval {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  const lo = x.hi >= 1 ? 0 : rmath.acosLo(x.hi)
  const hi = x.lo <= -1 ? constants.PI_HIGH : rmath.acosHi(x.lo)
  return new Interval(lo, hi)
}

/**
 * Computes the arctangent of `x`
 *
 * @example
 * ```typescript
 * Interval.atan(
 *   Interval(-1, 1)
 * )  // Interval(-0.785398163, 0.785398163)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function atan(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return new Interval(rmath.atanLo(x.lo), rmath.atanHi(x.hi))
}

/**
 * Computes the hyperbolic sine of `x`
 *
 * @example
 * ```typescript
 * Interval.sinh(
 *   Interval(-2, 2)
 * )  // Interval(-3.6286040785, 3.6286040785)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function sinh(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return new Interval(rmath.sinhLo(x.lo), rmath.sinhHi(x.hi))
}

/**
 * Computes the hyperbolic cosine of `x`
 *
 * @example
 * ```typescript
 * Interval.cosh(
 *   Interval(-2, 2)
 * )  // Interval(1, 3.76219569108)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function cosh(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  if (x.hi < 0) {
    return new Interval(rmath.coshLo(x.hi), rmath.coshHi(x.lo))
  } else if (x.lo >= 0) {
    return new Interval(rmath.coshLo(x.lo), rmath.coshHi(x.hi))
  } else {
    return new Interval(1, rmath.coshHi(-x.lo > x.hi ? x.lo : x.hi))
  }
}

/**
 * Computes the hyperbolic tangent of `x`
 *
 * @example
 * ```typescript
 * Interval.tanh(
 *   Interval(-Infinity, Infinity)
 * )  // Interval(-1, 1)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function tanh(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return new Interval(rmath.tanhLo(x.lo), rmath.tanhHi(x.hi))
}
