/**
 * Created by mauricio on 4/27/15.
 */
'use strict';

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

round.expLo = function (x) {
  if (x === Number.NEGATIVE_INFINITY) {
    return 0;
  }
  if (x < Number.POSITIVE_INFINITY) {
    return Math.max(0, prev(Math.exp(x)));
  }
  return x;
};
round.expHi = function (x) {
  if (x === Number.NEGATIVE_INFINITY) {
    return 0;
  }
  if (x < Number.POSITIVE_INFINITY) {
    return next(Math.exp(x));
  }
  return x;
};

round.logLo = function (x) {
  if (x < 0) {
    return NaN;
  }
  if (x < Number.POSITIVE_INFINITY) {
    return prev(Math.log(x));
  }
  return x;
};
round.logHi = function (x) {
  if (x < 0) {
    return NaN;
  }
  if (x < Number.POSITIVE_INFINITY) {
    return next(Math.log(x));
  }
  return x;
};

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

round.sin2PILo = function (x)  { return prev(Math.sin(prev(Math.PI * 2 * x))); };
round.sin2PIHi = function (x)  { return next(Math.sin(next(Math.PI * 2 * x))); };

round.cos2PILo = function (x) {
  if (x > 0) {
    return prev(Math.cos(next(Math.PI * 2 * x)));
  }
  return prev(Math.cos(prev(Math.PI * 2 * x)));
};
round.cos2PIHi = function (x) {
  if (x > 0) {
    return next(Math.cos(prev(Math.PI * 2 * x)));
  }
  return next(Math.cos(next(Math.PI * 2 * x)));
};

round.tan2PILo = function (x) { return prev(Math.tan(prev(Math.PI * 2 * x))); };
round.tan2PIHi = function (x) { return next(Math.tan(next(Math.PI * 2 * x))); };

round.asin2PILo = function (x) { return prev(Math.asin(x) / next(Math.PI * 2 * x)); };
round.asin2PIHi = function (x) { return next(Math.asin(x) / prev(Math.PI * 2 * x)); };

round.acos2PILo = function (x) { return prev(Math.acos(x) / next(Math.PI * 2 * x)); };
round.acos2PIHi = function (x) { return next(Math.acos(x) / prev(Math.PI * 2 * x)); };

round.atan2PILo = function (x) { return prev(Math.atan(x) / next(Math.PI * 2 * x)); };
round.atan2PIHi = function (x) { return next(Math.atan(x) / prev(Math.PI * 2 * x)); };

round.powLo = function (x, y) {
  if (x < 0) { return NaN; }
  if (x === 0) { return 0; }

  if (y > 0) {
    if (x > 1) { return round.expLo(round.mulLo(y, round.logLo(x))); }
    if (x === 1) { return 1; }
    return round.expLo(round.mulLo(y, round.logHi(x)));
  } else if (y === 0) {
    return 1;
  } else {
    // y < 0 for the cases below
    if (x > 1) { return round.expLo(round.mulLo(y, round.logHi(x))); }
    if (x === 1) { return 1; }
    return round.expLo(round.mulLo(y, round.logLo(x)));
  }
};
round.powHi = function (x, y) {
  if (x < 0) { return NaN; }
  if (x === 0) { return 0; }

  if (y > 0) {
    if (x > 1) { return round.expHi(round.mulHi(y, round.logHi(x))); }
    if (x === 1) { return 1; }
    return round.expHi(round.mulHi(y, round.logLo(x)));
  } else if (y === 0) {
    return 1;
  } else {
    // y < 0 for the cases below
    if (x > 1) { return round.expHi(round.mulHi(y, round.logLo(x))); }
    if (x === 1) { return 1; }
    return round.expHi(round.mulHi(y, round.logHi(x)));
  }
};

module.exports = round;
