/*
 * interval-arithmetic
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

'use strict'

function shallowExtend () {
  var dest = arguments[0]
  var p
  for (var i = 1; i < arguments.length; i += 1) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        dest[p] = arguments[i][p]
      }
    }
  }
}

require('./lib/polyfill')
module.exports = require('./lib/interval')
module.exports.rmath = require('./lib/round-math')

shallowExtend(
  module.exports,
  require('./lib/constants'),
  require('./lib/operations/relational'),
  require('./lib/operations/arithmetic'),
  require('./lib/operations/algebra'),
  require('./lib/operations/trigonometric'),
  require('./lib/operations/misc'),
  require('./lib/operations/utils')
)
