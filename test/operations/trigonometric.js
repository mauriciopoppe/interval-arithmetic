/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var trigonometric = require('../../lib/operations/trigonometric');
var n;

describe('trigonometric', function () {
  it('should compute the cosine function', function () {
    n = trigonometric.cos(new Interval(0, 0));
    utils.almostEqual(n, [1, 1]);
    n = trigonometric.cos(new Interval(0, Math.PI / 2));
    utils.almostEqual(n, [0, 1]);
    n = trigonometric.cos(new Interval(0, 3 * Math.PI / 2));
    utils.almostEqual(n, [-1, 1]);  // -1 because it includes Math.PI
    n = trigonometric.cos(new Interval(Math.PI, 3 * Math.PI / 2));
    utils.almostEqual(n, [-1, 0]);
    n = trigonometric.cos(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(n, [-1, -1]);
    n = trigonometric.cos(new Interval(-Math.PI, Math.PI));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.cos(new Interval(Math.PI / 2, Math.PI / 2));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.cos(new Interval(-Math.PI / 2, -Math.PI / 2));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.cos(new Interval(-2 * Math.PI, -Math.PI));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.cos(new Interval(3 * Math.PI / 2, 3 * Math.PI));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.cos(new Interval(-Math.PI / 2, Math.PI));
    utils.almostEqual(n, [-1, 1]);
  });

  it('should compute the sine function', function () {
    n = trigonometric.sin(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.sin(new Interval(0, Math.PI / 2));
    utils.almostEqual(n, [0, 1]);
    n = trigonometric.sin(new Interval(0, 3 * Math.PI / 2));
    utils.almostEqual(n, [-1, 1]);  // -1 because it includes Math.PI
    n = trigonometric.sin(new Interval(Math.PI, 3 * Math.PI / 2));
    utils.almostEqual(n, [-1, 0]);
    n = trigonometric.sin(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.sin(new Interval(Math.PI / 2, Math.PI / 2));
    utils.almostEqual(n, [1, 1]);
    n = trigonometric.sin(new Interval(-Math.PI / 2, -Math.PI / 2));
    utils.almostEqual(n, [-1, -1]);
  });

  it('should compute the tangent function', function () {
    n = trigonometric.tan(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.tan(new Interval(Math.PI, Math.PI));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.tan(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.tan(new Interval(-Math.PI / 4, Math.PI / 4));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.tan(new Interval(-9 * Math.PI / 4, -7 * Math.PI / 4));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.tan(new Interval(7 * Math.PI / 4, 9 * Math.PI / 4));
    utils.almostEqual(n, [-1, 1]);
    n = trigonometric.tan(new Interval(Math.PI / 2, Math.PI / 2));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(n.hi === Number.POSITIVE_INFINITY);
    n = trigonometric.tan(new Interval(5 * Math.PI / 2, 5 * Math.PI / 2));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(n.hi === Number.POSITIVE_INFINITY);
    n = trigonometric.tan(new Interval(-5 * Math.PI / 2, -5 * Math.PI / 2));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(n.hi === Number.POSITIVE_INFINITY);
    n = trigonometric.tan(new Interval(0, Math.PI / 2));
    assert(n.lo === Number.NEGATIVE_INFINITY);
    assert(n.hi === Number.POSITIVE_INFINITY);
  });

  it('should compute the asin function', function () {
    n = trigonometric.asin(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.asin(new Interval(-1, 1));
    utils.almostEqual(n, [-1.57079633, 1.57079633]);
    n = trigonometric.asin(new Interval(-10, 10));
    utils.almostEqual(n, [-1.57079633, 1.57079633]);
    n = trigonometric.asin(new Interval(-10, -10));
    assert(utils.empty(n));
  });

  it('should compute the acos function', function () {
    n = trigonometric.acos(new Interval(1, 1));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.acos(new Interval(0, 1));
    utils.almostEqual(n, [0, Math.PI / 2]);
    n = trigonometric.acos(new Interval(-1, 1));
    utils.almostEqual(n, [0, Math.PI]);
    n = trigonometric.acos(new Interval(-10, 10));
    utils.almostEqual(n, [0, Math.PI]);
    n = trigonometric.acos(new Interval(-10, -10));
    assert(utils.empty(n));
  });

  it('should compute the atan function', function () {
    n = trigonometric.atan(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.atan(new Interval(-1, 1));
    utils.almostEqual(n, [-0.785398163, 0.785398163]);
  });

  it('should compute the hyperbolic sin function', function () {
    n = trigonometric.sinh(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.sinh(new Interval(-2, 2));
    utils.almostEqual(n, [-3.62686040785, 3.62686040785]);
  });

  it('should compute the hyperbolic cos function', function () {
    n = trigonometric.cosh(new Interval(0, 0));
    utils.almostEqual(n, [1, 1]);
    n = trigonometric.cosh(new Interval(-2, 2));
    utils.almostEqual(n, [1, 3.76219569108]);
    n = trigonometric.cosh(new Interval(-2, -2));
    utils.almostEqual(n, [3.76219569108, 3.76219569108]);
    n = trigonometric.cosh(new Interval(2, 2));
    utils.almostEqual(n, [3.76219569108, 3.76219569108]);
  });

  it('should compute the hyperbolic tan function', function () {
    n = trigonometric.tanh(new Interval(0, 0));
    utils.almostEqual(n, [0, 0]);
    n = trigonometric.tanh(new Interval(-4, 4));
    utils.almostEqual(n, [-0.99932929973, 0.99932929973]);
    n = trigonometric.tanh(new Interval(-Infinity, Infinity));
    utils.almostEqual(n, [-1, 1]);
  });

});
