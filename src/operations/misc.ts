import { Interval } from '../interval'
import rmath from '../round'
import constants from '../constants'
import * as utils from './utils'
import * as arithmetic from './arithmetic'

/**
 * @mixin misc
 */

/**
 * Computes e^x where e is the mathematical constant equal to the base of the
 * natural logarithm
 *
 * @example
 * ```typescript
 * Interval.exp(
 *   Interval(-1, 1)
 * )  // Interval(0.3679, 2.7183)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function exp(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return new Interval(rmath.expLo(x.lo), rmath.expHi(x.hi))
}

/**
 * Computes the natural logarithm of x
 *
 * @example
 * ```typescript
 * Interval.log(
 *   Interval(1, Math.exp(3))
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function log(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  const l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : rmath.logLo(x.lo)
  return new Interval(l, rmath.logHi(x.hi))
}

/**
 * Alias for {@link log}
 * @function
 */
export const ln = log

export const LOG_EXP_10 = log(new Interval(10, 10))

/**
 * Computes the logarithm base 10 of x
 *
 * @example
 * ```typescript
 * Interval.log10(
 *   Interva(1, 1000)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function log10(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return arithmetic.div(log(x), LOG_EXP_10)
}

export const LOG_EXP_2 = log(new Interval(2, 2))

/**
 * Computes the logarithm base 2 of x
 *
 * @example
 * ```typescript
 * Interval.log10(
 *   Interva(1, 8)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function log2(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  return arithmetic.div(log(x), LOG_EXP_2)
}

/**
 * Computes an interval that has all the values of x and y, note that it may be
 * possible that values that don't belong to either x or y are included in the
 * interval that represents the hull
 *
 * @example
 * ```typescript
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // Interval(-1, 7)
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval.EMPTY
 * )  // Interval(-1, 1)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function hull(x: Interval, y: Interval): Interval {
  const badX = utils.isEmpty(x)
  const badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return new Interval(Math.min(x.lo, y.lo), Math.max(x.hi, y.hi))
  }
}

/**
 * Computes an interval that has all the values that belong to both x and y
 *
 * @example
 * ```typescript
 * Interval.intersection(
 *   Interval(-1, 1),
 *   Interval(0, 7)
 * )  // Interval(0, 1)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function intersection(x: Interval, y: Interval): Interval {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  const lo = Math.max(x.lo, y.lo)
  const hi = Math.min(x.hi, y.hi)
  if (lo <= hi) {
    return new Interval(lo, hi)
  }
  return constants.EMPTY
}

/**
 * Computes an interval that has all the values that belong to both x and y,
 * the difference with {@link hull} is that x and y must overlap to
 * compute the union
 *
 * @example
 * ```typescript
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // throws error
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(1, 7)
 * )  // Interval(-1, 7)
 * ```
 *
 * @throws {Error} When x and y don't overlap
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function union(x: Interval, y: Interval): Interval {
  if (!utils.intervalsOverlap(x, y)) {
    throw Error('Interval#union: intervals do not overlap')
  }
  return new Interval(Math.min(x.lo, y.lo), Math.max(x.hi, y.hi))
}

/**
 * Computes the difference between `x` and `y`, i.e. an interval with all the
 * values of `x` that are not in `y`
 *
 * @example
 * ```typescript
 * Interval.difference(
 *   Interval(3, 5),
 *   Interval(4, 6)
 * )  // Interval(3, prev(4))
 * Interval.difference(
 *   Interval(0, 3),
 *   Interval(0, 1)
 * )  // Interval(next(1), 3)
 * Interval.difference(
 *   Interval(0, 1),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * Interval.difference(
 *   Interval(-Infinity, 0),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * ```
 *
 * @throws {Error} When the difference creates multiple intervals
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function difference(x: Interval, y: Interval): Interval {
  if (utils.isEmpty(x) || utils.isWhole(y)) {
    return constants.EMPTY
  }
  if (utils.intervalsOverlap(x, y)) {
    if (x.lo < y.lo && y.hi < x.hi) {
      // difference creates multiple subsets
      throw Error('Interval.difference: difference creates multiple intervals')
    }

    // handle corner cases first
    if ((y.lo <= x.lo && y.hi === Infinity) || (y.hi >= x.hi && y.lo === -Infinity)) {
      return constants.EMPTY
    }

    // NOTE: empty interval is handled automatically
    // e.g.
    //
    //    n = difference([0,1], [0,1]) // n = Interval(next(1), 1) = EMPTY
    //    isEmpty(n) === true
    //
    if (y.lo <= x.lo) {
      return new Interval().halfOpenLeft(y.hi, x.hi)
    }

    // y.hi >= x.hi
    return new Interval().halfOpenRight(x.lo, y.lo)
  }
  return x.clone()
}

/**
 * Computes the distance between the endpoints of the interval i.e. `x.hi - x.lo`
 *
 * @example
 * ```typescript
 * Interval.width(
 *   Interval(1, 2)
 * )  // 1
 * Interval.width(
 *   Interval(-1, 1)
 * )  // 2
 * Interval.width(
 *   Interval(1, 1)
 * )  // next(0) ~5e-324
 * Interval.width(
 *   Interval.EMPTY
 * )  // 0
 * ```
 *
 * @param {Interval} x
 * @returns {number}
 */
export function width(x: Interval): number {
  if (utils.isEmpty(x)) {
    return 0
  }
  return rmath.subHi(x.hi, x.lo)
}

/**
 * Alias for {@link  width}
 * @function
 */
export const wid = width

/**
 * Computes the absolute value of `x`
 *
 * @example
 * ```typescript
 * Interval.abs(
 *   Interval(2, 3)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-2, 3)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-3, -2)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-3, 2)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function abs(x: Interval): Interval {
  if (utils.isEmpty(x) || utils.isWhole(x)) {
    return constants.EMPTY
  }
  if (x.lo >= 0) {
    return x.clone()
  }
  if (x.hi <= 0) {
    return arithmetic.negative(x)
  }
  return new Interval(0, Math.max(-x.lo, x.hi))
}

/**
 * Computes an interval with the maximum values for each endpoint based on `x`
 * and `y`
 *
 * @example
 * ```typescript
 * Interval.max(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(1, 3)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function max(x: Interval, y: Interval): Interval {
  const badX = utils.isEmpty(x)
  const badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return new Interval(Math.max(x.lo, y.lo), Math.max(x.hi, y.hi))
  }
}

/**
 * Computes an interval with the minimum values for each endpoint based on `x` and `y`
 *
 * @example
 * ```typescript
 * Interval.min(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(0, 2)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function min(x: Interval, y: Interval): Interval {
  const badX = utils.isEmpty(x)
  const badY = utils.isEmpty(y)
  if (badX && badY) {
    return constants.EMPTY
  } else if (badX) {
    return y.clone()
  } else if (badY) {
    return x.clone()
  } else {
    return new Interval(Math.min(x.lo, y.lo), Math.min(x.hi, y.hi))
  }
}

/**
 * Creates an interval equal to `x`, equivalent to `Interval().set(x.lo, x.hi)`
 *
 * @example
 * ```typescript
 * Interval.clone(
 *   Interval(1, 2)
 * )  // Interval(1, 2)
 * Interval.clone(
 *   Interval.EMPTY
 * )  // Interval.EMPTY
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
export function clone(x: Interval): Interval {
  // no bound checking
  return new Interval().set(x.lo, x.hi)
}
