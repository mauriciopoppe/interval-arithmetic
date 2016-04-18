/**
 * Created by mauricio on 5/10/15.
 * Extended by MiLia on 18/04/16
 */
'use strict'
var constants = require('../constants')
var Interval = require('../interval')
var rmath = require('../round-math')
var utils = require('./utils')
var misc = require('./misc')
var algebra = require('./algebra')
var arithmetic = require('./arithmetic')
var division = require('./division')

var trigonometric = {}

// Ideas taken from ValidatedNumerics.jl and
// Validated Numerics: A Short Introduction to Rigorous Computations, W. Tucker, 
// Princeton University Press (2010), Chapter 3.

// First we'll create a function that'll decide in which quadrant of the trig. circle our interval belongs.
trigonometric.find_quadrant = function (x) {
	var temp = division.nonZero(Interval(x), constants.PI_HALF)
//	if (utils.isNotNegative(temp) == false){ 		// This trick doesn't work for all intervals
//		var temp = arithmetic.negative(temp)		// that's why I had to change the signs manually inside the sin(x) func.
//   }
	return Interval(Math.floor(temp.lo), Math.floor(temp.hi))
}

// sin(X)
trigonometric.sin = function (x) {
	// In case an empty set is inserted
	if (utils.isEmpty(x)) { return constants.EMPTY }

	var whole_range = Interval(-1., 1.)

	if (misc.wid(x) > constants.PI_TWICE.lo) { return whole_range } 

	var lo_quadrant = Math.min(
							trigonometric.find_quadrant(x.lo).lo, 
							trigonometric.find_quadrant(x.lo).hi
							)

	var hi_quadrant = Math.max(
							trigonometric.find_quadrant(x.hi).lo,
							trigonometric.find_quadrant(x.hi).hi
							)  

	var lo_quadrant = lo_quadrant % 4
	var hi_quadrant = hi_quadrant % 4

	// Mapping negative quadrant notation to positive quadrant notation.
	if (lo_quadrant == -1) {
		var lo_quadrant = 3
	}
	else if (lo_quadrant == -2) {
		var lo_quadrant = 2
	}
	else if (lo_quadrant == -3){
		var lo_quadrant = 1
	}
	else if (lo_quadrant == -4){
		var lo_quadrant = 0
	}

	if (hi_quadrant == -1) {
		var hi_quadrant = 3
	}
	else if (hi_quadrant == -2) {
		var hi_quadrant = 2
	}
	else if (hi_quadrant == -3){
		var hi_quadrant = 1
	}
	else if (hi_quadrant == -4){
		var hi_quadrant = 0
	}

	// Different cases according to the quadrant(s) x lies in.
	if (lo_quadrant == hi_quadrant) {
		if (misc.wid(x) > constants.PI.lo) { return whole_range }
		var lo = Interval(rmath.sinLo(x.lo), rmath.sinHi(x.lo))
		var hi = Interval(rmath.sinLo(x.hi), rmath.sinHi(x.hi))	
		return misc.hull(lo, hi)
	}

	else if (lo_quadrant==3 && hi_quadrant==0) {
		return Interval(rmath.sinLo(x.lo), rmath.sinHi(x.hi))
	}
	else if (lo_quadrant==1 && hi_quadrant==2) {
		return Interval(rmath.sinLo(x.hi), rmath.sinHi(x.lo))
	}
	else if ((lo_quadrant==0 || lo_quadrant==3 ) && ( hi_quadrant==1 || hi_quadrant==2)) {
		return Interval(Math.min(rmath.sinLo(x.lo), rmath.sinLo(x.hi)), 1.)
	}
	else if ((lo_quadrant==1 || lo_quadrant==2 ) && ( hi_quadrant==3 || hi_quadrant==0)) {
		return Interval(-1., Math.max(rmath.sinHi(x.lo), rmath.sinHi(x.hi)))
	}
	else {
		return whole_range
	}
}

// cos(x)
trigonometric.cos = function (x) {
	// In case an empty set is inserted
	if (utils.isEmpty(x)) { return constants.EMPTY }

	return trigonometric.sin(
			arithmetic.add(x, constants.PI_HALF)
			)
}

// tan(x) = sin(x)/cos(x)
trigonometric.tan = function (x) {
	if (utils.isEmpty(x)) { return constants.EMPTY }
	if (utils.zeroIn(trigonometric.cos(x)) == true) { 
		return  division.zero(trigonometric.sin(x))
	}
	else { 
			return division.nonZero(
				trigonometric.sin(x),
				trigonometric.cos(x)
			   )
	}
}

// cot(x) = 1/tan(x)
trigonometric.cot = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (utils.zeroIn(trigonometric.tan(x)) == true) {
		return division.zero(constants.ONE)
  }
  else {
		return division.nonZero(
				constants.ONE,
				trigonometric.tan(x)
			   )
  }
}

// asin(X)
trigonometric.asin = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.lo <= -1 ? -constants.PI_HALF_HIGH : rmath.asinLo(x.lo)
  var hi = x.hi >= 1 ? constants.PI_HALF_HIGH : rmath.asinHi(x.hi)
  return Interval(lo, hi)
}


// acos(X)
trigonometric.acos = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.hi >= 1 ? 0 : rmath.acosLo(x.hi)
  var hi = x.lo <= -1 ? constants.PI_HIGH : rmath.acosHi(x.lo)
  return Interval(lo, hi)
}

// atan(X)
trigonometric.atan = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.atanLo(x.lo), rmath.atanHi(x.hi))
}

// sinh(X)
trigonometric.sinh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.sinhLo(x.lo), rmath.sinhHi(x.hi))
}

// cosh(X)
trigonometric.cosh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (x.hi < 0) {
    return Interval(
      rmath.coshLo(x.hi),
      rmath.coshHi(x.lo)
    )
  } else if (x.lo >= 0) {
    return Interval(
      rmath.coshLo(x.lo),
      rmath.coshHi(x.hi)
    )
  } else {
    return Interval(
      1,
      rmath.coshHi(-x.lo > x.hi ? x.lo : x.hi)
    )
  }
}

// tanh(X)
trigonometric.tanh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.tanhLo(x.lo), rmath.tanhHi(x.hi))
}

// TODO: inverse hyperbolic functions (asinh, acosh, atanh)

module.exports = trigonometric
