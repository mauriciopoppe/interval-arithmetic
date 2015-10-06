/**
 * Created by mauricio on 5/10/15.
 */
'use strict'

var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it

var assert = require('assert')

var Interval = require('../../')
var misc = require('../../lib/operations/misc')
var constants = require('../../lib/constants')

describe('misc', function () {
  var n
  it('should compute the exponent function', function () {
    n = misc.exp(new Interval(-1, 1))
    Interval.almostEqual(n, [0.36787944117, 2.71828182846])
    n = misc.exp(new Interval(-3, 3))
    Interval.almostEqual(n, [0.04978706836, 20.0855369232])
  })

  it('should compute the logarithmic function (base exp)', function () {
    n = misc.log(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = misc.log(new Interval(1, Math.exp(3)))
    Interval.almostEqual(n, [0, 3])
  })

  it('should compute the logarithmic function (base 10)', function () {
    n = misc.log10(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = misc.log10(new Interval(1, 10))
    Interval.almostEqual(n, [0, 1])
    n = misc.log10(new Interval(1, 100))
    Interval.almostEqual(n, [0, 2])
  })

  it('should compute the logarithmic function (base 2)', function () {
    n = misc.log2(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = misc.log2(new Interval(1, 2))
    Interval.almostEqual(n, [0, 1])
    n = misc.log2(new Interval(1, 8))
    Interval.almostEqual(n, [0, 3])
  })

  it('should compute the hull of two intervals', function () {
    n = misc.hull(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [-1, 7])
    n = misc.hull(new Interval(-1, 1), constants.EMPTY)
    Interval.almostEqual(n, [-1, 1])
    n = misc.hull(constants.EMPTY, new Interval(-1, 1))
    Interval.almostEqual(n, [-1, 1])
    n = misc.hull(constants.EMPTY, constants.EMPTY)
    assert(Interval.isEmpty(n))
  })

  it('should compute the intersection of two intervals', function () {
    n = misc.intersection(new Interval(-1, 1), new Interval(5, 7))
    assert(Interval.isEmpty(n))
    n = misc.intersection(new Interval(-1, 1), constants.EMPTY)
    assert(Interval.isEmpty(n))
    n = misc.intersection(new Interval(-1, 1), new Interval(0, 7))
    Interval.almostEqual(n, [0, 1])
  })

  it('should compute the union of two intervals', function () {
    n = misc.union(
      Interval(1, 3),
      Interval(2, 4)
    )
    Interval.almostEqual(n, [1, 4])

    assert.throws(function () {
      misc.union(
        Interval(1, 2),
        Interval(3, 4)
      )
    })
  })

  it('should compute the difference between two intervals', function () {
    n = misc.difference(
      Interval(3, 5),
      Interval(4, 6)
    )
    Interval.almostEqual(n, [3, 4])
    n = misc.difference(
      Interval(4, 6),
      Interval(3, 5)
    )
    Interval.almostEqual(n, [5, 6])
    n = misc.difference(
      Interval(4, 6),
      Interval(8, 9)
    )
    Interval.almostEqual(n, [4, 6])

    assert.throws(function () {
      misc.difference(
        Interval(1, 4),
        Interval(2, 3)
      )
    })
  })

  it('should compute the abs value of an interval', function () {
    n = misc.abs(new Interval(-1, 1))
    Interval.almostEqual(n, [0, 1])
    n = misc.abs(new Interval(-3, -2))
    Interval.almostEqual(n, [2, 3])
    n = misc.abs(new Interval(2, 3))
    Interval.almostEqual(n, [2, 3])
  })

  it('should compute the max value of two intervals', function () {
    n = misc.max(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [5, 7])
  })

  it('should compute the min value of two intervals', function () {
    n = misc.min(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [-1, 1])
  })

  it('should clone an interval', function () {
    var x = new Interval(0, 1)
    Interval.equal(Interval.clone(x), x)
  })

  it('should compute complex operations', function () {
    var x = new Interval(0, 1)
    var res = Interval.add(
      Interval.sin(Interval.exp(x)),
      Interval.sub(
        Interval.tan(x),
        Interval.mul(
          Interval.div(Interval.ONE, Interval.cos(Interval.PI)),
          Interval.pow(new Interval(1, 3), 2)
        )
      )
    )
    Interval.almostEqual(res, [1.4107812905029047, 11.557407724654915])

    x = new Interval(-1, -1)
    res = Interval.mul(Interval.sqrt(x), x)
    assert(Interval.isEmpty(Interval.sqrt(x)))
    assert(Interval.isEmpty(res))
  })
})
