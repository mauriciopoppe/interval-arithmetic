/**
 * Created by mauricio on 4/27/15.
 */
'use strict';
require('./polyfill');
var double = require('./double');

var round = {};
var MIN_VALUE = double.ieee754NextDouble(0);

round.POSITIVE_ZERO = +0;
round.NEGATIVE_ZERO = -0;

var next = round.next = function (v) {
  if (v === 0) {
    return MIN_VALUE;
  }
  if (Math.abs(v) < Number.POSITIVE_INFINITY) {
    if (v > 0) {
      return double.ieee754NextDouble(v);
    } else {
      // v can't be zero at this point, it's < 0
      return double.ieee754PrevDouble(v);
    }
  }
  return v;
};

var prev = round.prev = function (v) {
  return -next(-v);
};

round.addLo = function (x, y) { return prev(x + y); };
round.addHi = function (x, y) { return next(x + y); };

round.subLo = function (x, y) { return prev(x - y); };
round.subHi = function (x, y) { return next(x - y); };

round.mulLo = function (x, y) {
  if (x === 0 && y === 0) {
    return 0;
  }
  return prev(x * y);
};
round.mulHi = function (x, y) {
  if (x === 0 && y === 0) {
    return 0;
  }
  return next(x * y);
};

round.divLo = function (x, y) {
  if (x === 0) {
    return 0;
  }
  return prev(x / y);
};
round.divHi = function (x, y) {
  if (x === 0) {
    return 0;
  }
  return next(x / y);
};

function toInteger(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

round.intLo = function (x) { return toInteger(prev(x)); };
round.intHi = function (x) { return toInteger(next(x)); };

//round.expLo = function (x) {
//  if (x === Number.NEGATIVE_INFINITY) {
//    return 0;
//  }
//  if (x < Number.POSITIVE_INFINITY) {
//    return Math.max(0, prev(Math.exp(x)));
//  }
//  return x;
//};
//round.expHi = function (x) {
//  if (x === Number.NEGATIVE_INFINITY) {
//    return 0;
//  }
//  if (x < Number.POSITIVE_INFINITY) {
//    return next(Math.exp(x));
//  }
//  return x;
//};
//
//round.logLo = function (x) {
//  if (x < 0) {
//    return NaN;
//  }
//  if (x < Number.POSITIVE_INFINITY) {
//    return prev(Math.log(x));
//  }
//  return x;
//};
//round.logHi = function (x) {
//  if (x < 0) {
//    return NaN;
//  }
//  if (x < Number.POSITIVE_INFINITY) {
//    return next(Math.log(x));
//  }
//  return x;
//};

round.logLo = function (x) { return prev(Math.log(x)); };
round.logHi = function (x) { return next(Math.log(x)); };

round.expLo = function (x) { return prev(Math.exp(x)); };
round.expHi = function (x) { return next(Math.exp(x)); };

round.sinLo = function (x) { return prev(Math.sin(x)); };
round.sinHi = function (x) { return next(Math.sin(x)); };

round.cosLo = function (x) { return prev(Math.cos(x)); };
round.cosHi = function (x) { return next(Math.cos(x)); };

round.tanLo = function (x) { return prev(Math.tan(x)); };
round.tanHi = function (x) { return next(Math.tan(x)); };

round.asinLo = function (x) { return prev(Math.asin(x)); };
round.asinHi = function (x) { return next(Math.asin(x)); };

round.acosLo = function (x) { return prev(Math.acos(x)); };
round.acosHi = function (x) { return next(Math.acos(x)); };

round.atanLo = function (x) { return prev(Math.atan(x)); };
round.atanHi = function (x) { return next(Math.atan(x)); };

// polyfill required for hyperbolic functions
round.sinhLo = function (x) { return prev(Math.sinh(x)); };
round.sinhHi = function (x) { return next(Math.sinh(x)); };

round.coshLo = function (x) { return prev(Math.cosh(x)); };
round.coshHi = function (x) { return next(Math.cosh(x)); };

round.tanhLo = function (x) { return prev(Math.tanh(x)); };
round.tanhHi = function (x) { return next(Math.tanh(x)); };

/**
 * ln(power) exponentiation of x
 * @param {number} x
 * @param {number} power
 * @returns {number}
 */
round.powLo = function (x, power) {
  var y = (power & 1) ? x : 1;
  power >>= 1;
  while (power > 0) {
    x = round.mulLo(x, x);
    if (power & 1) {
      y = round.mulLo(x, y);
    }
    power >>= 1;
  }
  return y;
};

/**
 * ln(power) exponentiation of x
 * @param {number} x
 * @param {number} power
 * @returns {number}
 */
round.powHi = function (x, power) {
  var y = (power & 1) ? x : 1;
  power >>= 1;
  while (power > 0) {
    x = round.mulHi(x, x);
    if (power & 1) {
      y = round.mulHi(x, y);
    }
    power >>= 1;
  }
  return y;
};

round.sqrtLo = function (x) { return prev(Math.sqrt(x)); };
round.sqrtHi = function (x) { return next(Math.sqrt(x)); };

module.exports = round;
