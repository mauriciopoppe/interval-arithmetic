/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var misc = require('../../lib/operations/misc');

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
});
