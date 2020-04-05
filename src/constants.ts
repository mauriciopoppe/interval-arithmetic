import { Interval } from './interval'

const piLow = (3373259426.0 + 273688.0 / (1 << 21)) / (1 << 30)
const piHigh = (3373259426.0 + 273689.0 / (1 << 21)) / (1 << 30)

/**
 * @mixin constants
 */
const constants = {
  /**
   * Previous IEEE floating point value of PI (equal to Math.PI)
   * 3.141592653589793
   * @memberof constants
   * @type {number}
   */
  PI_LOW: piLow,
  /**
   * Next IEEE floating point value of PI, 3.1415926535897936
   * @memberof constants
   * @type {number}
   */
  PI_HIGH: piHigh,
  PI_HALF_LOW: piLow / 2,
  PI_HALF_HIGH: piHigh / 2,
  PI_TWICE_LOW: piLow * 2,
  PI_TWICE_HIGH: piHigh * 2,

  /**
   * An interval that represents PI, NOTE: calls to Interval.PI always return
   * a new interval representing PI
   * @memberof constants
   * @static
   * @example
   * ```typescript
   * Interval(Interval.PI_LOW, Interval.PI_HIGH)
   * ```
   * @name PI
   * @type {Interval}
   */
  get PI(): Interval {
    return new Interval(piLow, piHigh)
  },

  /**
   * An interval that represents PI / 2, NOTE: calls to Interval.PI_HALF always
   * return a new interval representing PI / 2
   * @memberof constants
   * @static
   * @example
   * Interval(Interval.PI_LOW / 2, Interval.PI_HIGH / 2)
   * @name PI_HALF
   * @type {Interval}
   */
  get PI_HALF(): Interval {
    return new Interval(constants.PI_HALF_LOW, constants.PI_HALF_HIGH)
  },

  /**
   * An interval that represents PI * 2, NOTE: calls to Interval.PI_TWICE always
   * return a new interval representing PI * 2
   * @memberof constants
   * @static
   * @example
   * Interval(Interval.PI_LOW * 2, Interval.PI_HIGH * 2)
   * @name PI_TWICE
   * @type {Interval}
   */
  get PI_TWICE(): Interval {
    return new Interval(constants.PI_TWICE_LOW, constants.PI_TWICE_HIGH)
  },

  /**
   * An interval that represents 0, NOTE: calls to Interval.ZERO always
   * return a new interval representing 0
   * @memberof constants
   * @static
   * @example
   * // Interval.ZERO is equivalent to
   * Interval(0)
   * @name ZERO
   * @type {Interval}
   */
  get ZERO(): Interval {
    return new Interval(0)
  },

  /**
   * An interval that represents 1, NOTE: calls to Interval.ONE always
   * return a new interval representing 1
   * @memberof constants
   * @static
   * @example
   * // Interval.ONE is equivalent to
   * Interval(1)
   * @name ONE
   * @type {Interval}
   */
  get ONE(): Interval {
    return new Interval(1)
  },

  /**
   * An interval that represents all the real values
   * NOTE: calls to Interval.WHOLE always return a new interval representing all
   * the real values
   * @memberof constants
   * @static
   * @example
   * // Interval.WHOLE is equivalent to
   * Interval().setWhole()
   * @name WHOLE
   * @type {Interval}
   */
  get WHOLE(): Interval {
    return new Interval().setWhole()
  },

  /**
   * An interval that represents no values
   * NOTE: calls to Interval.EMPTY always return a new interval representing no
   * values
   * @memberof constants
   * @static
   * @example
   * // Interval.EMPTY is equivalent to
   * Interval().setEmpty()
   * @name EMPTY
   * @type {Interval}
   */
  get EMPTY(): Interval {
    return new Interval().setEmpty()
  }
}

export default constants
