/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var rmath = require('../lib/round-math');

var EPS = 1e-7;
var n;
function assertEps(a, b) {
  assert( Math.abs(a - b) < EPS );
}

describe('round math', function () {
  describe('should compute next/previous double values of arithmetic operations', function () {
    it('+ addition', function () {
      n = rmath.addLo(1, 2);
      assert(n < 3);
      assertEps(n, 3);
      n = rmath.addHi(1, 2);
      assert(n > 3);
      assertEps(n, 3);
    });

    it('- subtraction', function () {
      n = rmath.subLo(1, 2);
      assert(n < -1);
      assertEps(n, -1);
      n = rmath.subHi(1, 2);
      assert(n > -1);
      assertEps(n, -1);
    });

    it('* multiplication', function () {
      n = rmath.mulLo(2, 3);
      assert(n < 6);
      assertEps(n, 6);
      n = rmath.mulHi(2, 3);
      assert(n > 6);
      assertEps(n, 6);
    });

    it('/ division', function () {
      var d = 2 / 3;
      n = rmath.divLo(2, 3);
      assert(n < d);
      assertEps(n, d);
      n = rmath.divHi(2, 3);
      assert(n > d);
      assertEps(n, d);
    });
  });

  describe('should compute next/previous double values of algebraic operations', function () {
    it('integer lower', function () {
      n = rmath.intLo(3.1);
      assert(n === 3);
      n = rmath.intLo(3);
      assert(n === 2);
      n = rmath.intLo(-3.1);
      assert(n === -3);
      n = rmath.intLo(-3);
      assert(n === -3);
      n = rmath.intLo(0);
      assert(n === 0);
    });

    it('integer upper', function () {
      n = rmath.intHi(3.1);
      assert(n === 3);
      n = rmath.intHi(3);
      assert(n === 3);
      n = rmath.intHi(-3.1);
      assert(n === -3);
      n = rmath.intHi(-3);
      assert(n === -2);
      n = rmath.intHi(0);
      assert(n === 0);
    });

    it('^ power', function () {
      var d = 4;
      n = rmath.powLo(2, 2);
      assert(n < d);
      assertEps(n, d);
      n = rmath.powHi(2, 2);
      assert(n > d);
      assertEps(n, d);
      n = rmath.powHi(-2, 4);
      assert(n > 16);
      assertEps(n, 16);
      n = rmath.powHi(2, 3);
      assert(n > 8);
      assertEps(n, 8);
      // getting the prev and then the next number cancels the
      // double rounding
      n = rmath.powHi(-2, 3);
      assert(n === -8);
      assertEps(n, -8);
    });
  });

  describe('options', function () {
    it('should be disabled/enabled at will', function () {
      rmath.disable();
      assert(rmath.prev(2) === 2 && rmath.next(2) === 2);
      rmath.enable();
      assert(rmath.prev(2) < 2 && rmath.next(2) > 2);
    });
  });
});
