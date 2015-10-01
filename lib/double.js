/**
 * Created by mauricio on 5/5/15.
 * - Replaced on 1/10/15 for nextafter
 */
'use strict'

var TA = require('typedarray')

function defineFromPolyfill (property) {
  if (!global[property]) {
    global[property] = TA[property]
  }
}
defineFromPolyfill('Uint8Array')
defineFromPolyfill('ArrayBuffer')
defineFromPolyfill('DataView')

// iee754 double has 64 bits
// its binary representation explained in http://bartaz.github.io/ieee754-visualization/
// can be analyzed with the help of ArrayBuffer, since it has no mechanism to update its
// data a DataView is needed (the number is divided in 8 chunks of data each holding 8
// bits)
var buffer = new ArrayBuffer(8)
var dv = new DataView(buffer)
var array8 = new Uint8Array(buffer)

// from https://github.com/bartaz/ieee754-visualization/blob/master/src/ieee754.js
// float64ToOctets( 123.456 ) -> [ 64, 94, 221, 47, 26, 159, 190, 119 ]
function float64ToOctets (number) {
  dv.setFloat64(0, number, false)
  return [].slice.call(new Uint8Array(buffer))
}

// from https://github.com/bartaz/ieee754-visualization/blob/master/src/ieee754.js
// octetsToFloat64( [ 64, 94, 221, 47, 26, 159, 190, 119 ] ) -> 123.456
function octetsToFloat64 (octets) {
  array8.set(octets)
  return dv.getFloat64(0, false)
}

function add (bytes, n) {
  for (var i = 7; i >= 0; i -= 1) {
    bytes[i] += n
    if (bytes[i] === 256) {
      n = 1
      bytes[i] = 0
    } else if (bytes[i] === -1) {
      n = -1
      bytes[i] = 255
    } else {
      n = 0
    }
  }
}

function solve (a, b) {
  if (a === Number.POSITIVE_INFINITY || a === Number.NEGATIVE_INFINITY || isNaN(a)) {
    return a
  }
  var bytes = float64ToOctets(a)
  add(bytes, b)
  return octetsToFloat64(bytes)
}

exports.doubleToOctetArray = float64ToOctets

exports.ieee754NextDouble = function (n) {
  return solve(n, 1)
}

exports.ieee754PrevDouble = function (n) {
  return solve(n, -1)
}
