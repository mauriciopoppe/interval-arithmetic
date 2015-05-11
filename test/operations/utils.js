/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');

describe('utils', function () {
  it('should verify empty intervals', function () {
    var a = Interval.empty();
    assert(utils.empty(a));
    a.assign(1, -1);
    assert(utils.empty(a));
  });

  it('should verify if zero is included in an interval', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(1, 2);
    assert(utils.zeroIn(a));
    assert(!utils.zeroIn(b));
  });

  it('should verify if a value is included in an interval', function () {
    var a = new Interval(-1, 1);
    assert(utils.in(a, 1));
    assert(utils.in(a, 0));
    assert(utils.in(a, -1));
    assert(!utils.in(a, 2));
  });

  it('should verify if an interval is a subset of another', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-0.5, 0.5);
    var c = new Interval(0.5, 1.5);
    assert(utils.subset(b, a));
    assert(!utils.subset(c, a));
  });

  it('should verify if an interval overlaps another', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-0.5, 0.5);
    var c = new Interval(0.6, 1.5);
    assert(utils.overlap(a, b));
    assert(utils.overlap(a, c));
    assert(!utils.overlap(b, c));
  });

  it('should verify interval equality', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-1, 1);
    var c = new Interval(-1, 1.1);
    assert(utils.equal(a, b));
    assert(!utils.equal(a, c));
  });
});
