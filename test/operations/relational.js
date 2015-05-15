/**
 * Created by mauricio on 5/10/15.
 */
'use strict';
var assert = require('assert');

var Interval = require('../../');

describe('relational', function () {
  var a = new Interval(-3, -1);
  var b = new Interval(-2, 1);
  var c = new Interval(0, 2);
  var ac = new Interval(-1, 0);
  var aCopy = Interval.clone(a);

  it('equal', function () {
    assert(Interval.equal(a, aCopy));
    assert(!Interval.equal(a, c));
    assert(!Interval.equal(a, Interval.EMPTY));
    assert(Interval.equal(Interval.EMPTY, Interval.EMPTY));
  });

  it('not equal', function () {
    assert(Interval.notEqual(a, c));
    assert(!Interval.notEqual(a, b));
    assert(!Interval.notEqual(b, c));
    assert(Interval.notEqual(a, Interval.EMPTY));
    assert(!Interval.notEqual(Interval.EMPTY, Interval.EMPTY));
  });

  it('less than', function () {
    assert(Interval.lt(a, c));
    assert(!Interval.lt(c, a));
    assert(!Interval.lt(a, b));
    assert(!Interval.lt(b, c));
    assert(!Interval.lt(a, ac));
    assert(!Interval.lt(ac, c));
    assert(!Interval.lt(a, Interval.EMPTY));
  });

  it('greater than', function () {
    assert(Interval.gt(c, a));
    assert(!Interval.gt(a, c));
    assert(!Interval.gt(a, b));
    assert(!Interval.gt(b, c));
    assert(!Interval.gt(c, ac));
    assert(!Interval.gt(ac, a));
    assert(!Interval.gt(a, Interval.EMPTY));
  });

  it('less equal than', function () {
    assert(Interval.leq(a, ac));
    assert(Interval.leq(ac, c));
    assert(Interval.leq(a, c));
    assert(!Interval.leq(c, a));
    assert(!Interval.leq(a, b));
    assert(!Interval.leq(b, c));
    assert(!Interval.leq(a, Interval.EMPTY));
  });

  it('greater equal than', function () {
    assert(Interval.geq(c, a));
    assert(Interval.geq(c, ac));
    assert(Interval.geq(ac, a));
    assert(!Interval.geq(a, c));
    assert(!Interval.geq(a, b));
    assert(!Interval.geq(b, c));
    assert(!Interval.geq(a, Interval.EMPTY));
  });
});
