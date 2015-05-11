/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');
var bigInteger = require('big-integer');

var double = require('../lib/double');

var EPS = 1e-7;

function assertEps(a, b) {
  assert( Math.abs(a - b) < EPS );
}

describe('double', function () {
  it('should compute the binary representation of a double', function () {
    assert(double.doubleToLongBits(1)
      .equals(bigInteger('3ff0000000000000', 16)));
    assert(double.doubleToLongBits(-1)
      .equals(bigInteger('bff0000000000000', 16)));
    assert(double.doubleToLongBits(1.1)
      .equals(bigInteger('3ff199999999999a', 16)));
    assert(double.doubleToLongBits(NaN)
      .equals(bigInteger('7ff8000000000000', 16)));
  });

  it('should get the next ieee754 double precision number', function () {
    var next = double.ieee754NextDouble(1);
    assertEps(1, next);
    assert(1 < next);
    var inf;
    inf = double.ieee754NextDouble(Number.POSITIVE_INFINITY);
    assert(inf === Number.POSITIVE_INFINITY);
    inf = double.ieee754NextDouble(Number.NEGATIVE_INFINITY);
    assert(inf === Number.NEGATIVE_INFINITY);
  });

  it('should get the previous ieee754 double precision number', function () {
    var prev = double.ieee754PrevDouble(1);
    assertEps(1, prev);
    assert(1 > prev);
    var inf;
    inf = double.ieee754PrevDouble(Number.POSITIVE_INFINITY);
    assert(inf === Number.POSITIVE_INFINITY);
    inf = double.ieee754PrevDouble(Number.NEGATIVE_INFINITY);
    assert(inf === Number.NEGATIVE_INFINITY);
  });

  it('should work for zero', function () {
    var next = double.ieee754NextDouble(0);
    assertEps(0, next);
    assert(0 < next);
    assert(next === Number.MIN_VALUE);
  });
});
