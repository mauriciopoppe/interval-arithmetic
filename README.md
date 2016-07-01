# interval-arithmetic 

[![NPM][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url] 
[![Codecov Status][codecov-image]][codecov-url]
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
- [Development](#development)

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

See the [homepage](http://maurizzzio.github.io/interval-arithmetic/)

## Development

```sh
npm start
```

Deploy steps

```sh
// after the working directory is clean
(optional) npm version (major|minor|patch)
npm run deploy
// if everything went well
npm publish
```

2015 © Mauricio Poppe

[npm-image]: https://img.shields.io/npm/v/interval-arithmetic.svg?style=flat
[npm-url]: https://npmjs.org/package/interval-arithmetic
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic
[codecov-url]: https://codecov.io/github/maurizzzio/interval-arithmetic
[codecov-image]: https://img.shields.io/codecov/c/github/maurizzzio/interval-arithmetic.svg?style=flat
[david-image]: https://david-dm.org/maurizzzio/interval-arithmetic.svg
[david-url]: https://david-dm.org/maurizzzio/interval-arithmetic
