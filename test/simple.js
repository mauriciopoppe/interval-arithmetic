/** Simple script to run from terminal:
	node simple.js

	Prerequisities:
		a) npm install --save interval-arithmetic
		b) npm install mathjs
		c) replace the trigonometric.js in interval-arithmetic/lib/operations/ 
			with the version I'm sending you. The original doesn't have cot(x).
			I'll fix it so we'll have everything at: 
			https://github.com/mlliarm/interval-arithmetic

	You should see:

	sin([2,4])= { lo: -0.756802495307929, hi: 0.9092974268256819 }
	cos([2,4])= { lo: -1, hi: -0.41614683654714213 }
	tan([2,4])= { lo: -2.1850398632615238, hi: 1.1578212823495804 }
	cot([2,4])= { lo: -Infinity, hi: Infinity }

	sin([-4,4])= { lo: -1, hi: 1 }
	cos([-4,4])= { lo: -1, hi: 1 }
	tan([-4,4])= { lo: -Infinity, hi: Infinity }
	cot([-4,4])= { lo: -Infinity, hi: Infinity }

	sin([0,Pi])= { lo: -1.0426862989855588e-8, hi: 1 }
	cos([0,Pi]= { lo: -1, hi: 1.0000000000000002 }
	tan([0,Pi]= { lo: -Infinity, hi: Infinity }
	cot([0,Pi]= { lo: -Infinity, hi: Infinity }
**/
var Interval = require('interval-arithmetic')
var trigonometric = require('interval-arithmetic/lib/operations/trigonometric')
var cons = require('interval-arithmetic/lib/constants')
var math = require('mathjs')
var roots = require('interval-arithmetic/lib/operations/roots')

var X1 = Interval(2,4)
var X2 = Interval(-4,4)
var X3 = Interval(0,math.pi)
//console.log(X1)

console.log("sin([2,4])=",trigonometric.sin(X1))
console.log("cos([2,4])=",trigonometric.cos(X1))
console.log("tan([2,4])=",trigonometric.tan(X1))
console.log("cot([2,4])=",trigonometric.cot(X1))
console.log("")

console.log("sin([-4,4])=",trigonometric.sin(X2))
console.log("cos([-4,4])=",trigonometric.cos(X2))
console.log("tan([-4,4])=",trigonometric.tan(X2))
console.log("cot([-4,4])=",trigonometric.cot(X2))
console.log("")

console.log("sin([0,Pi])=",trigonometric.sin(X3))
console.log("cos([0,Pi]=",trigonometric.cos(X3))
console.log("tan([0,Pi]=",trigonometric.tan(X3))
console.log("cot([0,Pi]=",trigonometric.cot(X3))


var testFunc = function(X){
	return trigonometric.sin(X)
}

var dtestFunc = function(X){
	return trigonometric.cos(X)
}

console.log("")
//console.log("f,df=",roots.iNewton(testFunc,dtestFunc,X1))
console.log(roots.iNewton(testFunc,dtestFunc,X1))


