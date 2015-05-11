/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
var interval = require('./interval');
var rmath = require('./round-math');

var PI2 = 2 * Math.PI;
var PI2Interval = interval.create(rmath.prev(PI2), rmath.next(PI2));

// POOL
var pa = interval.create();
var pb = interval.create();
var pc = interval.create();

var arithmetic = {};

arithmetic.nonEmpty = function (x) {
  return interval.nonEmpty(x);
};

arithmetic.intersect = function (out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};

arithmetic.union = function (out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};

arithmetic.add = function (out, a, b) {
  out[0] = rmath.addLo(a[0], b[0]);
  out[1] = rmath.addHi(a[1], b[1]);
  return out;
};

arithmetic.sub = function (out, a, b) {
  out[0] = rmath.subLo(a[0], b[1]);
  out[1] = rmath.subHi(a[1], b[0]);
  return out;
};

arithmetic.mul = function (out, a, b) {
  if (a[0] === 0 && a[1] === 0 && b[0] === 0 && b[1] === 0) {
    out[0] = 0;
    out[1] = rmath.NEGATIVE_ZERO;
  } else if (a[0] >= 0) {
    if (b[0] >= 0) {
      // ?P * ?P
      out[0] = Math.max(0, rmath.mulLo(a[0], b[0]));
      out[1] = rmath.mulHi(a[1], b[1]);
    } else if (b[1] <= 0) {
      // ?P * ?N
      out[0] = rmath.mulLo(a[1], b[0]);
      out[1] = Math.min(0, rmath.mulHi(a[0], b[1]));
    } else {
      out[0] = rmath.mulLo(a[1], b[0]);
      out[1] = rmath.mulHi(a[1], b[1]);
    }
  } else if (a[1] <= 0) {
    if (b[0] >= 0) {
      out[0] = rmath.mulLo(a[0], b[1]);
      out[1] = Math.min(0, rmath.mulHi(a[1], b[0]));
    } else if (b[1] <= 0) {
      out[0] = Math.max(0, rmath.mulLo(a[1], b[1]));
      out[1] = rmath.mulHi(a[0], b[0]);
    } else {
      out[0] = rmath.mulLo(a[0], b[1]);
      out[1] = rmath.mulHi(a[0], b[0]);
    }
  } else {
    if (b[0] >= 0) {
      out[0] = rmath.mulLo(a[0], b[1]);
      out[1] = rmath.mulHi(a[1], b[1]);
    } else if (b[1] <= 0) {
      out[0] = rmath.mulLo(a[1], b[0]);
      out[1] = rmath.mulHi(a[0], b[0]);
    } else {
      out[0] = Math.min( rmath.mulLo(a[1], b[0]), rmath.mulLo(a[0], b[1]) );
      out[1] = Math.max( rmath.mulHi(a[0], b[0]), rmath.mulHi(a[1], b[1]) );
    }
  }
  return out;
};

arithmetic.div = function (out, a, b) {
  if (b[0] === 0 && b[1] === 0) {
    throw Error('div(out, a, b): division by zero');
  }
  if (a[0] <= 0 && 0 <= a[1] && b[0] <= 0 && 0 <= b[1]) {
    out[0] = Number.NEGATIVE_INFINITY;
    out[1] = Number.POSITIVE_INFINITY;
  } else {
    if (b[1] === 0) { b[1] = rmath.NEGATIVE_ZERO; }
    if (a[0] >= 0) {
      if (b[0] >= 0) {
        out[0] = Math.max(0, rmath.divLo(a[0], b[1]));
        out[1] = rmath.divHi(a[1], b[0]);
      } else if (b[1] <= 0) {
        out[0] = rmath.divLo(a[1], b[1]);
        out[1] = Math.min(0, rmath.divHi(a[0], b[0]));
      } else {
        out[0] = Number.NEGATIVE_INFINITY;
        out[1] = Number.POSITIVE_INFINITY;
      }
    } else if (a[1] <= 0) {
      if (b[0] >= 0) {
        out[0] = rmath.divLo(a[0], b[0]);
        out[1] = Math.min(0, rmath.divHi(a[1], b[1]));
      } else if (b[1] <= 0) {
        out[0] = Math.max(0, rmath.divLo(a[1], b[0]));
        out[1] = rmath.divHi(a[0], b[1]);
      } else {
        out[0] = Number.NEGATIVE_INFINITY;
        out[1] = Number.POSITIVE_INFINITY;
      }
    } else {
      if (b[0] >= 0) {
        out[0] = rmath.divLo(a[0], b[0]);
        out[1] = rmath.divHi(a[1], b[0]);
      } else if (b[1] <= 0) {
        out[0] = rmath.divLo(a[1], b[1]);
        out[1] = rmath.divHi(a[0], b[1]);
      } else {
        out[0] = Number.NEGATIVE_INFINITY;
        out[1] = Number.POSITIVE_INFINITY;
      }
    }
  }
  return out;
};

// unary
arithmetic.minus = function (out, a) {
  out[0] = -a[1];
  out[1] = -a[0];
  return out;
};

arithmetic.exp = function (out, a) {
  out[0] = rmath.expLo(a[0]);
  out[1] = rmath.expHi(a[1]);
  return out;
};

arithmetic.log = function (out, a) {
  if (a[1] <= 0) {
    throw Error('log(x): x <= 0');
  }
  if (a[0] < 0) { a[0] = 0; }
  out[0] = rmath.logLo(a[0]);
  out[1] = rmath.logHi(a[1]);
  return out;
};

arithmetic.sin = function (out, a) {
  arithmetic.div(pa, a, PI2Interval);
  arithmetic.sin2PI(out, pa);
  return out;
};

arithmetic.cos = function (out, a) {
  arithmetic.div(pa, a, PI2Interval);
  arithmetic.cos2PI(out, pa);
  return out;
};

arithmetic.tan = function (out, a) {
  arithmetic.div(pa, a, PI2Interval);
  arithmetic.tan2PI(out, pa);
  return out;
};

arithmetic.asin = function (out, a) {
  interval.intersect(pa, a, [-1, 1]);
  out[0] = rmath.asinLo(pa[0]);
  out[1] = rmath.asinHi(pa[1]);
  return out;
};

arithmetic.acos = function (out, a) {
  out[0] = rmath.acosLo(a[0]);
  out[1] = rmath.acosHi(a[1]);
  return out;
};

arithmetic.atan = function (out, a) {
  out[0] = rmath.atanLo(a[0]);
  out[1] = rmath.atanHi(a[1]);
  return out;
};

module.exports = arithmetic;

//console.log( arithmetic.div([], [1,1], [-0.5,0.5]) );
