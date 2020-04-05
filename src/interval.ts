import * as utils from './operations/utils'
import round from './round'

/**
 * Constructor for closed intervals representing all the values inside (and
 * including) `lo` and `hi` e.g. `[lo, hi]`
 *
 * NOTE: If `lo > hi` then the constructor will return an empty interval
 *
 * @class
 * @mixes arithmetic
 * @mixes algebra
 * @mixes misc
 * @mixes relational
 * @mixes trigonometric
 * @mixes utils
 * @mixes constants
 *
 * @see #bounded
 * @see #boundedSingleton
 *
 * @example
 * new Interval(1, 2)  // {lo: 1, hi: 2}
 * @example
 * // function invocation without new is also supported
 * Interval(1, 2)   // {lo: 1, hi: 2}
 * @example
 * // with numbers
 * Interval(1, 2)   // {lo: 1, hi: 2}
 * Interval(1)      // {lo: 1, hi: 1}
 * @example
 * // with an array
 * Interval([1, 2]) // {lo: 1, hi: 2}
 * @example
 * // singleton intervals
 * var x = Interval(1)
 * var y = Interval(2)
 * Interval(x, y)   // {lo: 1, hi: 2}
 * @example
 * // when `lo > hi` it returns an empty interval
 * Interval(2, 1)   // {lo: Infinity, hi: -Infinity}
 * @example
 * // bounded interval
 * Interval().bounded(1, 2)  // { lo: 0.9999999999999999, hi: 2.0000000000000004 }
 * @example
 * // singleton bounded interval
 * Interval().boundedSingleton(2)  // {lo: 1.9999999999999998, hi: 2.0000000000000004}
 * @example
 * // half open and open intervals
 * // [2, 3]
 * Interval(2, 3)                     // {lo: 2, hi: 3}
 * // (2, 3]
 * Interval().halfOpenLeft(2, 3)      // {lo: 2.0000000000000004, hi: 3}
 * // [2, 3)
 * Interval().halfOpenRight(2, 3)     // {lo: 2, hi: 2.9999999999999996}
 * // (2, 3)
 * Interval().open(2, 3)              // {lo: 2.0000000000000004, hi: 2.9999999999999996}
 *
 * @param {number|array|Interval} lo The left endpoint of the interval if it's a
 * number or a singleton interval, if it's an array then an interval will be
 * built out of the elements of the array
 * @param {number|Interval} [hi] The right endpoint of the interval if it's a
 * number or a singleton interval, if omitted then a singleton interval will be
 * built out of `lo`
 */
export class Interval {
  static factory = Interval

  /**
   * The left endpoint of the interval
   * @type {number}
   */
  lo: number

  /**
   * The right endpoint of the interval
   * @type {number}
   */
  hi: number

  constructor(lo?: Interval | number, hi?: Interval | number) {
    if (!(this instanceof Interval)) {
      return new Interval(lo, hi)
    }

    if (typeof lo !== 'undefined' && typeof hi !== 'undefined') {
      // possible cases:
      // - Interval(1, 2)
      // - Interval(Interval(1, 1), Interval(2, 2))     // singletons are required
      if (utils.isInterval(lo)) {
        if (!utils.isSingleton(lo as Interval)) {
          throw new TypeError('Interval: interval `lo` must be a singleton')
        }
        lo = (lo as Interval).lo
      }
      if (utils.isInterval(hi)) {
        if (!utils.isSingleton(hi as Interval)) {
          throw TypeError('Interval: interval `hi` must be a singleton')
        }
        hi = (hi as Interval).hi
      }
    } else if (typeof lo !== 'undefined') {
      // possible cases:
      // - Interval([1, 2])
      // - Interval([Interval(1, 1), Interval(2, 2)])
      if (Array.isArray(lo)) {
        return new Interval(lo[0], lo[1])
      }
      // - Interval(1)
      return new Interval(lo, lo)
    } else {
      // possible cases:
      // - Interval()
      lo = hi = 0
    }
    this.assign(lo as number, hi as number)
  }

  /**
   * Sets `this.lo` and `this.hi` to a single value `v`
   *
   * @param {number} v
   * @return {Interval} The calling interval i.e. `this`
   */
  singleton(v: number): Interval {
    return this.set(v, v)
  }

