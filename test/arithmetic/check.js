/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var check = require('../../lib/arithmetic/check');

describe('check', function () {
  it('should verify empty intervals', function () {
    var a = Interval.empty();
    assert(check.empty(a));
    a.assign(1, -1);
    assert(check.empty(a));
  });

  it('should verify if zero is included in an interval', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(1, 2);
    assert(check.zeroIn(a));
    assert(!check.zeroIn(b));
  });

  it('should verify if a value is included in an interval', function () {
    var a = new Interval(-1, 1);
    assert(check.in(a, 1));
    assert(check.in(a, 0));
    assert(check.in(a, -1));
    assert(!check.in(a, 2));
  });

  it('should verify if an interval is a subset of another', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-0.5, 0.5);
    var c = new Interval(0.5, 1.5);
    assert(check.subset(b, a));
    assert(!check.subset(c, a));
  });

  it('should verify if an interval overlaps another', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-0.5, 0.5);
    var c = new Interval(0.6, 1.5);
    assert(check.overlap(a, b));
    assert(check.overlap(a, c));
    assert(!check.overlap(b, c));
  });

  it('should verify interval equality', function () {
    var a = new Interval(-1, 1);
    var b = new Interval(-1, 1);
    var c = new Interval(-1, 1.1);
    assert(check.equal(a, b));
    assert(!check.equal(a, c));
  });
});
