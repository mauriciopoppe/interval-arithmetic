/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
var assert = require('assert');

function Interval(lo, hi) {
  switch (arguments.length) {
    case 1:
      this.lo = lo;
      this.hi = lo;
      if (isNaN(lo)) {
        this.setEmpty();
      }
      break;
    case 2:
      this.lo = lo;
      this.hi = hi;
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

Interval.empty = function () {
  return new Interval().setEmpty();
};

Interval.whole = function () {
  return new Interval().setWhole();
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

Interval.prototype.low = function () {
  return this.lo;
};

Interval.prototype.high = function () {
  return this.hi;
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
