/**
 * Created by mauricio on 5/10/15.
 */
'use strict'

var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it

var assert = require('assert')

var Interval = require('../')

describe('library structure', function () {
  it('should expose the Interval constructors', function () {
    assert(typeof Interval === 'function')
  })

  it('should expose utilities', function () {
    assert(Interval.rmath)
    assert(Interval.double)
  })

  it('should expose interval constants', function () {
    assert(Interval.PI)
    assert(Interval.PI_HALF)
  })

  it('should expose interval operators', function () {
    assert(Interval.add)
    assert(Interval.fmod)
    assert(Interval.exp)
    assert(Interval.cos)
  })

  it('should expose interval utilities', function () {
    assert(Interval.empty)
  })
})
