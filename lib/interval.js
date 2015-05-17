/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
var utils = require('./operations/utils');
var rmath = require('./round-math');

function Interval(lo, hi) {


  switch (arguments.length) {
    case 1:
      if (typeof lo !== 'number') {
        throw new TypeError('lo must be a number');
      }

      this.set(lo, lo);
      if (isNaN(lo)) {
        this.setEmpty();
      }
      break;
    case 2:
      if (typeof lo !== 'number' || typeof hi !== 'number') {
        throw new TypeError('lo,hi must be numbers');
      }

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

  function singleton(x) {
    if (typeof x === 'object') {
      assert(typeof x.lo === 'number' && typeof x.hi === 'number', 'param must be an Interval');
      assert(utils.singleton(x), 'param needs to be a singleton');
    }
  }

  function getNumber(x) {
    if (typeof x === 'object') {
      singleton(x);
      return x.lo;
    }
    return x;
  }

  assert(arguments.length <= 2);

  var lo, hi;
  if (arguments.length === 2) {
    // handles:
    // - new Interval( 1, 2 )
    // - new Interval( new Interval(1, 1), new Interval(2, 2) )
    lo = getNumber(a);
    hi = getNumber(b);
  } else if (arguments.length === 1) {
    if (Array.isArray(a)) {
      // handles
      // - new Interval( [1, 2] )
      lo = a[0];
      hi = a[1];
    } else {
      lo = hi = getNumber(a);
    }
  } else {
    return new Interval();
  }
  return new Interval(lo, hi);
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
