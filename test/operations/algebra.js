/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var algebra = require('../../lib/operations/algebra');
var constants = require('../../lib/constants');
var n;

describe('algebra', function () {
  it('should compute the fmod', function () {
    n = algebra.fmod(
      new Interval(5.3, 5.3),
      new Interval(2, 2)
    );
    utils.almostEqual(n, [1.3, 1.3]);
    n = algebra.fmod(
      new Interval(18.5, 18.5),
      new Interval(4.2, 4.2)
    );
    utils.almostEqual(n, [1.7, 1.7]);
    n = algebra.fmod(
      new Interval(-10, -10),
      new Interval(3, 3)
    );
    utils.almostEqual(n, [-1, -1]);
    n = algebra.fmod(new Interval(), constants.EMPTY);
    assert(utils.empty(n));
  });

  it('should compute the multiplicative inverse', function () {
    n = algebra.multiplicativeInverse(new Interval(1, 1));
    utils.almostEqual(n, [1, 1]);
    n = algebra.multiplicativeInverse(new Interval(2, 6));
    utils.almostEqual(n, [1 / 6, 1 / 2]);
    n = algebra.multiplicativeInverse(new Interval(-6, -2));
    utils.almostEqual(n, [-1 / 2, -1 / 6]);
    n = algebra.multiplicativeInverse(new Interval(-6, 2));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(n.hi === Number.POSITIVE_INFINITY);
    n = algebra.multiplicativeInverse(new Interval(-6, 0));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(Math.abs(n.hi + 1 / 6) < 1e-7);
    n = algebra.multiplicativeInverse(new Interval(0, 2));
    assert(Math.abs(n.lo - 1 / 2) < 1e-7);
    assert(n.hi === Number.POSITIVE_INFINITY);
    n = algebra.multiplicativeInverse(constants.ZERO);
    assert(utils.empty(n));
  });

  it('should compute the integer power of an interval', function () {
    n = algebra.pow(new Interval(Math.exp(-1), Math.exp(1)), 1);
    utils.almostEqual(n, [0.36787944117, 2.71828182846]);
    n = algebra.pow(new Interval(Math.exp(-1), Math.exp(1)), 3);
    utils.almostEqual(n, [0.04978706836, 20.0855369232]);

    // 0^0
    n = algebra.pow(new Interval(0, 0), 0);
    assert(utils.empty(n));
    // ?^0
    n = algebra.pow(new Interval(-321, 123), 0);
    utils.almostEqual(n, [1, 1]);
    // 2^-?
    n = algebra.pow(new Interval(2, 2), -2);
    utils.almostEqual(n, [1 / 4, 1 / 4]);
    // negative ^ even
    n = algebra.pow(new Interval(-2, -2), 2);
    utils.almostEqual(n, [4, 4]);
    // negative ^ odd
    n = algebra.pow(new Interval(-2, -2), 3);
    utils.almostEqual(n, [-8, -8]);
    // mixed ^ even
    n = algebra.pow(new Interval(-2, 2), 2);
    utils.almostEqual(n, [0, 4]);
    // mixed ^ odd
    n = algebra.pow(new Interval(-2, 2), 1);
    utils.almostEqual(n, [-2, 2]);
    // positive
    n = algebra.pow(new Interval(1, 1), 1);
    utils.almostEqual(n, [1, 1]);
    n = algebra.pow(new Interval(1, 1), 5);
    utils.almostEqual(n, [1, 1]);
    n = algebra.pow(new Interval(1, 5), 2);
    utils.almostEqual(n, [1, 25]);
    n = algebra.pow(new Interval(2, 5), 2);
    utils.almostEqual(n, [4, 25]);

    // with intervals
    n = algebra.pow(new Interval(2, 5), new Interval(2, 2));
    utils.almostEqual(n, [4, 25]);
    n = algebra.pow(new Interval(2, 5), new Interval(1, -1));
    assert(utils.empty(n));
  });

  it('should compute the square root of an interval', function () {
    n = algebra.sqrt(new Interval(4, 9));
    utils.almostEqual(n, [2, 3]);
    n = algebra.sqrt(new Interval(-4, 9));
    utils.almostEqual(n, [0, 3]);
    n = algebra.sqrt(new Interval(-9, -4));
    assert(utils.empty(n));
  });
});
