import { Interval } from '../interval'

/**
 * @mixin utils
 */

/**
 * Checks if `x` is an interval, `x` is an interval if it's an object which has
 * `x.lo` and `x.hi` defined and both are numbers
 * @example
 * Interval.isInterval(
 *   Interval()
 * ) // true
 * @example
 * Interval.isInterval(
 *   undefined
 * ) // false
 * @example
 * Interval.isInterval(
 *   {lo: 1, hi: 2}
 * ) // true
 * @param  {*} x
 * @return {boolean} true if `x` is an interval
 */
export function isInterval(x: any): boolean {
  return typeof x === 'object' && typeof x.lo === 'number' && typeof x.hi === 'number'
}

/**
 * Checks if `x` is empty, it's empty when `x.lo > x.hi`
 * @example
 * Interval.isEmpty(
 *   Interval.EMPTY
 * ) // true
 * @example
 * Interval.isEmpty(
 *   Interval.WHOLE
 * ) // false
 * @example
 * Interval.isEmpty(
 *   // bypass empty interval check
 *   Interval().set(1, -1)
 * ) // true
 * @param {Interval} i
 * @returns {boolean}
 */
export function isEmpty(i: Interval): boolean {
  return i.lo > i.hi
}

/**
 * Checks if an interval is a whole interval, that is an interval which covers
 * all the real numbers i.e. when `x.lo === -Infinity` and `x.hi === Infinity`
 * @example
 * Interval.isWhole(
 *   Interval.WHOLE
 * ) // true
 * @param {Interval} i
 * @returns {boolean}
 */
export function isWhole(i: Interval): boolean {
  return i.lo === -Infinity && i.hi === Infinity
}

/**
 * Checks if the intervals `x` is a singleton (an interval representing a single
 * value) i.e. when `x.lo === x.hi`
 * @example
 * Interval.isSingleton(
 *  Interval(2, 2)
 * ) // true
 * @example
 * Interval.isSingleton(
 *  Interval(2)
 * ) // true
 * @param {Interval} i
 * @returns {boolean}
 */
export function isSingleton(i: Interval): boolean {
  return i.lo === i.hi
}

/**
 * Checks if zero is included in the interval `x`
 * @example
 * Interval.zeroIn(
 *   Interval(-1, 1)
 * ) // true
 * @param {Interval} i
 * @returns {boolean}
 */
export function zeroIn(i: Interval): boolean {
  return hasValue(i, 0)
}

/**
 * Checks if `value` is included in the interval `x`
 * @example
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   0
 * ) // true
 * @example
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   10
 * ) // false
 * @param {Interval} i
 * @param {number} value
 * @returns {boolean}
 */
export function hasValue(i: Interval, value: number): boolean {
  if (isEmpty(i)) {
    return false
  }
  return i.lo <= value && value <= i.hi
}

/**
 * Checks if `x` is a subset of `y`
 * @example
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * @example
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 4)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
export function hasInterval(x: Interval, y: Interval): boolean {
  if (isEmpty(x)) {
    return true
  }
  return !isEmpty(y) && y.lo <= x.lo && x.hi <= y.hi
}

/**
 * Checks if the intervals `x`, `y` overlap i.e. if they share at least one
 * value
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(1, 3)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(2, 3)
 * ) // true
 * @example
 * Interval.intervalsOverlap(
 *   Interval(0, 1),
 *   Interval(2, 3)
 * ) // false
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
export function intervalsOverlap(x: Interval, y: Interval): boolean {
  if (isEmpty(x) || isEmpty(y)) {
    return false
  }
  return (x.lo <= y.lo && y.lo <= x.hi) || (y.lo <= x.lo && x.lo <= y.hi)
}
