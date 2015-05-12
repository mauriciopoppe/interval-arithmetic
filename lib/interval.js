/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
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

Interval.prototype.singleton = function (v) {
  return this.bounded(v, v);
};

Interval.prototype.bounded = function (lo, hi) {
  return this.set(rmath.prev(lo), rmath.next(hi));
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
