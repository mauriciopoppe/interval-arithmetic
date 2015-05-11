/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

var Interval = require('../../lib/interval');
var utils = require('../../lib/operations/utils');
var algebra = require('../../lib/operations/algebra');

describe('algebra', function () {
  it('should compute the fmod', function () {
    var r;
    r = algebra.fmod(
      new Interval(5.3, 5.3),
      new Interval(2, 2)
    );
    utils.almostEqual(r, [1.3, 1.3]);
    r = algebra.fmod(
      new Interval(18.5, 18.5),
      new Interval(4.2, 4.2)
    );
    utils.almostEqual(r, [1.7, 1.7]);
    r = algebra.fmod(
      new Interval(-10, -10),
      new Interval(3, 3)
    );
    utils.almostEqual(r, [-1, -1]);
  });
});
