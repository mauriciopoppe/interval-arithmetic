import * as utils from './utils'
import { Interval } from '../interval'

// boost/numeric/interval_lib/compare/certain package on boost

/**
 * @mixin relational
 */

/**
 * Checks if the intervals `x`, `y` are equal, they're equal when
 * `x.lo === y.lo` and `x.hi === y.hi`, a corner case handled is when `x` and
 * `y` are both empty intervals
 *
 * @example
 * ```typescript
 * Interval.equal(
 *   Interval(2, 3),
 *   Interval(2, 3)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.equal(
 *   Interval.EMPTY,
 *   Interval.EMPTY
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
export function equal(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x)) {
    return utils.isEmpty(y)
  }
  return !utils.isEmpty(y) && x.lo === y.lo && x.hi === y.hi
}

// <debug>
const EPS = 1e-7
function assert(a: any, message: string): void {
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!a) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    throw new Error(message || 'assertion failed')
  }
}

function assertEps(a: any, b: any): void {
  if (!isFinite(a)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return assert(a === b, `[Infinity] expected ${a} to be ${b}`)
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  assert(Math.abs(a - b) < EPS, `expected ${a} to be close to ${b}`)
}

export function almostEqual(x, y): void {
  x = Array.isArray(x) ? x : x.toArray()
  y = Array.isArray(y) ? y : y.toArray()
  assertEps(x[0], y[0])
  assertEps(x[1], y[1])
}

export function assertIncludes(x: number[] | Interval, y: number[] | Interval): void {
  // checks that `y` is included in `x` with the bounds close to `x`
  almostEqual(x, y)
  x = Array.isArray(x) ? x : x.toArray()
  y = Array.isArray(y) ? y : y.toArray()
  assert(x[0] <= y[0], `${x[0]} should be less/equal than ${y[0]}`)
  assert(y[1] <= x[1], `${y[1]} should be less/equal than ${x[1]}`)
}
// </debug>

/**
 * Checks if the intervals `x`, `y` are not equal i.e. when the intervals don't
 * share any value
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // false
 * ```
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 4),
 *   Interval(3, 5)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
export function notEqual(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x)) {
    return !utils.isEmpty(y)
  }
  return utils.isEmpty(y) || x.hi < y.lo || x.lo > y.hi
}

/**
 * Checks if the interval `x` is less than `y` i.e. if all the values of `x`
 * are lower than the left endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.lessThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.lessThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
export function lessThan(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi < y.lo
}

/**
 * Alias for {@link lessThan}
 * @function
 */
export const lt = lessThan

/**
 * Checks if the interval `x` is greater than `y` i.e. if all the values of `x`
 * are greater than the right endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.greaterThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // false
 * ```
 *
 * @example
 * ```typescript
 * Interval.greaterThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
export function greaterThan(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo > y.hi
}

/**
 * Alias for {@link greaterThan}
 * @function
 */
export const gt = greaterThan

/**
 * Checks if the interval `x` is less or equal than `y` i.e.
 * if all the values of `x` are lower or equal to the left endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.lessEqualThan(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
export function lessEqualThan(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.hi <= y.lo
}

/**
 * Alias for {@link lessEqualThan}
 * @function
 */
export const leq = lessEqualThan

/**
 * Checks if the interval `x` is greater or equal than `y` i.e.
 * if all the values of `x` are greater or equal to the right endpoint of `y`
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
export function greaterEqualThan(x: Interval, y: Interval): boolean {
  if (utils.isEmpty(x) || utils.isEmpty(y)) {
    return false
  }
  return x.lo >= y.hi
}

/**
 * Alias for {@link greaterEqualThan}
 * @function
 */
export const geq = greaterEqualThan
