/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var assert = require('assert');

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var trigonometric = require('../../lib/operations/trigonometric');

describe('trigonometric', function () {
  it('should compute the cosine function', function () {
    var r;
    r = trigonometric.cos(new Interval(0, 0));
    utils.almostEqual(r, [1, 1]);
    r = trigonometric.cos(new Interval(0, Math.PI / 2));
    utils.almostEqual(r, [0, 1]);
    r = trigonometric.cos(new Interval(0, 3 * Math.PI / 2));
    utils.almostEqual(r, [-1, 1]);  // -1 because it includes Math.PI
    r = trigonometric.cos(new Interval(Math.PI, 3 * Math.PI / 2));
    utils.almostEqual(r, [-1, 0]);
    r = trigonometric.cos(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(r, [-1, -1]);
    r = trigonometric.cos(new Interval(-Math.PI, Math.PI));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.cos(new Interval(Math.PI / 2, Math.PI / 2));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.cos(new Interval(-Math.PI / 2, -Math.PI / 2));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.cos(new Interval(-2 * Math.PI, -Math.PI));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.cos(new Interval(3 * Math.PI / 2, 3 * Math.PI));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.cos(new Interval(-Math.PI / 2, Math.PI));
    utils.almostEqual(r, [-1, 1]);
  });

  it('should compute the sine function', function () {
    var r;
    r = trigonometric.sin(new Interval(0, 0));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.sin(new Interval(0, Math.PI / 2));
    utils.almostEqual(r, [0, 1]);
    r = trigonometric.sin(new Interval(0, 3 * Math.PI / 2));
    utils.almostEqual(r, [-1, 1]);  // -1 because it includes Math.PI
    r = trigonometric.sin(new Interval(Math.PI, 3 * Math.PI / 2));
    utils.almostEqual(r, [-1, 0]);
    r = trigonometric.sin(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.sin(new Interval(Math.PI / 2, Math.PI / 2));
    utils.almostEqual(r, [1, 1]);
    r = trigonometric.sin(new Interval(-Math.PI / 2, -Math.PI / 2));
    utils.almostEqual(r, [-1, -1]);
  });

  it('should compute the tangent function', function () {
    var r;
    r = trigonometric.tan(new Interval(0, 0));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.tan(new Interval(Math.PI, Math.PI));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.tan(new Interval(-Math.PI, -Math.PI));
    utils.almostEqual(r, [0, 0]);
    r = trigonometric.tan(new Interval(-Math.PI / 4, Math.PI / 4));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.tan(new Interval(-9 * Math.PI / 4, -7 * Math.PI / 4));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.tan(new Interval(7 * Math.PI / 4, 9 * Math.PI / 4));
    utils.almostEqual(r, [-1, 1]);
    r = trigonometric.tan(new Interval(Math.PI / 2, Math.PI / 2));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(r.hi === Number.POSITIVE_INFINITY);
    r = trigonometric.tan(new Interval(5 * Math.PI / 2, 5 * Math.PI / 2));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(r.hi === Number.POSITIVE_INFINITY);
    r = trigonometric.tan(new Interval(-5 * Math.PI / 2, -5 * Math.PI / 2));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(r.hi === Number.POSITIVE_INFINITY);
    r = trigonometric.tan(new Interval(0, Math.PI / 2));
    assert(r.lo === Number.NEGATIVE_INFINITY);
    assert(r.hi === Number.POSITIVE_INFINITY);
  });
});
