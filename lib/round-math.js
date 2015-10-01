/**
 * Created by mauricio on 4/27/15.
 */
'use strict'
var nextafter = require('nextafter')

function identity (v) { return v }
function prev (v) {
  if (v === Infinity) {
    return v
  }
  return nextafter(v, -Infinity)
}
function next (v) {
  if (v === -Infinity) {
    return v
  }
  return nextafter(v, Infinity)
}

var round = {
  prev: prev,
  next: next
}

round.addLo = function (x, y) { return this.prev(x + y) }
round.addHi = function (x, y) { return this.next(x + y) }

round.subLo = function (x, y) { return this.prev(x - y) }
round.subHi = function (x, y) { return this.next(x - y) }

round.mulLo = function (x, y) { return this.prev(x * y) }
round.mulHi = function (x, y) { return this.next(x * y) }

round.divLo = function (x, y) { return this.prev(x / y) }
round.divHi = function (x, y) { return this.next(x / y) }

function toInteger (x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x)
}

round.intLo = function (x) { return toInteger(this.prev(x)) }
round.intHi = function (x) { return toInteger(this.next(x)) }

round.logLo = function (x) { return this.prev(Math.log(x)) }
round.logHi = function (x) { return this.next(Math.log(x)) }

round.expLo = function (x) { return this.prev(Math.exp(x)) }
round.expHi = function (x) { return this.next(Math.exp(x)) }

round.sinLo = function (x) { return this.prev(Math.sin(x)) }
round.sinHi = function (x) { return this.next(Math.sin(x)) }

round.cosLo = function (x) { return this.prev(Math.cos(x)) }
round.cosHi = function (x) { return this.next(Math.cos(x)) }

round.tanLo = function (x) { return this.prev(Math.tan(x)) }
round.tanHi = function (x) { return this.next(Math.tan(x)) }

round.asinLo = function (x) { return this.prev(Math.asin(x)) }
round.asinHi = function (x) { return this.next(Math.asin(x)) }

round.acosLo = function (x) { return this.prev(Math.acos(x)) }
round.acosHi = function (x) { return this.next(Math.acos(x)) }

round.atanLo = function (x) { return this.prev(Math.atan(x)) }
round.atanHi = function (x) { return this.next(Math.atan(x)) }

// polyfill required for hyperbolic functions
round.sinhLo = function (x) { return this.prev(Math.sinh(x)) }
round.sinhHi = function (x) { return this.next(Math.sinh(x)) }

round.coshLo = function (x) { return this.prev(Math.cosh(x)) }
round.coshHi = function (x) { return this.next(Math.cosh(x)) }

round.tanhLo = function (x) { return this.prev(Math.tanh(x)) }
round.tanhHi = function (x) { return this.next(Math.tanh(x)) }

/**
 * ln(power) exponentiation of x
 * @param {number} x
 * @param {number} power
 * @returns {number}
 */
round.powLo = function (x, power) {
  if (power % 1 !== 0) {
    // power has decimals
    return this.prev(Math.pow(x, power))
  }

  var y = (power & 1) ? x : 1
  power >>= 1
  while (power > 0) {
    x = round.mulLo(x, x)
    if (power & 1) {
      y = round.mulLo(x, y)
    }
    power >>= 1
  }
  return y
}

/**
 * ln(power) exponentiation of x
 * @param {number} x
 * @param {number} power
 * @returns {number}
 */
round.powHi = function (x, power) {
  if (power % 1 !== 0) {
    // power has decimals
    return this.next(Math.pow(x, power))
  }

  var y = (power & 1) ? x : 1
  power >>= 1
  while (power > 0) {
    x = round.mulHi(x, x)
    if (power & 1) {
      y = round.mulHi(x, y)
    }
    power >>= 1
  }
  return y
}

round.sqrtLo = function (x) { return this.prev(Math.sqrt(x)) }
round.sqrtHi = function (x) { return this.next(Math.sqrt(x)) }

round.disable = function () {
  this.next = this.prev = identity
}

round.enable = function () {
  this.next = next
  this.prev = prev
}

module.exports = round
