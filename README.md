# interval-arithmetic 

[![NPM][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Stability](https://img.shields.io/badge/stability-stable-green.svg)](https://nodejs.org/api/documentation.html#apicontent)

> An implementation of an algebraically closed interval system of the extended real number set

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
  - [floating point operations](#floating-point-operations)
  - [Interval arithmetic](#interval-arithmetic)
  - [Notable modifications](#notable-modifications)
- [Interval arithmetic evaluator](#interval-arithmetic-evaluator)
- [Installation](#installation)
- [API](#api)
  - [Instance constructor](#instance-constructor)
    - [`instance = Interval()`](#instance--interval)
    - [`instance = Interval(v)`](#instance--intervalv)
    - [`instance = Interval(hi, lo)`](#instance--intervalhi-lo)
  - [Instance methods](#instance-methods)
    - [`instance.set(lo, hi)`](#instancesetlo-hi)
    - [`instance.assign(lo, hi)`](#instanceassignlo-hi)
    - [`instance.singleton(v)`](#instancesingletonv)
    - [`instance.bounded(lo, hi)`](#instanceboundedlo-hi)
    - [`instance.boundedSingleton(v)`](#instanceboundedsingletonv)
    - [`instance.setWhole()`](#instancesetwhole)
    - [`instance.setEmpty()`](#instancesetempty)
    - [`instance.toArray()`](#instancetoarray)
  - [Operations](#operations)
    - [`Interval.add(x, y)`](#intervaladdx-y)
    - [`Interval.sub(x, y)`](#intervalsubx-y)
    - [`Interval.mul(x, y)`](#intervalmulx-y)
    - [`Interval.div(x, y)`](#intervaldivx-y)
    - [`Interval.fmod(x, y)`](#intervalfmodx-y)
    - [`Interval.min(x, y)`](#intervalminx-y)
    - [`Interval.max(x, y)`](#intervalmaxx-y)
    - [`Interval.hull(x, y)`](#intervalhullx-y)
    - [`Interval.intersection(x, y)`](#intervalintersectionx-y)
    - [`Interval.union(x, y)`](#intervalunionx-y)
    - [`Interval.difference(x, y)`](#intervaldifferencex-y)
    - [`Interval.negative(x)`](#intervalnegativex)
    - [`Interval.positive(x)`](#intervalpositivex)
    - [`Interval.multiplicativeInverse(x)`](#intervalmultiplicativeinversex)
    - [`Interval.pow(x, y)`](#intervalpowx-y)
    - [`Interval.sqrt(x)`](#intervalsqrtx)
    - [`Interval.nthRoot(x, n)`](#intervalnthrootx-n)
    - [`Interval.sin(x)`](#intervalsinx)
    - [`Interval.cos(x)`](#intervalcosx)
    - [`Interval.tan(x)`](#intervaltanx)
    - [`Interval.cot(x)`](#intervalcotx)
    - [`Interval.asin(x)`](#intervalasinx)
    - [`Interval.acos(x)`](#intervalacosx)
    - [`Interval.atan(x)`](#intervalatanx)
    - [`Interval.sinh(x)`](#intervalsinhx)
    - [`Interval.cosh(x)`](#intervalcoshx)
    - [`Interval.tanh(x)`](#intervaltanhx)
    - [`Interval.exp(x)`](#intervalexpx)
    - [`Interval.log(x)`](#intervallogx)
    - [`Interval.log10(x)`](#intervallog10x)
    - [`Interval.log2(x)`](#intervallog2x)
    - [`Interval.clone(x)`](#intervalclonex)
  - [Relational](#relational)
    - [`Interval.equal(x, y)`](#intervalequalx-y)
    - [`Interval.notEqual(x, y)`](#intervalnotequalx-y)
    - [`Interval.gt(x, y)`](#intervalgtx-y)
    - [`Interval.lt(x, y)`](#intervalltx-y)
    - [`Interval.geq(x, y)`](#intervalgeqx-y)
    - [`Interval.leq(x, y)`](#intervalleqx-y)
  - [Utilities](#utilities)
    - [`Interval.isInterval(x)`](#intervalisintervalx)
    - [`Interval.isEmpty(x)`](#intervalisemptyx)
	- [`Interval.isPositive(x)`](#intervalispositivex)
	- [`Interval.isNotNegative(x)`](#intervalisnotnegativex)
    - [`Interval.isZero(x)`](#intervaliszerox)
    - [`Interval.isWhole(x)`](#intervaliswholex)
    - [`Interval.zeroIn(x)`](#intervalzeroinx)
    - [`Interval.hasValue(x, v)`](#intervalhasvaluex-v)
    - [`Interval.hasInterval(x, y)`](#intervalhasintervalx-y)
    - [`Interval.intervalsOverlap(x, y)`](#intervalintervalsoverlapx-y)
    - [`Interval.isSingleton(x)`](#intervalissingletonx)
  - [Misc](#misc)
	- [`Interval.wid(x)`](#intervalwidx)
	- [`Interval.rad(x)`](#intervalradx)
	- [`Interval.mid(x)`](#intervalmidx)
	- [`Interval.mag(x)`](#intervalmagx)
	- [`Interval.mig(x)`](#intervalmigx)
	- [`Interval.dev(x)`](#intervaldevx)
	- [`Interval.abs(x)`](#intervalabsx)
  - [Constants](#constants)
    - [`Interval.ZERO`](#intervalzero)
    - [`Interval.ONE`](#intervalone)
    - [`Interval.WHOLE`](#intervalwhole)
    - [`Interval.EMPTY`](#intervalempty)
    - [`Interval.PI`](#intervalpi)
    - [`Interval.PI_HALF`](#intervalpi_half)
    - [`Interval.PI_TWICE`](#intervalpi_twice)
  - [Floating point rounding](#floating-point-rounding)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

An `interval` is a pair of numbers which represents all the numbers between them, `closed` 
means that the bounds are also included in the representation, `extended real` because the 
`real number system` is extended with two elements: `-$\infty$` and `+$\infty$` representing negative infinity
and positive infinity respectively.

The implementation is a modified port of the [Boost's interval arithmetic library](http://www.boost.org/doc/libs/1_58_0/libs/numeric/interval/doc/interval.htm),
the modifications are based on some guidelines from the following papers/presentations/books:

1. [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
2. [Interval Arithmetic: Python Implementation and Applications - Stefano Taschini](http://conference.scipy.org/proceedings/scipy2008/paper_3/full_text.pdf)
3. [The Boost interval arithmetic library - Hervé Brönnimann, Guillaume Melquiond, Sylvain Pion](https://www.lri.fr/~melquion/doc/03-rnc5-expose.pdf)
4. [Graphing equations with generalized interval arithmetic - Jeffrey Allen Tupper](http://www.dgp.toronto.edu/~mooncake/thesis.pdf)
5. [Global Optimization using Interval Analysis - Eldon Hansen](http://www.amazon.com/Optimization-Interval-Analysis-Applied-Mathematics/dp/0824786963/ref=sr_1_1?s=books&ie=UTF8&qid=1459795825&sr=1-1&keywords=interval+analysis+hansen)
6. [C++ Toolbox for Verified Computing I: Basic Numerical Problems - R.Hammer, M.Hocks, U.Kulisch, D.Ratz](http://www.amazon.com/Toolbox-Verified-Computing-Numerical-Algorithms/dp/3642796532)
7. [Validated Numerics: A Short Introduction to Rigorous Computations, W. Tucker, Princeton University Press (2010)](http://press.princeton.edu/titles/9488.html)
8. [С.П. Шарый Конечномерный интервальный анализ. – Новосибирск: XYZ, 2016](http://www.nsc.ru/interval/Library/InteBooks/SharyBook.pdf)

The trigonometric functions implementation was heavily influenced by the code from [ValidatedNumerics.jl](https://github.com/mlliarm/ValidatedNumerics.jl) project.

### floating point operations

Floating point is a way to represent a real number in an approximate way (due to the finite
space existing on a computer), most calculations with real numbers will produce quantities that
cannot be exactly represented with the space allocated and therefore this operation needs
to be rounded in order to fit back into its finite representation, such errors are described in
more detail [here](http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html#689)

### Interval arithmetic

Instead of using a single floating point number as an approximation of a real number, interval
arithmetic represents the approximated value as a set of possible values (considering the numbers
that floating point cannot represent), let's say we want to represent the number `1 / 3`, as a single
floating point number it's approximated as `0.333333333333...`, in the end there will be some `333...`
decimals that will be lost due to the nature of floating point, instead we can represent this
number with the interval `[0.2, 0.4]`, with this interval we're completely sure that `1 / 3` is within
the interval (although the interval is also representing many more numbers), to improve the `scope`
of the interval we have to understand that numbers in JavaScript are represented with 64 bits,
therefore to get the next floating point number of a single precision number the last bit 
needs to be incremented to get the upper bound, and the last bit also needs to be decremented
to get the lower point

### Notable modifications

- next/previous IEEE754 floating point number implementation based on [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
- `division` when both intervals contain zero creates a whole interval
- `cosine, tangent` works with positive/negative values out of the box

## Interval arithmetic evaluator

Due to the expressive nature of the way the methods interact with intervals it's sad that even the simplest
operation needs a lot of characters to be typed, let's consider evaluating the result of `1 + 2` expressed
with intervals

```javascript
Interval.add(new Interval(1, 1), new Interval(2, 2))
```

This gets worse when the expression to be evaluated becomes complex like `sin(exp(x)) + tan(x) - 1/cos(PI) * [1, 3]^2`:

```javascript
var x = Interval(0, 1);
Interval.add(
  Interval.sin(Interval.exp(x)),
  Interval.sub(
    Interval.tan(x),
    Interval.mul(
      Interval.div(Interval.ONE, Interval.cos(Interval.PI)),
      Interval.pow(Interval(1, 3), 2)
    )
  )
);
```

To avoid this 'expressiveness' mess there's an [interval arithmetic evaluator module](https://github.com/maurizzzio/interval-arithmetic-eval)
which I've created to deal with all the work of parsing/evaluating expressions like the one above

```javascript
var compile = require('interval-arithmetic-eval');
compile('sin(exp(x)) + tan(x) - 1/cos(PI) * [1, 3]^2').eval({ x: [0, 1] })
```

## Installation

```sh
$ npm install --save interval-arithmetic
```

## API

```javascript
var Interval = require('interval-arithmetic');
```

Usage examples can be found on the files located in the `test` folder

### Instance constructor

#### `instance = Interval()`

If the default constructor doesn't receive parameters then the interval represents the number zero
e.g. `[0, 0]`

#### `instance = Interval(v)`

**params**
* `v` {number} the number to be represented in the interval

**by default** the interval
is not bounded with the higher/lower floating point number, e.g. `1 / 3` is represented as
`[0.3333333333333333, 0.3333333333333333]`, see `#singleton, #bounded` to represent the interval in a
conservative way

#### `instance = Interval(hi, lo)`

**params**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

**by default** the interval is not bounded with the next/previous floating point number, e.g.
`1/3, 2/3` is represented as `[0.3333333333333333, 0.6666666666666666]`, see `#bounded` to
represent the interval in a conservative way

**alias** `Instance.factory`

### Instance methods

#### `instance.set(lo, hi)`

**params**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

Sets the bounds of the interval without considering the next/previous floating point number

#### `instance.assign(lo, hi)`

**params**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

Sets the bounds of the interval considering the next/previous floating point number and also the
validity of the params, namely that `lo <= hi` and that `lo` and `hi` are valid numbers

#### `instance.singleton(v)`

**params**
* `v` {number} the number to be represented as an interval

Sets the bounds of the interval with the values `[v, v]`, useful if it's known that a real number
can be precisely determined using floating point notation

e.g. `instance.singleton(1) = { lo: 1, hi: 1 }`

#### `instance.bounded(lo, hi)`

**params**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

Sets the bounds of the interval with the values `[prev(lo), next(hi)]`, `prev` is a function which
computes the previous double floating number, `next` is a function which computes the next double
floating number

e.g. `instance.bounded(1, 2) = { lo: 0.9999999999999999, hi: 2.0000000000000004 }`

#### `instance.boundedSingleton(v)`

**params**
* `v` {number} the number to be represented as an interval

Sets the bounds of the interval with the values `[prev(v), next(v)]`, `prev` is a function which
computes the previous double floating number, `next` is a function which computes the next double
floating number, useful when a real number can't be precisely determined using floating point
notation

e.g. `instance.boundedSingleton(1 / 3) = { lo: 0.33333333333333326, hi: 0.33333333333333337 }`

#### `instance.setWhole()`

Sets the bounds of the interval with the values `[-Infinity, Infinity]`

#### `instance.setEmpty()`

Sets the bounds of the interval with the values `[Infinity, -Infinity]`, an empty interval is one
whose `lo` bound is higher than the `hi` bound

#### `instance.toArray()`

**returns** {Array}

Returns an array representing the interval e.g. `[lo, hi]`

### Operations

All operations consider the parameters immutable and always return another interval

#### `Interval.add(x, y)`

Computes `x + y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.sub(x, y)`

Computes `x - y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.mul(x, y)`

Computes `x * y`, an explanation of all the possible cases can be found on
[Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.div(x, y)`

Computes `x / y`, an explanation of all the possible cases can be found on
[Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)

NOTE: an extreme case of division might results in multiple intervals, unfortunately this library doesn't
support multi-interval arithmetic yet so a single interval will be returned instead with the hull of the 
resulting intervals (this is the way Boost implements it too)

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.fmod(x, y)`

Computes `x % y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.min(x, y)`

Computes the min of `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.max(x, y)`

Computes the max of `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.hull(x, y)`

Computes the interval that contains both `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.intersection(x, y)`

Computes the interval that intersects both `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

#### `Interval.union(x, y)`

Computes the interval that is the union of `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

**throws** TypeError if `x` and `y` don't overlap

#### `Interval.difference(x, y)`

Computes the difference between two intervals

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

**throws** TypeError if the difference creates multiple intervals

#### `Interval.negative(x)`

Computes `-x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.positive(x)`

Computes `+x` (Identity)

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.multiplicativeInverse(x)`

Computes `1 / x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.pow(x, y)`

Computes `x ^ y`

**params**
* `x` {Interval}
* `y` {number|Interval} `y` must be an integer or a singleton interval that encodes an integer, for rational power use [nth-root](#intervalnthrootx-n) instead

**returns** {Interval}

#### `Interval.sqrt(x)`

Computes `sqrt(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.nthRoot(x, n)`

Computes the nth root of x i.e. `x ^ (1/n)`

**params**

* `x` {Interval}
* `y` {number|Interval} `y` is a number or a singleton interval

**returns** {Interval}

#### `Interval.sin(x)`

Computes `sin(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.cos(x)`

Computes `cos(x)`,works only for positive intervals (for now)

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.tan(x)`

Computes `tan(x)` ,works only for positive intervals (for now)

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.cot(x)`

Computes `cot(x)` ,works only for positive intervals (for now)

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.asin(x)`

Computes `asin(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.acos(x)`

Computes `acos(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.atan(x)`

Computes `atan(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.sinh(x)`

Computes the hyperbolic sine of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.cosh(x)`

Computes the hyperbolic cosine of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.tanh(x)`

Computes the hyperbolic tangent of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.exp(x)`

Computes `e^x` where `e` is the base of the natural logarithm

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.log(x)`

Computes the natural logarithm (base `e`) of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.log10(x)`

Computes the logarithm (base `10`) of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.log2(x)`

Computes the logarithm (base `2`) of `x`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.clone(x)`

Creates a clone of the interval `x`

**params**
* `x` {Interval}

**returns** {Interval}

### Relational

#### `Interval.equal(x, y)`

Checks if the interval `x` equals `y` (exact matching of bounds)

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` equals `y`, `false` otherwise

#### `Interval.notEqual(x, y)`

Checks if the interval `x` is not equal to `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is not equal to `y`, `false` otherwise

#### `Interval.gt(x, y)`

Checks if the interval `x` is greater than `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is greater than `y`, `false` otherwise

#### `Interval.lt(x, y)`

Checks if the interval `x` is less than `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is less than `y`, `false` otherwise

#### `Interval.geq(x, y)`

Checks if the interval `x` is greater/equal than `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is greater/equal than `y`, `false` otherwise

#### `Interval.leq(x, y)`

Checks if the interval `x` is less/equal than `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is less/equal than `y`, `false` otherwise

### Utilities

#### `Interval.isInterval()`

Checks if the given parameter `x` is an interval

**params**
* `x` {*} 

**returns** {boolean} `true` if x is an interval, `false` otherwise

#### `Interval.isEmpty(x)`

Checks if the interval `x` represents an empty interval

**params**
* `x` {Interval}

**returns** {boolean} `true` if it's empty, `false` otherwise

#### `Interval.isPositive(x)`

Checks if the interval `x` represents a positive interval (0, \infty)

**params**
* `x` {Interval}

**returns** {boolean} `true` if x.lo > 0, `false` otherwise

#### `Interval.isNotNegative(x)`

Checks if the interval `x` represents a non negative interval [0, \infty)

**params**
* `x` {Interval}

**returns** {boolean} `true` if x.lo >= 0, `false` otherwise

#### `Interval.isZero(x)`

Checks if the interval `x` represents the interval [0,0]

**params**
* `x` {Interval}

**returns** {boolean} `true` if x.lo == 0 and x.hi == 0, `false` otherwise

#### `Interval.isWhole(x)`

Checks if the interval `x` represents an whole interval, that is it covers
all the real numbers `[-Infinity, Infinity]`

**params**
* `x` {Interval}

**returns** {boolean} `true` if represents a whole interval, `false` otherwise

#### `Interval.zeroIn(x)`

Checks if the interval `x` contains 0

**params**
* `x` {Interval}

**returns** {boolean} `true` if it contains zero, `false` otherwise

#### `Interval.hasValue(x, v)`

Checks if the interval `x` contains the value `v`

**params**
* `x` {Interval}
* `v` {number}

**returns** {boolean} `true` if it contains the value `v`, `false` otherwise

#### `Interval.hasInterval(x, y)`

Checks if the interval `x` is a subset of the interval `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is a subset of `y`, `false` otherwise

#### `Interval.intervalsOverlap(x, y)`

Checks if the interval `x` overlaps with interval `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` overlaps `y`, `false` otherwise

#### `Interval.isSingleton(x)`

Checks if the interval `x` represents a single value (unbounded)

**params**
* `x` {Interval}

**returns** {boolean} `true` if it `x` is a singleton, `false` otherwise

### Misc

#### `Interval.wid(x)`

Computes the distance between the lower and upper bounds of `x`, the width of the interval

**params**
* `x` {Interval}

**returns** {number} `x.hi - x.lo` rounded to the next floating point number

#### `Interval.rad(x)`

Computes the radius of an interval `x`

**params**
* `x` {Interval}

**returns** {number} `0.5*wid(x)` 

#### `Interval.mid(x)`

Computes the point which lies in the middle of the interval `x`

**params**
* `x` {Interval}

**returns** {number} `0.5*(x.lo + x.hi)` rounded to the next floating point number

#### `Interval.mag(x)`

Computes the magnitude of an interval `x` (the biggest distance to the origin attained by elements of x)

**params**
* `x` {Interval}

**returns** {number} `max{abs(x.lo),abs(x.hi)}`

#### `Interval.mig(x)`

Computes the mignitude of an interval `x` (the smallest distance to the origin attained by elements of x)

**params**
* `x` {Interval}

**returns** {number} `min{abs(x.lo),abs(x.hi)}` , if 0 $\notin$ x

**returns** {number} 0 , if 0 $\in$ x

#### `Interval.dev(x)`

Computes the deviance from point zero

**params**
* `x` {Interval}

**returns** {number} `x.lo` , if |x.lo| $\geq$ |x.hi|

**returns** {number} `x.hi`, else

#### `Interval.abs(x)`

Computes the absolute value of the interval `x`. Note that in contrast to the previous measures of size and distance,
this returns an interval.

**params**
* `x` {Interval}

**returns** {Interval} `[mig(x), mag(x)]`

### Constants

#### `Interval.ZERO`

Representation of the number zero: `{ lo: 0, hi: 0 }`

#### `Interval.ONE`

Representation of the number one: `{ lo: 1, hi: 1 }`

**returns** {Interval}

#### `Interval.WHOLE`

An interval representing all the numbers `{ lo: -Infinity, hi: Infinity }`

**returns** {Interval}

#### `Interval.EMPTY`

An interval representing no numbers `{ lo: Infinity, hi: -Infinity } `

**returns** {Interval}

#### `Interval.PI`

Interval representation of PI (bounded correctly), `{ lo: 3.141592653589793, hi: 3.1415926535897936 }`

**returns** {Interval}

#### `Interval.PI_HALF`

Interval representation of PI / 2 (bounded correctly), `{ lo: 1.5707963267948966, hi: 1.5707963267948968 }`

**returns** {Interval}

#### `Interval.PI_TWICE`

Interval representation of PI * 2 (bounded correctly), `{ lo: 6.283185307179586, hi: 6.283185307179587 }`

**returns** {Interval}

### Floating point rounding

Rounding to the next/previous floating point number is enabled by default on all operations, to enable/disabled
the rounding operation execute:

```javascript
// disable rounding
Interval.round.disable();

// enable rounding
Interval.round.enable();
```

## Development

```sh
npm start

```

## Thanks

I'd like to thank Mauricio Poppe for this wonderful library and documentation he's created which are great to build upon and also learn how to craft beautiful pieces of understandable code.

2015 © Mauricio Poppe

2016 © MiLia

[npm-image]: https://img.shields.io/npm/v/interval-arithmetic.svg?style=flat
[npm-url]: https://npmjs.org/package/interval-arithmetic
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic
[coveralls-image]: https://coveralls.io/repos/maurizzzio/interval-arithmetic/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/maurizzzio/interval-arithmetic?branch=master
[david-image]: https://david-dm.org/maurizzzio/interval-arithmetic.svg
[david-url]: https://david-dm.org/maurizzzio/interval-arithmetic
