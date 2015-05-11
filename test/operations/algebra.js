/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var algebra = require('../../lib/operations/algebra');

describe('algebra', function () {
  it('should compute the fmod', function () {
    var r;
    r = algebra.fmod(
      new Interval(5.3, 5.3),
      new Interval(2, 2)
    );
    utils.almostEqual(r, [1.3, 1.3]);
    r = algebra.fmod(
      new Interval(18.5, 18.5),
      new Interval(4.2, 4.2)
    );
    utils.almostEqual(r, [1.7, 1.7]);
    r = algebra.fmod(
      new Interval(-10, -10),
      new Interval(3, 3)
    );
    utils.almostEqual(r, [-1, -1]);
  });

  it('should compute the multiplicative inverse', function () {
    var r;
    r = algebra.multiplicativeInverse(new Interval(1, 1));
    utils.almostEqual(r, [1, 1]);
    r = algebra.multiplicativeInverse(new Interval(2, 6));
    utils.almostEqual(r, [1 / 6, 1 / 2]);
    r = algebra.multiplicativeInverse(new Interval(-6, -2));
    utils.almostEqual(r, [-1 / 2, -1 / 6]);
    r = algebra.multiplicativeInverse(new Interval(-6, 2));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(r.hi === Number.POSITIVE_INFINITY);
    r = algebra.multiplicativeInverse(new Interval(-6, 0));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(Math.abs(r.hi + 1 / 6) < 1e-7);
    r = algebra.multiplicativeInverse(new Interval(0, 2));
    assert(Math.abs(r.lo - 1 / 2) < 1e-7);
    assert(r.hi === Number.POSITIVE_INFINITY);
  });

  it('should compute the integer power of an interval', function () {
    var r;
    r = algebra.pow(new Interval(1, 1), 1);
    utils.almostEqual(r, [1, 1]);
    r = algebra.pow(new Interval(1, 1), 5);
    utils.almostEqual(r, [1, 1]);
    r = algebra.pow(new Interval(1, 5), 2);
    utils.almostEqual(r, [1, 25]);
    r = algebra.pow(new Interval(2, 5), 2);
    utils.almostEqual(r, [4, 25]);
    r = algebra.pow(new Interval(Math.exp(-1), Math.exp(1)), 1);
    utils.almostEqual(r, [0.36787944117, 2.71828182846]);
    r = algebra.pow(new Interval(Math.exp(-1), Math.exp(1)), 3);
    utils.almostEqual(r, [0.04978706836, 20.0855369232]);
  });
});
