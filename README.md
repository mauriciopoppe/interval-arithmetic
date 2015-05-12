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
    - [`instance.setWhole()`](#instancesetwhole)
    - [`instance.setEmpty()`](#instancesetempty)
    - [`instance.toArray()`](#instancetoarray)
  - [Operations](#operations)
    - [`Interval.add(x, y)`](#intervaladdx-y)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

An `interval` is a pair of numbers which represents all the numbers between them, by `closed` we
mean that the bounds are also included in the representation, `extended real` because the 
`real number system` is extended with two elements: `-∞` and `+∞` representing negative infinity
and positive infinity respectively.

The implementation is a modified port of [C++ boost implementation of interval arithmetic](http://www.boost.org/doc/libs/1_58_0/libs/numeric/interval/doc/interval.htm),
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
therefore to get the next floating point number of a single precision number means that the last
bit needs to be incremented for the upper bound, and the last bit also needs to be decremented
to get the lower point

### Notable modifications

- Custom next/previous IEEE754 floating number implementation based on [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
- Division when both intervals contain zero create a whole interval
- `cos` works with positive/negative values

## Installation

```sh
$ npm install --save interval-arithmetic
```

## API

```javascript
var Interval = require('interval-arithmetic');
```

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

Computes x + y

**params**
* `x` {Interval}
* `y` {Interval}

**returns** {Interval}

[npm-image]: https://nodei.co/npm/interval-arithmetic.png?downloads=true
[npm-url]: https://npmjs.org/package/interval-arithmetic
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic
[coveralls-image]: https://coveralls.io/repos/maurizzzio/interval-arithmetic/badge.svg
[coveralls-url]: https://coveralls.io/r/maurizzzio/interval-arithmetic
