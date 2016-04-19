/*
 * interval-arithmetic
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

'use strict'
var extend = require('xtend/mutable')

require('./lib/polyfill')
module.exports = require('./lib/interval')

/**
 * Use {@link Interval.round} instead
 * @memberof Interval
 * @name Interval.rmath
 * @deprecated as of 0.6.4
 */
module.exports.rmath = require('./lib/round-math')

/**
 * Link to {@link module:interval-arithmetic/round-math}
 *
 * @memberof Interval
 * @name Interval.round
 */
module.exports.round = require('./lib/round-math')

extend(
  module.exports,
  require('./lib/constants'),
  require('./lib/operations/relational'),
  require('./lib/operations/arithmetic'),
  require('./lib/operations/algebra'),
  require('./lib/operations/trigonometric'),
  require('./lib/operations/misc'),
  require('./lib/operations/utils')
)
