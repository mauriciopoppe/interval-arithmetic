/**
 * Created by mauricio on 5/10/15.
 */
'use strict'
var mocha = require('mocha')
var describe = mocha.describe

require('./double')
require('./round-math')
require('./interval')
require('./library-structure')

describe('interval operations', function () {
  require('./operations/utils')
  require('./operations/relational')
  require('./operations/arithmetic')
  require('./operations/algebra')
  require('./operations/trigonometric')
  require('./operations/misc')
})
