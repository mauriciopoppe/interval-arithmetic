/**
 * Created by mauricio on 5/11/15.
 */
'use strict'
var Interval = require('./interval')

var piLow = (3373259426.0 + 273688.0 / (1 << 21)) / (1 << 30)
var piHigh = (3373259426.0 + 273689.0 / (1 << 21)) / (1 << 30)

var constants = {}

constants.PI_LOW = piLow
constants.PI_HIGH = piHigh
constants.PI_HALF_LOW = piLow / 2
constants.PI_HALF_HIGH = piHigh / 2
constants.PI_TWICE_LOW = piLow * 2
constants.PI_TWICE_HIGH = piHigh * 2

function getter (property, fn) {
  Object.defineProperty(constants, property, {
    get: function () {
      return fn()
    },
    enumerable: true
  })
}

// intervals
getter('PI', function () {
  return Interval(piLow, piHigh)
})
getter('PI_HALF', function () {
  return Interval(constants.PI_HALF_LOW, constants.PI_HALF_HIGH)
})
getter('PI_TWICE', function () {
  return Interval(constants.PI_TWICE_LOW, constants.PI_TWICE_HIGH)
})
getter('ZERO', function () {
  return Interval(0)
})
getter('ONE', function () {
  return Interval(1)
})
getter('WHOLE', function () {
  return Interval().setWhole()
})
getter('EMPTY', function () {
  return Interval().setEmpty()
})

module.exports = constants
