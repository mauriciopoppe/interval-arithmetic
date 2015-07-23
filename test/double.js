/**
 * Created by mauricio on 5/10/15.
 */
'use strict'

var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it

var assert = require('assert')

var double = require('../lib/double')

var EPS = 1e-7

function assertEps (a, b) {
  assert(Math.abs(a - b) < EPS)
}

function hex2 (a, b) {
  return parseInt(a, 16) * 16 + parseInt(b, 16)
}

function octetAssert (a, str) {
  // b is a hex string
  var b = []
  var i
  for (i = 0; i < str.length; i += 2) {
    b.push(hex2(str[i], str[i + 1]))
  }
  for (i = 0; i < 8; i += 1) {
    assert(a[i] === b[i])
  }
}

describe('double', function () {
  it('should compute the binary representation of a double', function () {
    octetAssert(
      double.doubleToOctetArray(1),
      '3ff0000000000000'
    )
    octetAssert(
      double.doubleToOctetArray(-1),
      'bff0000000000000'
    )
    octetAssert(
      double.doubleToOctetArray(1.1),
      '3ff199999999999a'
    )
    octetAssert(
      double.doubleToOctetArray(NaN),
      '7ff8000000000000'
    )
    octetAssert(
      double.doubleToOctetArray(Infinity),
      '7ff0000000000000'
    )
    octetAssert(
      double.doubleToOctetArray(3.9999999999999996),
      '400fffffffffffff'
    )
  })

  it('should get the next ieee754 double precision number', function () {
    var next = double.ieee754NextDouble(1)
    assertEps(1, next)
    assert(next > 1)
    var inf
    inf = double.ieee754NextDouble(Number.POSITIVE_INFINITY)
    assert(inf === Number.POSITIVE_INFINITY)
    inf = double.ieee754NextDouble(Number.NEGATIVE_INFINITY)
    assert(inf === Number.NEGATIVE_INFINITY)
    var n = double.ieee754NextDouble(3.9999999999999996)
    assert(n === 4)
  })

  it('should get the previous ieee754 double precision number', function () {
    var prev = double.ieee754PrevDouble(1)
    assertEps(1, prev)
    assert(prev < 1)
    var inf
    inf = double.ieee754PrevDouble(Number.POSITIVE_INFINITY)
    assert(inf === Number.POSITIVE_INFINITY)
    inf = double.ieee754PrevDouble(Number.NEGATIVE_INFINITY)
    assert(inf === Number.NEGATIVE_INFINITY)
    var n = double.ieee754PrevDouble(4.000000000000001)
    assert(n === 4)
  })

  it('should work for zero', function () {
    var next = double.ieee754NextDouble(0)
    assertEps(0, next)
    assert(next > 0)
    assert(next === Number.MIN_VALUE)
  })
})
