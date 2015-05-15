/**
 * Created by mauricio on 5/10/15.
 */
'use strict';
var assert = require('assert');

var Interval = require('../../');
var utils = require('../../lib/operations/utils');
var misc = require('../../lib/operations/misc');
var constants = require('../../lib/constants');

describe('misc', function () {
  var n;
  it('should compute the exponent function', function () {
    n = misc.exp(new Interval(-1, 1));
    utils.almostEqual(n, [0.36787944117, 2.71828182846]);
    n = misc.exp(new Interval(-3, 3));
    utils.almostEqual(n, [0.04978706836, 20.0855369232]);
  });

  it('should compute the logarithmic function (base exp)', function () {
    n = misc.log(new Interval(1, 1));
    utils.almostEqual(n, [0, 0]);
    n = misc.log(new Interval(1, Math.exp(3)));
    utils.almostEqual(n, [0, 3]);
  });

  it('should compute the logarithmic function (base 10)', function () {
    n = misc.log10(new Interval(1, 1));
    utils.almostEqual(n, [0, 0]);
    n = misc.log10(new Interval(1, 10));
    utils.almostEqual(n, [0, 1]);
    n = misc.log10(new Interval(1, 100));
    utils.almostEqual(n, [0, 2]);
  });

  it('should compute the logarithmic function (base 2)', function () {
    n = misc.log2(new Interval(1, 1));
    utils.almostEqual(n, [0, 0]);
    n = misc.log2(new Interval(1, 2));
    utils.almostEqual(n, [0, 1]);
    n = misc.log2(new Interval(1, 8));
    utils.almostEqual(n, [0, 3]);
  });

  it('should compute the hull of two intervals', function () {
    n = misc.hull(new Interval(-1, 1), new Interval(5, 7));
    utils.almostEqual(n, [-1, 7]);
    n = misc.hull(new Interval(-1, 1), constants.EMPTY);
    utils.almostEqual(n, [-1, 1]);
    n = misc.hull(constants.EMPTY, new Interval(-1, 1));
    utils.almostEqual(n, [-1, 1]);
    n = misc.hull(constants.EMPTY, constants.EMPTY);
    assert(utils.empty(n));
  });

  it('should compute the intersection of two intervals', function () {
    n = misc.intersect(new Interval(-1, 1), new Interval(5, 7));
    assert(utils.empty(n));
    n = misc.intersect(new Interval(-1, 1), constants.EMPTY);
    assert(utils.empty(n));
    n = misc.intersect(new Interval(-1, 1), new Interval(0, 7));
    utils.almostEqual(n, [0, 1]);
  });

  it('should compute the abs value of an interval', function () {
    n = misc.abs(new Interval(-1, 1));
    utils.almostEqual(n, [0, 1]);
    n = misc.abs(new Interval(-3, -2));
    utils.almostEqual(n, [2, 3]);
    n = misc.abs(new Interval(2, 3));
    utils.almostEqual(n, [2, 3]);
  });

  it('should compute the max value of two intervals', function () {
    n = misc.max(new Interval(-1, 1), new Interval(5, 7));
    utils.almostEqual(n, [5, 7]);
  });

  it('should compute the min value of two intervals', function () {
    n = misc.min(new Interval(-1, 1), new Interval(5, 7));
    utils.almostEqual(n, [-1, 1]);
  });

  it('should compute complex operations', function () {
    var x = new Interval(0, 1);
    var res = Interval.add(
      Interval.sin(Interval.exp(x)),
      Interval.sub(
        Interval.tan(x),
        Interval.mul(
          Interval.div(Interval.ONE, Interval.cos(Interval.PI)),
          Interval.pow(new Interval(1, 3), 2)
        )
      )
    );
    utils.almostEqual(res, [1.4107812905029047, 11.557407724654915]);
  });
});
