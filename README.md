# interval-arithmetic [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

[![NPM][npm-image]][npm-url]

> An implementation of an algebraically closed interval system of the extended real number set

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
  - [floating point operations](#floating-point-operations)
  - [Interval arithmetic](#interval-arithmetic)
  - [Notable modifications](#notable-modifications)
- [Installation](#installation)
- [API](#api)
  - [Constructor](#constructor)
    - [`instance = new Interval()`](#instance--new-interval)
    - [`instance = new Interval(v)`](#instance--new-intervalv)
    - [`instance = new Interval(hi, lo)`](#instance--new-intervalhi-lo)
    - [`instance.set(lo, hi)`](#instancesetlo-hi)
    - [`instance.assign(lo, hi)`](#instanceassignlo-hi)
    - [`instance.bounded(lo, hi)`](#instanceboundedlo-hi)
    - [`instance.singleton(v)`](#instancesingletonv)
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
    - [`Interval.intersect(x, y)`](#intervalintersectx-y)
    - [`Interval.negative(x)`](#intervalnegativex)
    - [`Interval.positive(x)`](#intervalpositivex)
    - [`Interval.multiplicativeInverse(x)`](#intervalmultiplicativeinversex)
    - [`Interval.pow(x, y)`](#intervalpowx-y)
    - [`Interval.sqrt(x)`](#intervalsqrtx)
    - [`Interval.sin(x)`](#intervalsinx)
    - [`Interval.cos(x)`](#intervalcosx)
    - [`Interval.tan(x)`](#intervaltanx)
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
    - [`Interval.abs(x)`](#intervalabsx)
  - [Utilities](#utilities)
    - [`Interval.empty(x)`](#intervalemptyx)
    - [`Interval.zeroIn(x)`](#intervalzeroinx)
    - [`Interval.in(x, v)`](#intervalinx-v)
    - [`Interval.subset(x, y)`](#intervalsubsetx-y)
    - [`Interval.overlap(x, y)`](#intervaloverlapx-y)
    - [`Interval.singleton(x)`](#intervalsingletonx)
    - [`Interval.singleton(x)`](#intervalsingletonx-1)
    - [`Interval.equal(x, y)`](#intervalequalx-y)
    - [`Interval.width(x)`](#intervalwidthx)
  - [Constants](#constants)
    - [`Interval.ONE`](#intervalone)
    - [`Interval.WHOLE`](#intervalwhole)
    - [`Interval.EMPTY`](#intervalempty)
    - [`Interval.PI`](#intervalpi)
    - [`Interval.PI_HALF`](#intervalpi_half)
    - [`Interval.PI_TWICE`](#intervalpi_twice)
- [Development](#development)
- [TODO list](#todo-list)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

An `interval` is a pair of numbers which represents all the numbers between them, `closed` 
means that the bounds are also included in the representation, `extended real` because the 
`real number system` is extended with two elements: `-∞` and `+∞` representing negative infinity
and positive infinity respectively.

The implementation is a modified port of the [Boost's interval arithmetic library](http://www.boost.org/doc/libs/1_58_0/libs/numeric/interval/doc/interval.htm),
the modifications are based on some guidelines from the following papers/presentations:

- [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
- [Interval Arithmetic: Python Implementation and Applications - Stefano Taschini](http://conference.scipy.org/proceedings/scipy2008/paper_3/full_text.pdf)
- [The Boost interval arithmetic library - Hervé Brönnimann, Guillaume Melquiond, Sylvain Pion](https://www.lri.fr/~melquion/doc/03-rnc5-expose.pdf)
- [Graphing equations with generalized interval arithmetic - Jeffrey Allen Tupper](http://www.dgp.toronto.edu/~mooncake/thesis.pdf)

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
- `cosine` works with positive/negative values

## Installation

```sh
$ npm install --save interval-arithmetic
```

## API

```javascript
var Interval = require('interval-arithmetic');
```

Usage examples can be found on the files located in the `test` folder

### Constructor

#### `instance = new Interval()`

**properties**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

If the default constructor doesn't receive parameters then the interval represents the number zero
e.g. `[0, 0]`

#### `instance = new Interval(v)`

**params**
* `v` {number} the number to be represented in the interval

**by default** the interval
is not bounded with the higher/lower floating point number, e.g. `1 / 3` is represented as
`[0.3333333333333333, 0.3333333333333333]`, see `#singleton, #bounded` to represent the interval in a
conservative way

#### `instance = new Interval(hi, lo)`

**params**
* `lo` {number} the lower bound of the interval
* `hi` {number} the higher bound of the interval

**by default** the interval is not bounded with the next/previous floating point number, e.g.
`1/3, 2/3` is represented as `[0.3333333333333333, 0.6666666666666666]`, see `#bounded` to
represent the interval in a conservative way

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

#### `Interval.intersect(x, y)`

Computes the interval that intersects both `x` and `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

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
* `y` {number} **y needs to be an integer**

**returns** {Interval}

#### `Interval.sqrt(x)`

Computes `sqrt(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.sin(x)`

Computes `sin(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.cos(x)`

Computes `cos(x)`

**params**
* `x` {Interval}

**returns** {Interval}

#### `Interval.tan(x)`

Computes `tan(x)`

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

#### `Interval.abs(x)`

Computes `|x|`

**params**
* `x` {Interval}

**returns** {Interval}

### Utilities

#### `Interval.empty(x)`

Checks if the interval `x` represents an empty interval

**params**
* `x` {Interval}

**returns** {boolean} `true` if it's empty, `false` otherwise

#### `Interval.zeroIn(x)`

Checks if the interval `x` contains 0

**params**
* `x` {Interval}

**returns** {boolean} `true` if it contains zero, `false` otherwise

#### `Interval.in(x, v)`

Checks if the interval `x` contains the value `v`

**params**
* `x` {Interval}
* `v` {number}

**returns** {boolean} `true` if it contains the value `v`, `false` otherwise

#### `Interval.subset(x, y)`

Checks if the interval `x` is a subset of the interval `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` is a subset of `y`, `false` otherwise

#### `Interval.overlap(x, y)`

Checks if the interval `x` overlaps with interval `y`

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` overlaps `y`, `false` otherwise

#### `Interval.singleton(x)`

Checks if the interval `x` represents a single value (unbounded)

**params**
* `x` {Interval}

**returns** {boolean} `true` if it `x` is a singleton, `false` otherwise

#### `Interval.singleton(x)`

Checks if the interval `x` represents a single value (unbounded)

**params**
* `x` {Interval}

**returns** {boolean} `true` if it `x` is a singleton, `false` otherwise

#### `Interval.equal(x, y)`

Checks if the interval `x` equals `y` (exact matching of bounds)

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {boolean} `true` if it `x` equals `y`, `false` otherwise

#### `Interval.width(x)`

Computes the distance between the lower and upper bounds of `x`

**params**
* `x` {Interval}

**returns** {number} `x.hi - x.lo` rounded to the next floating point number

### Constants

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

## Development

Tests can be run with `npm test`

## TODO list

- [ ] comparison operator
- [ ] root finding port

2015 © Mauricio Poppe

[npm-image]: https://nodei.co/npm/interval-arithmetic.png?downloads=true
[npm-url]: https://npmjs.org/package/interval-arithmetic
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic
[coveralls-image]: https://coveralls.io/repos/maurizzzio/interval-arithmetic/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/maurizzzio/interval-arithmetic?branch=master
