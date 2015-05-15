/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var constants = require('../lib/constants');
var Interval = require('../lib/interval');
var utils = require('../lib/operations/utils');
var n;
var EPS = 1e-7;
function assertEps(a, b) {
  assert( Math.abs(a - b) < EPS );
}

describe('interval', function () {
  it('should have a factory', function () {
    n = Interval.factory();
    assert(n.lo === 0 && n.hi === 0);
    n = Interval.factory(1, 5);
    assert(n.lo === 1 && n.hi === 5);
    n = Interval.factory(1, -1);
    assert(utils.empty(n));
    n = Interval.factory(1);
    assert(n.lo === 1 && n.hi === 1);

    // nested
    n = Interval.factory( Interval.factory(1) );
    assert(n.lo === 1 && n.hi === 1);

    n = Interval.factory( Interval.factory(1), Interval.factory(2) );
    assert(n.lo === 1 && n.hi === 2);

    n = Interval.factory( Interval.factory(0), Interval.factory(3.15) );
    console.log(n);
    assert(n.lo === 0 && n.hi === 3.15);

    assert.throws(function () {
      Interval.factory(1, 2, 3);
    });
    assert.throws(function () {
      Interval.factory('');
    });
    assert.throws(function () {
      Interval.factory(null);
    });
    assert.throws(function () {
      Interval.factory( Interval.factory(1, 2) );
    });
    assert.throws(function () {
      Interval.factory( Interval.factory(1), Interval.factory(1, 2) );
    });
  });

  it('should represent empty/whole/one/pi intervals', function () {
    var x;
    x = constants.EMPTY;
    assert(x.lo > x.hi);
    x = constants.WHOLE;
    assert(x.lo < x.hi && x.lo === Number.NEGATIVE_INFINITY && x.hi === Number.POSITIVE_INFINITY);
    x = constants.PI;
    assert(x.lo < x.hi);
    assertEps(x.lo, Math.PI);
    assertEps(x.hi, Math.PI);
  });

  it('should check NaN on assignment', function () {
    var x;
    x = new Interval(NaN);
    assert(x.lo > x.hi);
    x = new Interval(NaN, NaN);
    assert(x.lo > x.hi);
    x = new Interval();
    x.assign(NaN);
    assert(x.lo > x.hi);
    x.assign(1, 2);
    assert(x.lo < x.hi);
  });

  it('should check an invalid interval on assignment', function () {
    var x;
    x = new Interval(1, -1);
    assert(x.lo > x.hi);
    x = new Interval();
    x.assign(1, -1);
    assert(x.lo > x.hi);
  });

  it('should assign a singleton to an interval', function () {
    n = new Interval();
    n.singleton(1);
    assert(n.lo === 1 && n.hi === 1);
    n.boundedSingleton(1 / 3);
    assert(n.lo < 1 / 3 && n.hi > 1 / 3);
  });

  it('should assign bounded values to an interval', function () {
    n = new Interval();
    n.bounded(1, 2);
    assert(n.lo < 1 && n.hi > 2);
  });

  it('should compute the array representation of an interval', function () {
    n = new Interval();
    var a = n.toArray();
    assert(a[0] === 0 && a[1] === 0);
  });
});
