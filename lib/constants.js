// Created by mauricio on 5/11/15.
'use strict'
var Interval = require('./interval')
var mutate = require('xtend/mutable')

var piLow = (3373259426.0 + 273688.0 / (1 << 21)) / (1 << 30)
var piHigh = (3373259426.0 + 273689.0 / (1 << 21)) / (1 << 30)

/**
 * @mixin constants
 */
var constants = {}

mutate(constants, {
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
  PI_TWICE_HIGH: piHigh * 2
})

function getter (property, fn) {
  Object.defineProperty(constants, property, {
    get: function () {
      return fn()
    },
    enumerable: true
  })
}

/**
 * An interval that represents PI, NOTE: calls to Interval.PI always return
 * a new interval representing PI
 * @memberof constants
 * @static
 * @example
 * Interval(Interval.PI_LOW, Interval.PI_HIGH)
 * @name PI
 * @type {Interval}
 */
getter('PI', function () {
  return Interval(piLow, piHigh)
})

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
getter('PI_HALF', function () {
  return Interval(constants.PI_HALF_LOW, constants.PI_HALF_HIGH)
})

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
getter('PI_TWICE', function () {
  return Interval(constants.PI_TWICE_LOW, constants.PI_TWICE_HIGH)
})

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
getter('ZERO', function () {
  return Interval(0)
})

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
getter('ONE', function () {
  return Interval(1)
})

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
getter('WHOLE', function () {
  return Interval().setWhole()
})

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
getter('EMPTY', function () {
  return Interval().setEmpty()
})

module.exports = constants
