/**
 * Created by mauricio on 4/27/15.
 */
'use strict'
var utils = require('./operations/utils')
var rmath = require('./round-math')

module.exports = Interval

function Interval (lo, hi) {
  if (!(this instanceof Interval)) {
    return new Interval(lo, hi)
  }

  if (typeof lo !== 'undefined' && typeof hi !== 'undefined') {
    // possible cases:
    // - Interval(1, 2)
    // - Interval(Interval(1, 1), Interval(2, 2))     // singletons are required
    if (utils.isInterval(lo)) {
      if (!utils.isSingleton(lo)) {
        throw new TypeError('Interval: interval `lo` must be a singleton')
      }
      lo = lo.lo
    }
    if (utils.isInterval(hi)) {
      if (!utils.isSingleton(hi)) {
        throw TypeError('Interval: interval `hi` must be a singleton')
      }
      hi = hi.hi
    }
  } else if (typeof lo !== 'undefined') {
    // possible cases:
    // - Interval(1)
    // - Interval([1, 2])
    // - Interval([Interval(1, 1), Interval(2, 2)])
    if (Array.isArray(lo)) {
      return Interval(lo[0], lo[1])
    }
    return Interval(lo, lo)
  } else {
    // possible cases:
    // - Interval()
    lo = hi = 0
  }

  this.assign(lo, hi)
}

Interval.factory = Interval

Interval.prototype.singleton = function (v) {
  return this.set(v, v)
}

Interval.prototype.bounded = function (lo, hi) {
  return this.set(rmath.prev(lo), rmath.next(hi))
}

Interval.prototype.boundedSingleton = function (v) {
  return this.bounded(v, v)
}

Interval.prototype.set = function (lo, hi) {
  this.lo = lo
  this.hi = hi
  return this
}

Interval.prototype.assign = function (lo, hi) {
  if (typeof lo !== 'number' || typeof hi !== 'number') {
    throw TypeError('Interval#assign: arguments must be numbers')
  }
  if (isNaN(lo) || isNaN(hi) || lo > hi) {
    return this.setEmpty()
  }
  return this.set(lo, hi)
}

Interval.prototype.setEmpty = function () {
  return this.set(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)
}

Interval.prototype.setWhole = function () {
  return this.set(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
}

Interval.prototype.toArray = function () {
  return [this.lo, this.hi]
}

Interval.prototype.clone = function () {
  return Interval(this.lo, this.hi)
}
