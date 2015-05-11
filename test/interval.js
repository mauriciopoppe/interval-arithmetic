/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../lib/interval');

var EPS = 1e-7;
function assertEps(a, b) {
  assert( Math.abs(a - b) < EPS );
}

describe('interval', function () {
  it('should represent empty/whole intervals', function () {
    var x;
    x = Interval.empty();
    assert(x.lo > x.hi);
    x = Interval.whole();
    assert(x.lo < x.hi && x.lo === Number.NEGATIVE_INFINITY && x.hi === Number.POSITIVE_INFINITY);
  });

  it('should check NaN on assignment', function () {
    var x = new Interval();
    x.assign(NaN);
    assert(x.lo > x.hi);
  });

  it('should check an invalid interval on assignment', function () {
    var x = new Interval();
    x.assign(1, -1);
    assert(x.lo > x.hi);
  });
});
