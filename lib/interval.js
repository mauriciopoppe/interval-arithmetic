/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
var utils = require('./operations/utils');
var rmath = require('./round-math');

function Interval(lo, hi) {
  switch (arguments.length) {
    case 1:
      this.set(lo, lo);
      if (isNaN(lo)) {
        this.setEmpty();
      }
      break;
    case 2:
      this.set(lo, hi);
      if (isNaN(lo) || isNaN(hi) || lo > hi) {
        this.setEmpty();
      }
      break;
    default:
      this.lo = 0;
      this.hi = 0;
      break;
  }
}

Interval.factory = function (a, b) {
  function assert(a, message) {
    /* istanbul ignore next */
    if (!a) {
      throw new Error(message || 'assertion failed');
    }
  }

  function checkParam(param) {
    if (typeof param !== 'undefined') {
      if (typeof param === 'object') {
        assert(typeof param.lo === 'number' && typeof param.hi === 'number', 'param must be an Interval');
        assert(utils.singleton(param), 'param needs to be a singleton');
        return param.lo;
      } else if (typeof param !== 'number') {
        assert(false, 'param must be a singleton interval or a number');
      }
    }
    return param;
  }

  assert(arguments.length <= 2);
  a = checkParam(a);
  b = checkParam(b);
  if (arguments.length === 2) {
    return new Interval(a, b);
  } else if (arguments.length === 1) {
    return new Interval(a, a);
  } else {
    return new Interval();
  }
};

Interval.prototype.singleton = function (v) {
  return this.set(v, v);
};

Interval.prototype.bounded = function (lo, hi) {
  return this.set(rmath.prev(lo), rmath.next(hi));
};

Interval.prototype.boundedSingleton = function (v) {
  return this.bounded(v, v);
};

Interval.prototype.set = function (lo, hi) {
  this.lo = lo;
  this.hi = hi;
  return this;
};

Interval.prototype.assign = function (lo, hi) {
  if (isNaN(lo) || isNaN(hi) || lo > hi) {
    return this.setEmpty();
  }
  return this.set(lo, hi);
};

Interval.prototype.setEmpty = function () {
  return this.set(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
};

Interval.prototype.setWhole = function () {
  return this.set(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
};

Interval.prototype.toArray = function () {
  return [this.lo, this.hi];
};

// interval/interval comparisons
//Interval.prototype.lessThan = function (r) {
//  if (!this.isEmpty()) {
//    if (this.hi < r.lo) { return true; }
//    if (this.lo >= r.hi) { return false; }
//  }
//  throw Error('comparison error');
//};
//
//Interval.prototype.greaterThan = function (r) {
//  if (!this.isEmpty()) {
//    if (this.lo > r.hi) { return true; }
//    if (this.hi <= r.lo) { return false; }
//  }
//  throw Error('comparison error');
//};
//
//Interval.prototype.lessEqualThan = function (r) {
//  if (!this.isEmpty()) {
//    if (this.hi <= r.lo) { return true; }
//    if (this.lo > r.hi) { return false; }
//  }
//  throw Error('comparison error');
//};
//
//Interval.prototype.greaterEqualThan = function (r) {
//  if (!this.isEmpty()) {
//    if (this.lo >= r.hi) { return true; }
//    if (this.hi < r.lo) { return false; }
//  }
//  throw Error('comparison error');
//};

module.exports = Interval;
