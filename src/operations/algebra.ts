import { Interval } from '../interval'
import rmath from '../round'
import constants from '../constants'

import * as utils from './utils'
import * as arithmetic from './arithmetic'

/**
 * @mixin algebra
 */

/**
 * Computes `x mod y (x - k * y)`
 *
 * @example
 * ```typescript
 * Interval.fmod(
 *   Interval(5.3, 5.3),
 *   Interval(2, 2)
 * ) // Interval(1.3, 1.3)
 * Interval.fmod(
 *   Interval(5, 7),
 *   Interval(2, 3)
 * ) // Interval(2, 5)
 * // explanation: [5, 7] - [2, 3] * 1 = [2, 5]
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
export function fmod(x: Interval, y: Interval): Interval {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return constants.EMPTY
  }
  const yb = x.lo < 0 ? y.lo : y.hi
  let n = x.lo / yb
  if (n < 0) n = Math.ceil(n)
  else n = Math.floor(n)
  // x mod y = x - n * y
  return arithmetic.sub(x, arithmetic.mul(y, new Interval(n)))
}

/**
 * Computes `1 / x`
 *
 * @example
 * ```typescript
 * Interval.multiplicativeInverse(
 *   Interval(2, 6)
 * )  // Interval(1/6, 1/2)
 * Interval.multiplicativeInverse(
 *   Interval(-6, -2)
 * )  // Interval(-1/2, -1/6)
 * ```
 *
 * @param {Interval} x
 * @returns {Interval}
 */
export function multiplicativeInverse(x: Interval): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  if (utils.zeroIn(x)) {
    if (x.lo !== 0) {
      if (x.hi !== 0) {
        // [negative, positive]
        return constants.WHOLE
      } else {
        // [negative, zero]
        return new Interval(Number.NEGATIVE_INFINITY, rmath.divHi(1, x.lo))
      }
    } else {
      if (x.hi !== 0) {
        // [zero, positive]
        return new Interval(rmath.divLo(1, x.hi), Number.POSITIVE_INFINITY)
      } else {
        // [zero, zero]
        return constants.EMPTY
      }
    }
  } else {
    // [positive, positive]
    return new Interval(rmath.divLo(1, x.hi), rmath.divHi(1, x.lo))
  }
}

/**
 * Computes `x^power` given that `power` is an integer
 *
 * If `power` is an Interval it must be a singletonInterval i.e. `x^x` is not
 * supported yet
 *
 * If `power` is a rational number use {@link nthRoot} instead
 *
 * @example
 * ```typescript
 * // 2^{-2}
 * Interval.pow(
 *   Interval(2, 2),
 *   -2
 * )  // Interval(1/4, 1/4)
 * // [2,3]^2
 * Interval.pow(
 *   Interval(2, 3),
 *   2
 * )  // Interval(4, 9)
 * // [2,3]^0
 * Interval.pow(
 *   Interval(2, 3),
 *   0
 * )  // Interval(1, 1)
 * // with a singleton interval
 * Interval.pow(
 *   Interval(2, 3),
 *   Interval(2)
 * )  // Interval(4, 9)
 * ```
 *
 * @param {Interval} x
 * @param {number|Interval} power A number of a singleton interval
 * @returns {Interval}
 */
export function pow(x: Interval, power: Interval | number): Interval {
  if (utils.isEmpty(x)) {
    return constants.EMPTY
  }
  if (typeof power === 'object') {
    if (!utils.isSingleton(power)) {
      return constants.EMPTY
    }
    power = power.lo
  }

  if (power === 0) {
    if (x.lo === 0 && x.hi === 0) {
      // 0^0
      return constants.EMPTY
    } else {
      // x^0
      return constants.ONE
    }
  } else if (power < 0) {
    // compute [1 / x]^-power if power is negative
    return pow(multiplicativeInverse(x), -power)
  }

  // power > 0
  if (Number.isSafeInteger(power) as boolean) {
    // power is integer
    if (x.hi < 0) {
      // [negative, negative]
      // assume that power is even so the operation will yield a positive interval
      // if not then just switch the sign and order of the interval bounds
      const yl = rmath.powLo(-x.hi, power)
      const yh = rmath.powHi(-x.lo, power)
      if ((power & 1) === 1) {
        // odd power
        return new Interval(-yh, -yl)
      } else {
        // even power
        return new Interval(yl, yh)
      }
    } else if (x.lo < 0) {
      // [negative, positive]
      if ((power & 1) === 1) {
        return new Interval(-rmath.powLo(-x.lo, power), rmath.powHi(x.hi, power))
      } else {
        // even power means that any negative number will be zero (min value = 0)
        // and the max value will be the max of x.lo^power, x.hi^power
        return new Interval(0, rmath.powHi(Math.max(-x.lo, x.hi), power))
      }
    } else {
      // [positive, positive]
      return new Interval(rmath.powLo(x.lo, power), rmath.powHi(x.hi, power))
    }
  } else {
    console.warn('power is not an integer, you should use nth-root instead, returning an empty interval')
    return constants.EMPTY
  }
}

/**
 * Computes `sqrt(x)`, alias for `nthRoot(x, 2)`
 *
 * @example
 * ```typescript
 * Interval.sqrt(
 *   Interval(4, 9)
 * ) // Interval(prev(2), next(3))
 * ```
 *
 * @param {Interval} x
 * @returns {Interval}
 */
export function sqrt(x: Interval): Interval {
  return nthRoot(x, 2)
}

/**
 * Computes `x^(1/n)`
 *
 * @example
 * ```typescript
 * Interval.nthRoot(
 *   Interval(-27, -8),
 *   3
 * ) // Interval(-3, -2)
 * ```
 *
 * @param {Interval} x
 * @param {number|Interval} n A number or a singleton interval
 * @return {Interval}
 */
export function nthRoot(x: Interval, n: Interval | number): Interval {
  if (utils.isEmpty(x) || n < 0) {
    // compute 1 / x^-power if power is negative
    return constants.EMPTY
  }

  // singleton interval check
  if (typeof n === 'object') {
    if (!utils.isSingleton(n)) {
      return constants.EMPTY
    }
    n = n.lo
  }

  const power = 1 / n
  if (x.hi < 0) {
    // [negative, negative]
    if ((Number.isSafeInteger(n) as boolean) && (n & 1) === 1) {
      // when n is odd we can always take the nth root
      const yl = rmath.powHi(-x.lo, power)
      const yh = rmath.powLo(-x.hi, power)
      return new Interval(-yl, -yh)
    }
    // n is not odd therefore there's no nth root
    return constants.EMPTY
  } else if (x.lo < 0) {
    // [negative, positive]
    const yp = rmath.powHi(x.hi, power)
    if ((Number.isSafeInteger(n) as boolean) && (n & 1) === 1) {
      // nth root of x.lo is possible (n is odd)
      const yn = -rmath.powHi(-x.lo, power)
      return new Interval(yn, yp)
    }
    return new Interval(0, yp)
  } else {
    // [positive, positive]
    return new Interval(rmath.powLo(x.lo, power), rmath.powHi(x.hi, power))
  }
}