  /**
   * Sets new endpoints to this interval, the left endpoint is equal to the
   * previous IEEE floating point value of `lo` and the right endpoint
   * is equal to the next IEEE floating point
   * value of `hi`, it's assumed that `lo <= hi`
   * @example
   * var x = Interval().bounded(1, 2)
   * x.lo < 1 // true, x.lo === 0.9999999999999999
   * x.hi > 2 // true, x.hi === 2.0000000000000004
   * @example
   * // the correct representation of 1/3
   * var x = Interval().bounded(1/3, 1/3)
   * x.lo < 1/3 // true
   * x.hi > 1/3 // true
   * // however the floating point representation of 1/3 is less than the real 1/3
   * // therefore the left endpoint could be 1/3 instead of the previous value of
   * var next = Interval.round.safeNext
   * var x = Interval().set(1/3, next(1/3))
   * // x now represents 1/3 correctly
   * @param {number} lo
   * @param {number} hi
   * @return {Interval} The calling interval i.e. `this`
   */
  bounded(lo: number, hi: number): Interval {
    return this.set(round.prev(lo), round.next(hi))
  }

  /**
   * Equivalent to `Interval().bounded(v, v)`
   * @param {number} v
   * @return {Interval} The calling interval i.e. `this`
   */
  boundedSingleton(v: number): Interval {
    return this.bounded(v, v)
  }

  /**
   * Sets new endpoints for this interval, this method bypasses any
   * checks on the type of arguments
   *
   * @param {Number} lo The left endpoint of the interval
   * @param {Number} hi The right endpoint of the interval
   * @return {Interval} The calling interval
   */
  set(lo: number, hi: number): Interval {
    this.lo = lo
    this.hi = hi
    return this
  }

  /**
   * Sets new endpoints for this interval checking that both arguments exist
   * and that are valid numbers, additionally if `lo > hi` the interval is set to
   * an empty interval
   *
   * @param {Number} lo The left endpoint of the interval
   * @param {Number} hi The right endpoint of the interval
   * @return {Interval} The calling interval
   */
  assign(lo: number, hi: number): Interval {
    if (typeof lo !== 'number' || typeof hi !== 'number') {
      throw TypeError('Interval#assign: arguments must be numbers')
    }
    if (isNaN(lo) || isNaN(hi) || lo > hi) {
      return this.setEmpty()
    }
    return this.set(lo, hi)
  }

  /**
   * Sets the endpoints of this interval to `[∞, -∞]` effectively representing
   * no values
   * @return {Interval} The calling interval
   */
  setEmpty(): Interval {
    return this.set(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)
  }

  /**
   * Sets the endpoints of this interval to `[-∞, ∞]` effectively representing all
   * the possible real values
   * @return {Interval} The calling interval
   */
  setWhole(): Interval {
    return this.set(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
  }

  /**
   * Sets the endpoints of this interval to the open interval `(lo, hi)`
   *
   * NOTE: `Interval.round.disable` has no effect on this method
   *
   * @example
   * // (2, 3)
   * Interval().open(2, 3)  // {lo: 2.0000000000000004, hi: 2.9999999999999996}
   * @param {number} lo
   * @param {number} hi
   * @return {Interval} The calling interval
   */
  open(lo: number, hi: number): Interval {
    return this.assign(round.safeNext(lo), round.safePrev(hi))
  }

  /**
   * Sets the endpoints of this interval to the half open interval `(lo, hi]`
   *
   * NOTE: `Interval.round.disable` has no effect on this method
   *
   * @example
   * // (2, 3]
   * Interval().halfOpenLeft(2, 3)  // {lo: 2.0000000000000004, hi: 3}
   * @param {number} lo
   * @param {number} hi
   * @return {Interval} The calling interval
   */
  halfOpenLeft(lo: number, hi: number): Interval {
    return this.assign(round.safeNext(lo), hi)
  }

  /**
   * Sets the endpoints of this interval to the half open interval `[lo, hi)`
   *
   * NOTE: `Interval.round.disable` has no effect on this method
   *
   * @example
   * // [2, 3)
   * Interval.halfOpenRight(2, 3)     // {lo: 2, hi: 2.9999999999999996}
   * @param {number} lo
   * @param {number} hi
   * @return {Interval} The calling interval
   */
  halfOpenRight(lo: number, hi: number): Interval {
    return this.assign(lo, round.safePrev(hi))
  }

  /**
   * Array representation of this interval
   * @return {array}
   */
  toArray(): number[] {
    return [this.lo, this.hi]
  }

  /**
   * Creates an interval equal to the calling one
   * @see Interval.clone
   * @name Interval.prototype
   * @example
   * var x = Interval(2, 3)
   * x.clone()    // Interval(2, 3)
   * @return {Interval}
   */
  clone(): Interval {
    return new Interval().set(this.lo, this.hi)
  }
}
