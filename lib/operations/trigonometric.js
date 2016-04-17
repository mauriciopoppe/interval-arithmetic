/**
 * Created by mauricio on 5/10/15.
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


/****************************** MAURICIO CODE ***********************************************

trigonometric.cos = function (x) {
  var rlo, rhi
  if (utils.isEmpty(x)) { return constants.EMPTY }

  // cos works with positive intervals only
  if (x.lo < 0) {
    var mult = 1e7
    x.lo += 2 * Math.PI * mult
    x.hi += 2 * Math.PI * mult
  }
  //if (utils.isPositive(x)) {
	  var pi2 = constants.PI_TWICE
	  var t = algebra.fmod(x, pi2)
	  if (misc.wid(t) >= pi2.lo) {
		return Interval(-1, 1)
	  }

	  // when t.lo > pi it's the same as
	  // -cos(t - pi)
	  if (t.lo >= constants.PI_HIGH) {
		var cos = trigonometric.cos(
		  arithmetic.sub(t, constants.PI)
		)
		return arithmetic.negative(cos)
	  }

	  var lo = t.lo
	  var hi = t.hi
	  rlo = rmath.cosLo(hi)
	  rhi = rmath.cosHi(lo)
	  // it's ensured that t.lo < pi and that t.lo >= 0
	  if (hi <= constants.PI_LOW) {
		// when t.hi < pi
		// [cos(t.lo), cos(t.hi)]
		return Interval(rlo, rhi)
	  } else if (hi <= pi2.lo) {
		// when t.hi < 2pi
		// [-1, max(cos(t.lo), cos(t.hi))]
		return Interval(-1, Math.max(rlo, rhi))
	  } else {
		// t.lo < pi and t.hi > 2pi
		return Interval(-1, 1)
	  }
	}
	else{
		return arithmetic.negative(trigonometric.sin(x))
	}
}


trigonometric.sin = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (utils.isZero(x)) {return Interval(0) }	
  return trigonometric.cos(
    arithmetic.sub(x, constants.PI_HALF)
  )
}


trigonometric.tan = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  if (utils.isZero(x)) {return Interval(0) }
  // // tan works with positive intervals only
  if (x.lo < 0) {
    var mult = 1e7
    x.lo += 2 * Math.PI * mult
    x.hi += 2 * Math.PI * mult
  }

  var pi = constants.PI
  var t = algebra.fmod(x, pi)
  if (t.lo >= constants.PI_HALF_LOW) {
    t = arithmetic.sub(t, pi)
  }
  if (t.lo <= -constants.PI_HALF_LOW || t.hi >= constants.PI_HALF_LOW) {
    return constants.WHOLE
  }
  return Interval(
    rmath.tanLo(t.lo),
    rmath.tanHi(t.hi)
  )
}

************************************MAURICIO CODE**************************************************/
// Ideas taken from ValidatedNumerics.jl

// First we'll create a function that'll decide in which quadrant of the trig. circle our interval belongs.

trigonometric.find_quandrant = function (x) {
	var temp = division.nonZero(Interval(x), constants.PI_HALF)
	return Interval(Math.floor(temp.lo), Math.floor(temp.hi))
}

//As in Validated Numerics: A Short Introduction to Rigorous Computations, W. Tucker, 
//Princeton University Press (2010), Chapter 3.
trigonometric.sin = function (x) {
	var whole_range = Interval(-1., 1.)

	if (misc.wid(x) > constants.PI_HALF.lo) { return whole_range }

	var lo_quadrant = Math.min(
							trigonometric.find_quandrant(x.lo).lo, 
							trigonometric.find_quandrant(x.lo).hi
							)

	var hi_quadrant = Math.max(
							trigonometric.find_quandrant(x.hi).lo,
							trigonometric.find_quandrant(x.hi).hi
							)  

	var lo_quadrant = lo_quadrant % 4
	var hi_quadrant = hi_quadrant % 4

	// In case an empty set is inserted
	if (utils.isEmpty(x)) { return constants.EMPTY }

	// Different cases according to the quadrant(s) x lies in.
	if (lo_quadrant == hi_quadrant) {
		if (misc.wid(x) > constants.PI_LOW) { return whole_range }			
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
	else if (( lo_quadrant==0 || lo_quadrant==3 ) && ( hi_quadrant==1 || hi_quadrant==2 )) {
		return Interval(Math.min(rmath.sinLo(x.lo), rmath.sinLo(x.hi)), 1.)
	}
	else if (( lo_quadrant==1 || lo_quadrant==2 ) && ( hi_quadrant==3 || hi_quadrant==0 )) {
		return Interval(-1., Math.max(rmath.sinHi(x.lo), rmath.sinHi(x.hi)))
	}
	else {// if (( lo_quadrant == 0 && hi_quadrant==3 ) || ( lo_quadrant == 2 && hi_quadrant==1 )){
		return whole_range
	}
}

trigonometric.cos = function (x) {
	// In case an empty set is inserted
	if (utils.isEmpty(x)) { return constants.EMPTY }
	return trigonometric.sin(
		arithmetic.add(x, constants.PI_HALF))
}

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

trigonometric.asin = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.lo <= -1 ? -constants.PI_HALF_HIGH : rmath.asinLo(x.lo)
  var hi = x.hi >= 1 ? constants.PI_HALF_HIGH : rmath.asinHi(x.hi)
  return Interval(lo, hi)
}

trigonometric.acos = function (x) {
  if (utils.isEmpty(x) || x.hi < -1 || x.lo > 1) {
    return constants.EMPTY
  }
  var lo = x.hi >= 1 ? 0 : rmath.acosLo(x.hi)
  var hi = x.lo <= -1 ? constants.PI_HIGH : rmath.acosHi(x.lo)
  return Interval(lo, hi)
}

trigonometric.atan = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.atanLo(x.lo), rmath.atanHi(x.hi))
}

trigonometric.sinh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.sinhLo(x.lo), rmath.sinhHi(x.hi))
}

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

trigonometric.tanh = function (x) {
  if (utils.isEmpty(x)) { return constants.EMPTY }
  return Interval(rmath.tanhLo(x.lo), rmath.tanhHi(x.hi))
}

// TODO: inverse hyperbolic functions (asinh, acosh, atanh)

module.exports = trigonometric
